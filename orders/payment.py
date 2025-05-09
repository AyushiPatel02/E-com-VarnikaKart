"""
Payment integration module for VarnikaKart.
Handles payment processing using Razorpay.
"""

import razorpay
import json
import hmac
import hashlib
from django.conf import settings
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Order, Payment

class PaymentGateway:
    """Base class for payment gateway integration."""
    
    def __init__(self):
        """Initialize payment gateway."""
        pass
    
    def create_payment(self, order):
        """Create a payment for the order."""
        raise NotImplementedError("Subclasses must implement create_payment")
    
    def verify_payment(self, payment_id, order_id, signature):
        """Verify payment signature."""
        raise NotImplementedError("Subclasses must implement verify_payment")
    
    def process_payment(self, payment_data):
        """Process payment and update order status."""
        raise NotImplementedError("Subclasses must implement process_payment")

class RazorpayGateway(PaymentGateway):
    """Razorpay payment gateway integration."""
    
    def __init__(self):
        """Initialize Razorpay client."""
        super().__init__()
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    
    def create_payment(self, order):
        """Create a Razorpay order for the given order."""
        try:
            # Convert to paisa (Razorpay uses smallest currency unit)
            amount = int(float(order.order_total) * 100)
            
            # Create Razorpay order
            razorpay_order = self.client.order.create({
                'amount': amount,
                'currency': 'INR',
                'receipt': order.order_number,
                'payment_capture': 1,  # Auto-capture payment
                'notes': {
                    'order_id': order.id,
                    'customer_name': order.full_name,
                    'customer_email': order.email,
                }
            })
            
            return {
                'success': True,
                'order_id': razorpay_order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID,
                'name': 'VarnikaKart',
                'description': f'Order #{order.order_number}',
                'image': 'https://varnikakart.com/static/img/logo.png',
                'prefill': {
                    'name': order.full_name,
                    'email': order.email,
                    'contact': order.phone_number,
                },
                'theme': {
                    'color': '#ff6b6b',
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_payment(self, payment_id, order_id, signature):
        """Verify Razorpay payment signature."""
        try:
            # Create signature verification data
            params_dict = {
                'razorpay_payment_id': payment_id,
                'razorpay_order_id': order_id,
                'razorpay_signature': signature
            }
            
            # Verify signature
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception as e:
            print(f"Payment verification failed: {str(e)}")
            return False
    
    def process_payment(self, payment_data):
        """Process Razorpay payment and update order status."""
        try:
            # Extract payment data
            payment_id = payment_data.get('razorpay_payment_id')
            order_id = payment_data.get('razorpay_order_id')
            signature = payment_data.get('razorpay_signature')
            
            # Verify payment signature
            if not self.verify_payment(payment_id, order_id, signature):
                return {
                    'success': False,
                    'message': 'Payment verification failed'
                }
            
            # Get payment details from Razorpay
            payment_details = self.client.payment.fetch(payment_id)
            
            # Get order from receipt
            receipt = payment_details.get('notes', {}).get('receipt')
            if not receipt:
                return {
                    'success': False,
                    'message': 'Order not found'
                }
            
            # Get order from database
            try:
                order = Order.objects.get(order_number=receipt)
            except Order.DoesNotExist:
                return {
                    'success': False,
                    'message': 'Order not found in database'
                }
            
            # Check if payment is already processed
            if Payment.objects.filter(order=order).exists():
                return {
                    'success': True,
                    'message': 'Payment already processed',
                    'order_id': order.id
                }
            
            # Create payment record
            payment = Payment.objects.create(
                order=order,
                payment_id=payment_id,
                payment_method='Razorpay',
                amount_paid=order.order_total,
                status=payment_details.get('status', 'captured')
            )
            
            # Update order status
            order.is_ordered = True
            order.status = 'C'  # Confirmed
            order.payment_status = 'C'  # Completed
            order.payment_method = 'CC'  # Credit Card (or whatever was used)
            order.save()
            
            return {
                'success': True,
                'message': 'Payment processed successfully',
                'order_id': order.id,
                'payment_id': payment.id
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error processing payment: {str(e)}'
            }

# Create payment gateway instance
payment_gateway = RazorpayGateway()

# Payment views
@login_required
def payment_process(request, order_id):
    """View for processing payment."""
    order = Order.objects.get(id=order_id, user=request.user)
    
    # Create payment
    payment_data = payment_gateway.create_payment(order)
    
    if not payment_data['success']:
        messages.error(request, f"Payment initialization failed: {payment_data.get('error', 'Unknown error')}")
        return redirect('orders:checkout')
    
    context = {
        'order': order,
        'payment_data': payment_data
    }
    return render(request, 'orders/payment_process.html', context)

@csrf_exempt
def payment_callback(request):
    """Callback view for payment gateway."""
    if request.method == 'POST':
        payment_data = request.POST.dict()
        
        # Process payment
        result = payment_gateway.process_payment(payment_data)
        
        if result['success']:
            # Redirect to success page
            return redirect('orders:payment_success', order_id=result['order_id'])
        else:
            # Redirect to failure page with error message
            return redirect('orders:payment_cancel')
    
    return HttpResponse("Invalid request", status=400)

@login_required
def payment_success(request, order_id):
    """View for successful payment."""
    order = Order.objects.get(id=order_id, user=request.user)
    
    context = {
        'order': order
    }
    return render(request, 'orders/payment_success.html', context)
