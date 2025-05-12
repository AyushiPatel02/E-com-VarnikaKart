from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category

class Command(BaseCommand):
    help = 'Ensures that all hardcoded categories exist in the database'

    def handle(self, *args, **options):
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
                self.stdout.write(self.style.SUCCESS(f'Created category: {name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Category already exists: {name}'))
