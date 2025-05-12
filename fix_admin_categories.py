"""
Script to fix the admin categories display issue.
Run this script with:
python fix_admin_categories.py
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

def fix_admin_categories():
    """Fix the admin categories display issue"""
    print("Fixing admin categories display issue...")
    
    # List of hardcoded categories from templates
    hardcoded_categories = [
        {
            'name': 'Paintings',
            'description': 'Explore our collection of handcrafted paintings from talented artists.',
        },
        {
            'name': 'Jewelry',
            'description': 'Discover unique handcrafted jewelry pieces for every occasion.',
        },
        {
            'name': 'Home Decor',
            'description': 'Transform your space with our handcrafted home decor items.',
        },
        {
            'name': 'Gifts',
            'description': 'Find the perfect handcrafted gift for your loved ones.',
        },
    ]
    
    # Ensure each category exists and is active
    for category_data in hardcoded_categories:
        name = category_data['name']
        description = category_data['description']
        
        try:
            # Try to get the category
            category = Category.objects.get(name=name)
            
            # Update the category to ensure it's active
            if not category.is_active:
                category.is_active = True
                category.save()
                print(f"Activated category: {name}")
            else:
                print(f"Category already active: {name}")
                
        except Category.DoesNotExist:
            # Create the category if it doesn't exist
            category = Category.objects.create(
                name=name,
                slug=slugify(name),
                description=description,
                is_active=True
            )
            print(f"Created category: {name}")
    
    # Check if categories are now visible
    all_categories = Category.objects.all()
    print(f"\nAll categories ({all_categories.count()}):")
    for category in all_categories:
        status = "ACTIVE" if category.is_active else "INACTIVE"
        print(f"- {category.name} (Slug: {category.slug}, Status: {status})")
    
    print("\nFix completed. Please restart your Django server to see the changes.")

if __name__ == '__main__':
    fix_admin_categories()
