"""
Script to fix the categories list display in the admin interface.
Run this script with:
python fix_categories_list.py
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'varnikakart.settings')
django.setup()

# Import models after Django setup
from django.utils.text import slugify
from products.models import Category
from django.core.management import call_command
from django.contrib.admin.models import LogEntry, ADDITION
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
import datetime

def fix_categories_list():
    """Fix the categories list display in the admin interface"""
    print("Fixing categories list display in the admin interface...")
    
    # Get all categories
    categories = Category.objects.all()
    
    if not categories:
        print("No categories found in the database.")
        return
    
    print(f"Found {categories.count()} categories:")
    
    # Try to get a superuser
    try:
        superuser = User.objects.filter(is_superuser=True).first()
    except:
        superuser = None
    
    # Get the content type for Category
    try:
        category_content_type = ContentType.objects.get(app_label='products', model='category')
    except:
        category_content_type = None
    
    for category in categories:
        status = "ACTIVE" if category.is_active else "INACTIVE"
        print(f"- {category.name} (Slug: {category.slug}, Status: {status})")
        
        # Ensure the category is active
        if not category.is_active:
            category.is_active = True
            category.save()
            print(f"  Activated category: {category.name}")
        
        # Add a log entry for this category to make it appear in admin
        if superuser and category_content_type:
            try:
                # Check if there's already a log entry for this category
                log_exists = LogEntry.objects.filter(
                    content_type=category_content_type,
                    object_id=str(category.id)
                ).exists()
                
                if not log_exists:
                    LogEntry.objects.create(
                        user_id=superuser.id,
                        content_type_id=category_content_type.id,
                        object_id=str(category.id),
                        object_repr=category.name,
                        action_flag=ADDITION,
                        change_message='[{"added": {}}]',
                        action_time=datetime.datetime.now()
                    )
                    print(f"  Added log entry for: {category.name}")
            except Exception as e:
                print(f"  Error adding log entry: {e}")
    
    print("\nFix completed. Please restart your Django server to see the changes.")

if __name__ == '__main__':
    fix_categories_list()
