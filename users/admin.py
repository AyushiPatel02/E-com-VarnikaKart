from django.contrib import admin
from .models import Profile, Address, Wishlist
from products.models import Product
from core.admin_site import admin_site

class AddressInline(admin.TabularInline):
    model = Address
    extra = 0
    fk_name = 'user'

class WishlistProductsInline(admin.TabularInline):
    model = Wishlist.products.through
    extra = 0
    verbose_name = 'Wishlist Product'
    verbose_name_plural = 'Wishlist Products'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'date_of_birth')
    search_fields = ('user__username', 'user__email', 'phone_number')
    list_per_page = 20

class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'address_type', 'city', 'state', 'is_default')
    list_filter = ('address_type', 'state', 'is_default')
    search_fields = ('user__username', 'full_name', 'street_address', 'city', 'state')
    list_per_page = 20

class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_product_count', 'created_at', 'updated_at')
    search_fields = ('user__username',)
    list_per_page = 20
    exclude = ('products',)
    inlines = [WishlistProductsInline]

    def get_product_count(self, obj):
        return obj.products.count()
    get_product_count.short_description = 'Product Count'

# Register with custom admin site
admin_site.register(Profile, ProfileAdmin)
admin_site.register(Address, AddressAdmin)
admin_site.register(Wishlist, WishlistAdmin)

# Also register with default admin site for backwards compatibility
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(Wishlist, WishlistAdmin)
