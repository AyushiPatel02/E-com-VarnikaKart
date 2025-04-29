from django.shortcuts import render, redirect
from django.contrib import messages
from products.models import Product, Category
from .models import Contact, Newsletter
from .forms import ContactForm, NewsletterForm

def home(request):
    """View for the home page"""
    # Get featured products
    featured_products = Product.objects.filter(is_featured=True, is_available=True)[:8]

    # Get new arrivals
    new_arrivals = Product.objects.filter(is_available=True).order_by('-created_at')[:4]

    # Get best sellers (for demo, we'll use featured products)
    best_sellers = Product.objects.filter(is_available=True)[:4]

    # Get categories
    categories = Category.objects.filter(is_active=True)[:6]

    # Get primary images and discount percentages for all products
    def get_product_data(products):
        data = []
        for product in products:
            primary_image = product.images.filter(is_primary=True).first()
            image_url = primary_image.image.url if primary_image else None

            discount_percentage = 0
            if product.discount_price:
                discount = ((product.price - product.discount_price) / product.price) * 100
                discount_percentage = round(discount)

            # Get random rating for demo purposes (in a real app, this would come from reviews)
            import random
            rating = round(random.uniform(3.5, 5.0), 1)

            data.append({
                'product': product,
                'primary_image': image_url,
                'discount_percentage': discount_percentage,
                'rating': rating
            })
        return data

    # Process all product data
    featured_products_data = get_product_data(featured_products)
    new_arrivals_data = get_product_data(new_arrivals)
    best_sellers_data = get_product_data(best_sellers)

    # Newsletter form
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Thank you for subscribing to our newsletter!')
            return redirect('home')
    else:
        form = NewsletterForm()

    # Get testimonials (in a real app, these would come from a database)
    testimonials = [
        {
            'name': 'Sarah Mitchell',
            'location': 'New York, USA',
            'text': 'The handmade earrings I ordered are absolutely stunning! The craftsmanship is exceptional, and they arrived beautifully packaged. Will definitely be ordering more!',
            'rating': 5,
            'initials': 'SM',
            'color': 'primary'
        },
        {
            'name': 'James Peterson',
            'location': 'London, UK',
            'text': 'I ordered a custom painting for my wife\'s birthday, and it exceeded all expectations. The artist captured exactly what I wanted, and the delivery was prompt. My wife loves it!',
            'rating': 5,
            'initials': 'JP',
            'color': 'success'
        },
        {
            'name': 'Anita Patel',
            'location': 'Toronto, Canada',
            'text': 'The personalized bracelet I ordered for my daughter was perfect! The quality is excellent, and the engraving was done beautifully. Customer service was also very helpful.',
            'rating': 4.5,
            'initials': 'AP',
            'color': 'danger'
        }
    ]

    context = {
        'featured_products': featured_products,
        'featured_products_data': featured_products_data,
        'new_arrivals_data': new_arrivals_data,
        'best_sellers_data': best_sellers_data,
        'categories': categories,
        'newsletter_form': form,
        'testimonials': testimonials
    }
    return render(request, 'core/home.html', context)

def contact(request):
    """View for the contact page"""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact = form.save(commit=False)
            if request.user.is_authenticated:
                contact.user = request.user
            contact.save()
            messages.success(request, 'Your message has been sent. We will get back to you soon!')
            return redirect('contact')
    else:
        form = ContactForm()

    context = {
        'form': form,
    }
    return render(request, 'core/contact.html', context)

def about(request):
    """View for the about page"""
    return render(request, 'core/about.html')
