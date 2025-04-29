from django import template
from products.models import ProductImage

register = template.Library()

@register.simple_tag
def get_primary_image(product):
    """Get the primary image for a product"""
    primary_image = ProductImage.objects.filter(product=product, is_primary=True).first()
    if primary_image:
        return primary_image.image.url
    return None

@register.simple_tag
def get_product_images(product):
    """Get all images for a product"""
    return product.images.all()

@register.simple_tag
def get_discount_percentage(product):
    """Calculate the discount percentage for a product"""
    if product.discount_price:
        discount = ((product.price - product.discount_price) / product.price) * 100
        return round(discount)
    return 0
