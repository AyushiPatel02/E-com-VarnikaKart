from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.conf import settings
import json
import uuid
from decimal import Decimal

from products.models import Product
from users.models import Address
from .models import Cart, CartItem, Order, OrderItem, Payment
from .forms import OrderForm

def _get_cart(request):
    """Helper function to get or create a cart for the user or session"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        session_id = request.session.get('session_key')
        if not session_id:
            session_id = str(uuid.uuid4())
            request.session['session_key'] = session_id

        cart, created = Cart.objects.get_or_create(session_id=session_id)

    return cart

def cart_detail(request):
    """View for displaying the cart contents"""
    cart = _get_cart(request)

    context = {
        'cart': cart,
        'cart_items': cart.items.all(),
    }
    return render(request, 'orders/cart.html', context)

@require_POST
def cart_add(request):
    """View for adding items to the cart via AJAX"""
    data = json.loads(request.body)
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))

    try:
        product = Product.objects.get(id=product_id, is_available=True)
        cart = _get_cart(request)

        # Check if the product is already in the cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        # If the product is already in the cart, update the quantity
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return JsonResponse({
            'success': True,
            'cart_count': cart.get_total_items(),
            'message': f'{product.name} added to your cart.'
        })
    except Product.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Product not found.'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)

@require_POST
def cart_update(request):
    """View for updating cart item quantities via AJAX"""
    data = json.loads(request.body)
    cart_item_id = data.get('cart_item_id')
    quantity = int(data.get('quantity', 1))

    try:
        cart = _get_cart(request)
        cart_item = CartItem.objects.get(id=cart_item_id, cart=cart)

        if quantity > 0:
            cart_item.quantity = quantity
            cart_item.save()
        else:
            cart_item.delete()

        return JsonResponse({
            'success': True,
            'cart_count': cart.get_total_items(),
            'cart_total': float(cart.get_total_price()),
            'item_total': float(cart_item.get_cost()) if quantity > 0 else 0,
            'message': 'Cart updated successfully.'
        })
    except CartItem.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Cart item not found.'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)

def cart_remove(request, product_id):
    """View for removing items from the cart"""
    cart = _get_cart(request)
    product = get_object_or_404(Product, id=product_id)

    try:
        cart_item = CartItem.objects.get(cart=cart, product=product)
        cart_item.delete()
        messages.success(request, f'{product.name} removed from your cart.')
    except CartItem.DoesNotExist:
        pass

    return redirect('orders:cart')

@login_required
def checkout(request):
    """View for the checkout process"""
    cart = _get_cart(request)

    # Check if cart is empty
    if cart.items.count() == 0:
        messages.warning(request, 'Your cart is empty.')
        return redirect('orders:cart')

    # Get user's addresses
    addresses = Address.objects.filter(user=request.user)
    default_address = addresses.filter(is_default=True).first()

    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.order_total = cart.get_total_price()
            order.tax = order.order_total * Decimal('0.18')  # 18% tax
            order.ip_address = request.META.get('REMOTE_ADDR')
            order.save()

            # Create order items
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    price=cart_item.product.discount_price or cart_item.product.price,
                    quantity=cart_item.quantity
                )

            # Clear the cart
            cart.items.all().delete()

            # Redirect to payment page
            return redirect('orders:payment_process')
    else:
        initial_data = {}
        if default_address:
            initial_data = {
                'full_name': default_address.full_name,
                'phone_number': default_address.phone_number,
                'address_line_1': default_address.street_address,
                'address_line_2': default_address.apartment_address,
                'city': default_address.city,
                'state': default_address.state,
                'postal_code': default_address.postal_code,
            }
        form = OrderForm(initial=initial_data)

    context = {
        'form': form,
        'cart': cart,
        'cart_items': cart.items.all(),
        'addresses': addresses,
    }
    return render(request, 'orders/checkout.html', context)

@login_required
def place_order(request):
    """View for placing an order"""
    # This is a placeholder for the actual order placement logic
    # In a real application, this would handle the order creation and payment processing
    return redirect('orders:order_success', order_id=1)

@login_required
def order_success(request, order_id):
    """View for displaying order success page"""
    order = get_object_or_404(Order, id=order_id, user=request.user)

    context = {
        'order': order,
    }
    return render(request, 'orders/order_success.html', context)

@login_required
def order_history(request):
    """View for displaying user's order history"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')

    context = {
        'orders': orders,
    }
    return render(request, 'orders/order_history.html', context)

@login_required
def order_detail(request, order_id):
    """View for displaying order details"""
    order = get_object_or_404(Order, id=order_id, user=request.user)

    context = {
        'order': order,
        'order_items': order.items.all(),
    }
    return render(request, 'orders/order_detail.html', context)

@login_required
def payment_process(request):
    """View for processing payment"""
    # This is a placeholder for the actual payment processing logic
    # In a real application, this would integrate with a payment gateway like Razorpay or Stripe
    return render(request, 'orders/payment_process.html')

@login_required
def payment_success(request):
    """View for handling successful payment"""
    # This is a placeholder for the actual payment success logic
    return render(request, 'orders/payment_success.html')

@login_required
def payment_cancel(request):
    """View for handling cancelled payment"""
    # This is a placeholder for the actual payment cancellation logic
    return render(request, 'orders/payment_cancel.html')
