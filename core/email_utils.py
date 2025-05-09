"""
Email utility functions for VarnikaKart.
"""

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_templated_email(subject, template_name, context, recipient_list, from_email=None):
    """
    Send an email using an HTML template.
    
    Args:
        subject (str): Email subject
        template_name (str): Path to the HTML template
        context (dict): Context data for the template
        recipient_list (list): List of recipient email addresses
        from_email (str, optional): Sender email address. Defaults to DEFAULT_FROM_EMAIL.
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL
    
    # Render HTML content
    html_content = render_to_string(template_name, context)
    
    # Create plain text content
    text_content = strip_tags(html_content)
    
    # Create email message
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=from_email,
        to=recipient_list
    )
    
    # Attach HTML content
    email.attach_alternative(html_content, "text/html")
    
    try:
        # Send email
        email.send()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_order_confirmation_email(order):
    """
    Send order confirmation email to the customer.
    
    Args:
        order: Order object
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = f"Order Confirmation - #{order.order_number}"
    template_name = "emails/order_confirmation.html"
    context = {
        'order': order,
        'order_items': order.items.all(),
    }
    recipient_list = [order.email]
    
    return send_templated_email(subject, template_name, context, recipient_list)

def send_payment_confirmation_email(order, payment):
    """
    Send payment confirmation email to the customer.
    
    Args:
        order: Order object
        payment: Payment object
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = f"Payment Confirmation - #{order.order_number}"
    template_name = "emails/payment_confirmation.html"
    context = {
        'order': order,
        'payment': payment,
    }
    recipient_list = [order.email]
    
    return send_templated_email(subject, template_name, context, recipient_list)

def send_shipping_confirmation_email(order):
    """
    Send shipping confirmation email to the customer.
    
    Args:
        order: Order object
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = f"Your Order #{order.order_number} Has Been Shipped"
    template_name = "emails/shipping_confirmation.html"
    context = {
        'order': order,
    }
    recipient_list = [order.email]
    
    return send_templated_email(subject, template_name, context, recipient_list)

def send_welcome_email(user):
    """
    Send welcome email to new users.
    
    Args:
        user: User object
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = "Welcome to VarnikaKart!"
    template_name = "emails/welcome.html"
    context = {
        'user': user,
    }
    recipient_list = [user.email]
    
    return send_templated_email(subject, template_name, context, recipient_list)

def send_password_reset_email(user, reset_url):
    """
    Send password reset email to the user.
    
    Args:
        user: User object
        reset_url: Password reset URL
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = "Reset Your VarnikaKart Password"
    template_name = "emails/password_reset.html"
    context = {
        'user': user,
        'reset_url': reset_url,
    }
    recipient_list = [user.email]
    
    return send_templated_email(subject, template_name, context, recipient_list)

def send_contact_form_email(name, email, subject, message):
    """
    Send contact form submission to admin.
    
    Args:
        name: Sender's name
        email: Sender's email
        subject: Email subject
        message: Email message
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    admin_subject = f"Contact Form: {subject}"
    template_name = "emails/contact_form.html"
    context = {
        'name': name,
        'email': email,
        'subject': subject,
        'message': message,
    }
    recipient_list = [settings.DEFAULT_FROM_EMAIL]  # Send to admin
    
    # Send confirmation to user
    user_subject = "We've received your message - VarnikaKart"
    user_template = "emails/contact_confirmation.html"
    user_context = {
        'name': name,
    }
    send_templated_email(user_subject, user_template, user_context, [email])
    
    # Send to admin
    return send_templated_email(admin_subject, template_name, context, recipient_list)
