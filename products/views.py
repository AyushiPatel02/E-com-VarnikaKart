from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q, Avg
from .models import Product, Category, Review
from .forms import ReviewForm

def product_list(request, category_slug=None):
    """View for listing products, with various filtering options"""
    category = None
    categories = Category.objects.filter(is_active=True)
    products = Product.objects.filter(is_available=True)

    # Set default page title and description
    page_title = "All Products"
    page_description = "Explore our complete collection of handcrafted items from talented artisans around the world."

    # Category filtering
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)
        page_title = category.name
        page_description = category.description if category.description else f"Explore our collection of handcrafted {category.name}."

    # Filter by specific category name
    category_filter = request.GET.get('category')
    if category_filter:
        try:
            category_obj = Category.objects.get(name__iexact=category_filter)
            products = products.filter(category=category_obj)
            page_title = category_obj.name
            page_description = category_obj.description if category_obj.description else f"Explore our collection of handcrafted {category_obj.name}."
        except Category.DoesNotExist:
            pass

    # Collection filtering
    collection = request.GET.get('collection')
    if collection:
        if collection == 'new_arrivals':
            products = products.order_by('-created_at')
            page_title = "New Arrivals"
            page_description = "Discover our latest additions to the VarnikaKart collection. Stay ahead of trends with fresh, innovative designs from our talented artisans."
        elif collection == 'best_sellers':
            # For demo, we'll use featured products as best sellers
            products = products.filter(is_featured=True)
            page_title = "Best Sellers"
            page_description = "Explore our most popular handcrafted items loved by customers worldwide. These best-selling products have earned their reputation through exceptional quality and design."
        elif collection == 'on_sale':
            products = products.filter(discount_price__isnull=False)
            page_title = "On Sale"
            page_description = "Take advantage of special discounts on selected handcrafted items. Our sale collection features high-quality artisanal products at reduced prices for a limited time."
        elif collection == 'featured':
            products = products.filter(is_featured=True)
            page_title = "Featured Products"
            page_description = "Discover our handpicked selection of exceptional handcrafted items. These featured products represent the finest examples of artisanal craftsmanship and innovative design."

    # Search functionality
    search_query = request.GET.get('q')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )
        page_title = f"Search Results for '{search_query}'"
        page_description = f"Showing results for '{search_query}' in our handcrafted collection."

    # Filtering by price
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    # Sorting
    sort_by = request.GET.get('sort')
    if sort_by == 'price_low':
        products = products.order_by('price')
    elif sort_by == 'price_high':
        products = products.order_by('-price')
    elif sort_by == 'newest':
        products = products.order_by('-created_at')
    elif sort_by == 'rating':
        products = products.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
    else:
        # If collection is new_arrivals, we've already sorted by created_at
        if not collection == 'new_arrivals':
            products = products.order_by('-created_at')  # Default sorting

    # Pagination
    paginator = Paginator(products, 12)  # Show 12 products per page
    page = request.GET.get('page')
    products = paginator.get_page(page)

    context = {
        'category': category,
        'categories': categories,
        'products': products,
        'search_query': search_query,
        'min_price': min_price,
        'max_price': max_price,
        'sort_by': sort_by,
        'collection': collection,
        'page_title': page_title,
        'page_description': page_description,
    }
    return render(request, 'products/product_list.html', context)

def product_detail(request, slug):
    """View for displaying product details"""
    product = get_object_or_404(Product, slug=slug, is_available=True)
    related_products = Product.objects.filter(category=product.category, is_available=True).exclude(id=product.id)[:4]
    reviews = product.reviews.all().order_by('-created_at')

    # Calculate average rating
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0

    # Review form
    if request.user.is_authenticated:
        user_review = reviews.filter(user=request.user).first()
    else:
        user_review = None

    context = {
        'product': product,
        'related_products': related_products,
        'reviews': reviews,
        'avg_rating': avg_rating,
        'user_review': user_review,
    }
    return render(request, 'products/product_detail.html', context)

@login_required
def add_review(request, product_id):
    """View for adding or updating a product review"""
    product = get_object_or_404(Product, id=product_id, is_available=True)
    user_review = Review.objects.filter(product=product, user=request.user).first()

    if request.method == 'POST':
        form = ReviewForm(request.POST, instance=user_review)
        if form.is_valid():
            review = form.save(commit=False)
            review.product = product
            review.user = request.user
            review.save()
            messages.success(request, 'Your review has been submitted successfully!')
            return redirect('products:product_detail', slug=product.slug)
    else:
        form = ReviewForm(instance=user_review)

    context = {
        'form': form,
        'product': product,
    }
    return render(request, 'products/add_review.html', context)

# Helper function for filtering and sorting
def apply_filters_and_sorting(request, products):
    """Apply filters and sorting to product queryset"""
    # Search functionality
    search_query = request.GET.get('q')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )

    # Filtering by price
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    # Sorting
    sort_by = request.GET.get('sort')
    if sort_by == 'price_low':
        products = products.order_by('price')
    elif sort_by == 'price_high':
        products = products.order_by('-price')
    elif sort_by == 'newest':
        products = products.order_by('-created_at')
    elif sort_by == 'rating':
        products = products.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')

    # Pagination
    paginator = Paginator(products, 12)  # Show 12 products per page
    page = request.GET.get('page')
    products = paginator.get_page(page)

    context_data = {
        'search_query': search_query,
        'min_price': min_price,
        'max_price': max_price,
        'sort_by': sort_by,
    }

    return products, context_data

def trending(request):
    """View for displaying trending products"""
    # For demo purposes, we'll use a mix of featured and new products as trending
    # In a real app, you would track views, purchases, etc. to determine trending products
    featured_products = Product.objects.filter(is_available=True, is_featured=True)[:8]
    new_products = Product.objects.filter(is_available=True).order_by('-created_at')[:8]

    # Combine and shuffle the products to create a trending list
    from itertools import chain
    import random
    combined_products = list(chain(featured_products, new_products))
    random.shuffle(combined_products)

    # Remove duplicates while preserving order
    seen = set()
    trending_products = []
    for product in combined_products:
        if product.id not in seen:
            seen.add(product.id)
            trending_products.append(product)

    # Get categories for filtering
    categories = Category.objects.filter(is_active=True)

    # Get trending searches (placeholder data)
    trending_searches = [
        "Handmade Jewelry", "Wall Art", "Personalized Gifts",
        "Home Decor", "Pottery", "Handwoven Textiles"
    ]

    # Get trending categories based on product count (placeholder logic)
    trending_categories = categories.order_by('?')[:5]  # Random for demo

    context = {
        'trending_products': trending_products[:12],  # Limit to 12 products
        'categories': categories,
        'trending_searches': trending_searches,
        'trending_categories': trending_categories,
    }
    return render(request, 'products/trending.html', context)

# Artist Views
def featured_artists(request):
    """View for displaying featured artists"""
    # This is a placeholder - you would need to create an Artist model
    # For now, we'll just render a template with static content
    return render(request, 'products/artists_featured.html')

def artist_stores(request):
    """View for displaying artist stores"""
    # This is a placeholder - you would need to create an Artist model
    # For now, we'll just render a template with static content
    return render(request, 'products/artists_stores.html')

def become_artist(request):
    """View for displaying information about becoming an artist"""
    # This is a placeholder - you would need to create a form for artist applications
    # For now, we'll just render a template with static content
    return render(request, 'products/artists_become.html')

# Helper function for filtering and sorting
def apply_filters_and_sorting(request, products):
    """Apply filters and sorting to product queryset"""
    # Search functionality
    search_query = request.GET.get('q')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )

    # Filtering by price
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    # Sorting
    sort_by = request.GET.get('sort')
    if sort_by == 'price_low':
        products = products.order_by('price')
    elif sort_by == 'price_high':
        products = products.order_by('-price')
    elif sort_by == 'newest':
        products = products.order_by('-created_at')
    elif sort_by == 'rating':
        products = products.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')

    # Pagination
    paginator = Paginator(products, 12)  # Show 12 products per page
    page = request.GET.get('page')
    products = paginator.get_page(page)

    context_data = {
        'search_query': search_query,
        'min_price': min_price,
        'max_price': max_price,
        'sort_by': sort_by,
    }

    return products, context_data
