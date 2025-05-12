from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Category, Product

@receiver(pre_save, sender=Category)
def ensure_category_active(sender, instance, **kwargs):
    """
    Signal to ensure that categories are active by default.
    This is especially important for categories added by the super admin.
    """
    # If this is a new category (no ID yet), set is_active to True by default
    if not instance.pk and instance.is_active is None:
        instance.is_active = True

@receiver(pre_save, sender=Product)
def ensure_product_active(sender, instance, **kwargs):
    """
    Signal to ensure that products are available by default.
    This is especially important for products added by the super admin.
    """
    # If this is a new product (no ID yet), set is_available to True by default
    if not instance.pk and instance.is_available is None:
        instance.is_available = True
