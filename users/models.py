from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from core.email_utils import send_welcome_email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics', blank=True, null=True)
    super_admin_photo = models.ImageField(upload_to='super_admin_pics', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Address(models.Model):
    ADDRESS_CHOICES = (
        ('H', 'Home'),
        ('W', 'Work'),
        ('O', 'Other'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES, default='H')
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    street_address = models.CharField(max_length=255)
    apartment_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return f"{self.user.username}'s {self.get_address_type_display()} Address"

class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField('products.Product', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Wishlist"

@receiver(post_save, sender=User)
def create_user_profile_and_wishlist(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        Wishlist.objects.create(user=instance)

        # Send welcome email to new user
        if instance.email:
            send_welcome_email(instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
