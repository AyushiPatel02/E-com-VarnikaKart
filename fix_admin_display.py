"""
Script to fix the admin display issues.
Run this script with:
python fix_admin_display.py
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'varnikakart.settings')
django.setup()

# Import models after Django setup
from django.utils.text import slugify
from products.models import Category, Product
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
import datetime
from django.utils import timezone

def fix_admin_display():
    """Fix the admin display issues"""
    print("Fixing admin display issues...")
    
    # Get all categories
    categories = Category.objects.all()
    
    if not categories:
        print("No categories found in the database.")
        return
    
    print(f"Found {categories.count()} categories:")
    
    # Try to get a superuser
    try:
        superuser = User.objects.filter(is_superuser=True).first()
        print(f"Using superuser: {superuser.username}")
    except:
        superuser = None
        print("No superuser found.")
    
    # Get the content type for Category
    try:
        category_content_type = ContentType.objects.get(app_label='products', model='category')
    except:
        category_content_type = None
        print("Category content type not found.")
    
    # Get the content type for Product
    try:
        product_content_type = ContentType.objects.get(app_label='products', model='product')
    except:
        product_content_type = None
        print("Product content type not found.")
    
    # Process categories
    for category in categories:
        status = "ACTIVE" if category.is_active else "INACTIVE"
        print(f"- {category.name} (Slug: {category.slug}, Status: {status})")
        
        # Ensure the category is active
        if not category.is_active:
            category.is_active = True
            category.save()
            print(f"  Activated category: {category.name}")
        
        # Add a log entry for this category
        if superuser and category_content_type:
            try:
                # Add a change log entry for this category
                LogEntry.objects.create(
                    user_id=superuser.id,
                    content_type_id=category_content_type.id,
                    object_id=str(category.id),
                    object_repr=category.name,
                    action_flag=CHANGE,
                    change_message='[{"changed": {"fields": ["is_active"]}}]',
                    action_time=timezone.now()
                )
                print(f"  Added change log entry for: {category.name}")
            except Exception as e:
                print(f"  Error adding log entry: {e}")
        
        # Process products in this category
        products = Product.objects.filter(category=category)
        print(f"  Found {products.count()} products in category: {category.name}")
        
        for product in products:
            status = "AVAILABLE" if product.is_available else "UNAVAILABLE"
            print(f"  - {product.name} (Status: {status})")
            
            # Ensure the product is available
            if not product.is_available:
                product.is_available = True
                product.save()
                print(f"    Made product available: {product.name}")
            
            # Add a log entry for this product
            if superuser and product_content_type:
                try:
                    # Add a change log entry for this product
                    LogEntry.objects.create(
                        user_id=superuser.id,
                        content_type_id=product_content_type.id,
                        object_id=str(product.id),
                        object_repr=product.name,
                        action_flag=CHANGE,
                        change_message='[{"changed": {"fields": ["is_available"]}}]',
                        action_time=timezone.now()
                    )
                    print(f"    Added change log entry for: {product.name}")
                except Exception as e:
                    print(f"    Error adding log entry: {e}")
    
    print("\nFix completed. Please restart your Django server to see the changes.")

if __name__ == '__main__':
    fix_admin_display()
