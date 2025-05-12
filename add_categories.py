"""
Script to manually add hardcoded categories to the database.
Run this script with:
python add_categories.py
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'varnikakart.settings')
django.setup()

# Import models after Django setup
from django.utils.text import slugify
from products.models import Category

def add_categories():
    """Add hardcoded categories to the database"""
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

    # Ensure each category exists
    for category_data in hardcoded_categories:
        name = category_data['name']
        description = category_data['description']

        # Check if category exists
        category, created = Category.objects.get_or_create(
            name=name,
            defaults={
                'slug': slugify(name),
                'description': description,
                'is_active': True
            }
        )

        if created:
            print(f'Created category: {name}')
        else:
            print(f'Category already exists: {name}')
            # Update the existing category to ensure it's active
            if not category.is_active:
                category.is_active = True
                category.save()
                print(f'Activated category: {name}')

if __name__ == '__main__':
    print('Starting category creation...')
    add_categories()
    print('Category creation completed successfully!')
