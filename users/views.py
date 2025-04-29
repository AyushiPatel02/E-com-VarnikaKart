from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

from products.models import Product
from .models import Profile, Address, Wishlist
from .forms import ProfileForm, AddressForm

@login_required
def profile(request):
    """View for displaying user profile"""
    user_profile = request.user.profile
    addresses = request.user.addresses.all()
    orders = request.user.orders.all().order_by('-created_at')[:5]  # Get last 5 orders

    context = {
        'profile': user_profile,
        'addresses': addresses,
        'orders': orders,
    }
    return render(request, 'users/profile.html', context)

@login_required
def edit_profile(request):
    """View for editing user profile"""
    user_profile = request.user.profile

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=user_profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('users:profile')
    else:
        form = ProfileForm(instance=user_profile)

    context = {
        'form': form,
    }
    return render(request, 'users/edit_profile.html', context)

@login_required
def wishlist(request):
    """View for displaying user's wishlist"""
    user_wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    wishlist_products = user_wishlist.products.all()

    context = {
        'wishlist': user_wishlist,
        'wishlist_products': wishlist_products,
    }
    return render(request, 'users/wishlist.html', context)

@login_required
@require_POST
def add_to_wishlist(request):
    """View for adding products to wishlist via AJAX"""
    data = json.loads(request.body)
    product_id = data.get('product_id')

    try:
        product = Product.objects.get(id=product_id)
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)

        if product in wishlist.products.all():
            # Product already in wishlist, remove it
            wishlist.products.remove(product)
            in_wishlist = False
            message = f'{product.name} removed from your wishlist.'
        else:
            # Add product to wishlist
            wishlist.products.add(product)
            in_wishlist = True
            message = f'{product.name} added to your wishlist.'

        return JsonResponse({
            'success': True,
            'in_wishlist': in_wishlist,
            'message': message
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

@login_required
def remove_from_wishlist(request, product_id):
    """View for removing products from wishlist"""
    product = get_object_or_404(Product, id=product_id)
    wishlist = get_object_or_404(Wishlist, user=request.user)

    if product in wishlist.products.all():
        wishlist.products.remove(product)
        messages.success(request, f'{product.name} removed from your wishlist.')

    return redirect('users:wishlist')

@login_required
def address_list(request):
    """View for displaying user's addresses"""
    addresses = request.user.addresses.all()

    context = {
        'addresses': addresses,
    }
    return render(request, 'users/address_list.html', context)

@login_required
def add_address(request):
    """View for adding a new address"""
    if request.method == 'POST':
        form = AddressForm(request.POST)
        if form.is_valid():
            address = form.save(commit=False)
            address.user = request.user

            # If this is the first address or set as default
            if not request.user.addresses.exists() or form.cleaned_data.get('is_default'):
                # Set all other addresses as non-default
                request.user.addresses.update(is_default=False)
                address.is_default = True

            address.save()
            messages.success(request, 'Address added successfully!')
            return redirect('users:address_list')
    else:
        form = AddressForm()

    context = {
        'form': form,
    }
    return render(request, 'users/add_address.html', context)

@login_required
def edit_address(request, address_id):
    """View for editing an address"""
    address = get_object_or_404(Address, id=address_id, user=request.user)

    if request.method == 'POST':
        form = AddressForm(request.POST, instance=address)
        if form.is_valid():
            address = form.save(commit=False)

            # If set as default
            if form.cleaned_data.get('is_default'):
                # Set all other addresses as non-default
                request.user.addresses.update(is_default=False)
                address.is_default = True

            address.save()
            messages.success(request, 'Address updated successfully!')
            return redirect('users:address_list')
    else:
        form = AddressForm(instance=address)

    context = {
        'form': form,
        'address': address,
    }
    return render(request, 'users/edit_address.html', context)

@login_required
def delete_address(request, address_id):
    """View for deleting an address"""
    address = get_object_or_404(Address, id=address_id, user=request.user)

    if request.method == 'POST':
        was_default = address.is_default
        address.delete()

        # If the deleted address was the default, set another address as default
        if was_default and request.user.addresses.exists():
            new_default = request.user.addresses.first()
            new_default.is_default = True
            new_default.save()

        messages.success(request, 'Address deleted successfully!')
        return redirect('users:address_list')

    context = {
        'address': address,
    }
    return render(request, 'users/delete_address.html', context)

@login_required
def set_default_address(request, address_id):
    """View for setting an address as default"""
    address = get_object_or_404(Address, id=address_id, user=request.user)

    # Set all addresses as non-default
    request.user.addresses.update(is_default=False)

    # Set the selected address as default
    address.is_default = True
    address.save()

    messages.success(request, f'{address.get_address_type_display()} address set as default.')
    return redirect('users:address_list')
