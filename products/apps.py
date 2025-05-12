from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'products'

    def ready(self):
        """
        Run code when the app is ready.
        This will ensure that all hardcoded categories exist in the database
        and register signals.
        """
        # Import signals
        import products.signals

        # Import management command and run it
        # We use a try-except block to handle the case when the app is being loaded
        # during migrations or when the database tables don't exist yet
        try:
            from django.core.management import call_command
            call_command('ensure_categories')
        except Exception as e:
            # Print the error but don't raise it to avoid breaking app startup
            print(f"Error ensuring categories: {e}")
