"""
Custom middleware for VarnikaKart.
"""

import re
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib import messages
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth.models import User

class SuperuserRequiredMiddleware:
    """
    Middleware to ensure only superusers can access the admin pages.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the request path starts with /admin/ and not with /super-admin/
        if request.path.startswith('/admin/') and not request.path.startswith('/super-admin/'):
            # If the user is not authenticated or not a superuser
            if not request.user.is_authenticated or not request.user.is_superuser:
                # Add a message
                messages.error(request, _("You must be a superuser to access the admin area."))
                # Redirect to the super admin login page
                return redirect(reverse('superadmin_login') + f'?next={request.path}')

        # Continue with the request
        response = self.get_response(request)
        return response


class UserActivityMiddleware:
    """
    Middleware to track user activity.
    Updates the last_login field of the User model when a user makes a request.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Call the next middleware or view
        response = self.get_response(request)

        # Update last_login for authenticated users
        if request.user.is_authenticated:
            # Only update if it's been more than 15 minutes since last update
            # to avoid too many database writes
            last_login = request.user.last_login
            if not last_login or (timezone.now() - last_login).seconds > 900:  # 15 minutes = 900 seconds
                User.objects.filter(pk=request.user.pk).update(last_login=timezone.now())

        return response


class CartSessionMiddleware:
    """
    Middleware to handle cart sessions.
    Ensures that the cart is associated with the user when they log in.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Call the next middleware or view
        response = self.get_response(request)

        # Check if user just logged in
        if request.user.is_authenticated and getattr(request, 'user_just_logged_in', False):
            # Get the session key
            session_key = request.session.get('session_key')

            if session_key:
                # Import here to avoid circular imports
                from orders.models import Cart

                try:
                    # Try to get the anonymous cart
                    anonymous_cart = Cart.objects.get(session_id=session_key)

                    # Try to get the user's cart
                    try:
                        user_cart = Cart.objects.get(user=request.user)

                        # Merge the carts
                        for item in anonymous_cart.items.all():
                            # Check if the product is already in the user's cart
                            user_cart_item = user_cart.items.filter(product=item.product).first()

                            if user_cart_item:
                                # Update the quantity
                                user_cart_item.quantity += item.quantity
                                user_cart_item.save()
                            else:
                                # Move the item to the user's cart
                                item.cart = user_cart
                                item.save()

                        # Delete the anonymous cart
                        anonymous_cart.delete()

                    except Cart.DoesNotExist:
                        # If the user doesn't have a cart, associate the anonymous cart with the user
                        anonymous_cart.user = request.user
                        anonymous_cart.session_id = None
                        anonymous_cart.save()

                except Cart.DoesNotExist:
                    # No anonymous cart exists, do nothing
                    pass

        return response


class MobileDetectionMiddleware:
    """
    Middleware to detect mobile devices.
    Adds a 'is_mobile' attribute to the request object.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        # Compile the regex pattern for mobile user agents
        self.mobile_pattern = re.compile(r'Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini', re.IGNORECASE)

    def __call__(self, request):
        # Get the user agent
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # Check if the user agent is from a mobile device
        request.is_mobile = bool(self.mobile_pattern.search(user_agent))

        # Call the next middleware or view
        response = self.get_response(request)
        return response
