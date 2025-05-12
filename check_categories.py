"""
Script to check the status of categories in the database.
Run this script with:
python check_categories.py
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'varnikakart.settings')
django.setup()

# Import models after Django setup
from products.models import Category

def check_categories():
    """Check the status of categories in the database"""
    print("Checking categories in the database...")
    
    # Get all categories
    categories = Category.objects.all()
    
    if not categories:
        print("No categories found in the database.")
        return
    
    print(f"Found {categories.count()} categories:")
    
    for category in categories:
        status = "ACTIVE" if category.is_active else "INACTIVE"
        print(f"- {category.name} (Slug: {category.slug}, Status: {status})")
    
    # Check for specific categories
    hardcoded_categories = ['Paintings', 'Jewelry', 'Home Decor', 'Gifts']
    
    print("\nChecking for hardcoded categories:")
    for name in hardcoded_categories:
        try:
            category = Category.objects.get(name=name)
            status = "ACTIVE" if category.is_active else "INACTIVE"
            print(f"- {name}: Found (Status: {status})")
        except Category.DoesNotExist:
            print(f"- {name}: Not found")

if __name__ == '__main__':
    check_categories()
