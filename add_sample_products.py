"""
Script to add sample products to each category.
Run this script with:
python add_sample_products.py
"""

import os
import django
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'varnikakart.settings')
django.setup()

# Import models after Django setup
from django.utils.text import slugify
from products.models import Category, Product

def add_sample_products():
    """Add sample products to each category"""
    print("Adding sample products to each category...")
    
    # Get all categories
    categories = Category.objects.all()
    
    if not categories:
        print("No categories found in the database.")
        return
    
    # Sample product data for each category
    sample_products = {
        'Paintings': [
            {
                'name': 'Abstract Landscape',
                'description': 'Beautiful abstract landscape painting with vibrant colors.',
                'price': 2999.99,
                'discount_price': 2499.99,
                'stock': 5,
            },
            {
                'name': 'Traditional Indian Art',
                'description': 'Handcrafted traditional Indian painting with intricate details.',
                'price': 3999.99,
                'discount_price': 3499.99,
                'stock': 3,
            }
        ],
        'Jewelry': [
            {
                'name': 'Silver Earrings',
                'description': 'Handcrafted silver earrings with traditional Indian design.',
                'price': 999.99,
                'discount_price': 799.99,
                'stock': 10,
            },
            {
                'name': 'Gold Necklace',
                'description': 'Elegant gold necklace with gemstone pendant.',
                'price': 5999.99,
                'discount_price': 4999.99,
                'stock': 2,
            }
        ],
        'Home Decor': [
            {
                'name': 'Handwoven Wall Hanging',
                'description': 'Beautiful handwoven wall hanging with traditional patterns.',
                'price': 1499.99,
                'discount_price': 1299.99,
                'stock': 8,
            },
            {
                'name': 'Ceramic Vase Set',
                'description': 'Set of 3 handcrafted ceramic vases in different sizes.',
                'price': 1999.99,
                'discount_price': 1699.99,
                'stock': 4,
            }
        ],
        'Gifts': [
            {
                'name': 'Personalized Photo Frame',
                'description': 'Handcrafted wooden photo frame with personalized engraving.',
                'price': 799.99,
                'discount_price': 699.99,
                'stock': 15,
            },
            {
                'name': 'Gift Hamper',
                'description': 'Curated gift hamper with assorted handcrafted items.',
                'price': 2499.99,
                'discount_price': 1999.99,
                'stock': 7,
            }
        ]
    }
    
    # Add products to each category
    for category in categories:
        print(f"\nProcessing category: {category.name}")
        
        # Skip if no sample products for this category
        if category.name not in sample_products:
            print(f"No sample products defined for {category.name}, skipping.")
            continue
        
        # Add sample products
        for product_data in sample_products[category.name]:
            name = product_data['name']
            
            # Check if product already exists
            if Product.objects.filter(name=name, category=category).exists():
                print(f"Product '{name}' already exists in category '{category.name}', skipping.")
                continue
            
            # Create the product
            product = Product.objects.create(
                category=category,
                name=name,
                slug=slugify(name),
                description=product_data['description'],
                price=product_data['price'],
                discount_price=product_data['discount_price'],
                stock=product_data['stock'],
                is_available=True,
                is_featured=random.choice([True, False])
            )
            
            print(f"Added product: {name} to category: {category.name}")
    
    print("\nSample products added successfully!")

if __name__ == '__main__':
    add_sample_products()
