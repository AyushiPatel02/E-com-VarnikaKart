from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages
from django.urls import reverse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponseRedirect
from django.utils.translation import gettext_lazy as _

from .forms import SuperAdminLoginForm

def is_superuser(user):
    """Check if user is a superuser"""
    return user.is_superuser

@csrf_protect
@never_cache
def superadmin_login(request):
    """
    Display the super admin login form and handle the login action.
    """
    if request.user.is_authenticated and request.user.is_superuser:
        return HttpResponseRedirect(reverse('admin:index'))
    
    # Default next page is the admin index
    next_page = request.GET.get('next', reverse('admin:index'))
    
    if request.method == "POST":
        form = SuperAdminLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            remember_me = form.cleaned_data.get('remember_me')
            
            user = authenticate(username=username, password=password)
            
            if user is not None and user.is_superuser:
                login(request, user)
                
                # Set session expiry based on remember_me
                if not remember_me:
                    # Session expires when browser closes
                    request.session.set_expiry(0)
                
                messages.success(request, _(f"Welcome back, {user.username}! You are now logged in as a Super Admin."))
                return HttpResponseRedirect(next_page)
            elif user is not None and not user.is_superuser:
                messages.error(request, _("You don't have super admin privileges. Please contact the system administrator."))
            else:
                messages.error(request, _("Invalid username or password."))
        else:
            messages.error(request, _("Invalid username or password."))
    else:
        form = SuperAdminLoginForm(request)
    
    context = {
        'form': form,
        'next': next_page,
        'site_title': 'VarnikaKart Super Admin',
        'site_header': 'VarnikaKart Super Admin Portal',
    }
    
    return render(request, 'admin/superadmin_login.html', context)

@user_passes_test(is_superuser)
def superadmin_dashboard(request):
    """
    Display the super admin dashboard.
    Redirects to the admin index page.
    """
    return HttpResponseRedirect(reverse('admin:index'))

def superadmin_logout(request):
    """
    Log out the super admin user.
    """
    logout(request)
    messages.success(request, _("You have been successfully logged out."))
    return HttpResponseRedirect(reverse('superadmin_login'))
