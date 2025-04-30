from django.shortcuts import redirect
from django.urls import reverse
from django.contrib import messages
from django.utils.translation import gettext_lazy as _

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
