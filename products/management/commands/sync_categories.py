from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Synchronizes hardcoded categories with the database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting category synchronization...'))
        
        # Call the ensure_categories command
        call_command('ensure_categories')
        
        self.stdout.write(self.style.SUCCESS('Category synchronization completed successfully!'))
