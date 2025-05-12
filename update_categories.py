"""
Script to update existing categories with new fields.
Run this script with:
python update_categories.py
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'varnikakart.settings')
django.setup()

# Import models after Django setup
from products.models import Category

def update_categories():
    """Update existing categories with new fields"""
    print("Updating existing categories with new fields...")
    
    # Define icon mappings for known categories
    icon_mappings = {
        'Paintings': 'fas fa-palette',
        'Jewelry': 'fas fa-gem',
        'Home Decor': 'fas fa-home',
        'Gifts': 'fas fa-gift',
    }
    
    # Get all categories
    categories = Category.objects.all()
    
    if not categories:
        print("No categories found in the database.")
        return
    
    print(f"Found {categories.count()} categories:")
    
    # Update each category
    for i, category in enumerate(categories):
        print(f"- {category.name}")
        
        # Set icon based on name or default
        icon = icon_mappings.get(category.name, 'fas fa-box')
        
        # Set display order based on index
        display_order = i * 10  # 0, 10, 20, etc.
        
        # Set is_featured for the first 4 categories
        is_featured = i < 4
        
        # Set meta fields
        meta_title = f"{category.name} - Handcrafted Products | VarnikaKart"
        meta_description = category.description[:160] if category.description else f"Explore our collection of handcrafted {category.name.lower()} products at VarnikaKart. Unique designs, quality craftsmanship."
        meta_keywords = f"{category.name.lower()}, handcrafted, handmade, artisan, indian, craft"
        
        # Update the category
        try:
            # Check if the category has these attributes
            has_icon = hasattr(category, 'icon')
            has_is_featured = hasattr(category, 'is_featured')
            has_display_order = hasattr(category, 'display_order')
            has_meta_title = hasattr(category, 'meta_title')
            has_meta_description = hasattr(category, 'meta_description')
            has_meta_keywords = hasattr(category, 'meta_keywords')
            
            if has_icon:
                category.icon = icon
            if has_is_featured:
                category.is_featured = is_featured
            if has_display_order:
                category.display_order = display_order
            if has_meta_title:
                category.meta_title = meta_title
            if has_meta_description:
                category.meta_description = meta_description
            if has_meta_keywords:
                category.meta_keywords = meta_keywords
            
            # Always ensure the category is active
            category.is_active = True
            
            # Save the category
            category.save()
            print(f"  Updated category: {category.name}")
        except Exception as e:
            print(f"  Error updating category: {e}")
    
    print("\nCategories updated successfully!")

if __name__ == '__main__':
    update_categories()
