from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, Product

class Command(BaseCommand):
    help = 'Synchronizes categories between admin and main website'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting category synchronization...'))
        
        # Ensure all categories are active
        categories = Category.objects.all()
        
        if not categories:
            self.stdout.write(self.style.WARNING('No categories found in the database.'))
            return
        
        self.stdout.write(f"Found {categories.count()} categories:")
        
        for category in categories:
            status = "ACTIVE" if category.is_active else "INACTIVE"
            self.stdout.write(f"- {category.name} (Status: {status})")
            
            # Ensure the category is active
            if not category.is_active:
                category.is_active = True
                category.save()
                self.stdout.write(self.style.SUCCESS(f"  Activated category: {category.name}"))
        
        # Ensure all products in active categories are available
        products = Product.objects.filter(category__is_active=True)
        
        if not products:
            self.stdout.write(self.style.WARNING('No products found in active categories.'))
            return
        
        self.stdout.write(f"\nFound {products.count()} products in active categories:")
        
        for product in products:
            status = "AVAILABLE" if product.is_available else "UNAVAILABLE"
            self.stdout.write(f"- {product.name} (Category: {product.category.name}, Status: {status})")
            
            # Ensure the product is available
            if not product.is_available:
                product.is_available = True
                product.save()
                self.stdout.write(self.style.SUCCESS(f"  Made product available: {product.name}"))
        
        self.stdout.write(self.style.SUCCESS('\nCategory synchronization completed successfully!'))
