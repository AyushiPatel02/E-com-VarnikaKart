from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariation, Review
from core.admin_site import admin_site

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductVariationInline(admin.TabularInline):
    model = ProductVariation
    extra = 1

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ('user', 'rating', 'title', 'comment', 'created_at')
    can_delete = False
    max_num = 0  # Don't allow adding new reviews in admin

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 20

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'discount_price', 'stock', 'is_available', 'is_featured', 'created_at')
    list_filter = ('category', 'is_available', 'is_featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'discount_price', 'stock', 'is_available', 'is_featured')
    list_per_page = 20
    inlines = [ProductImageInline, ProductVariationInline, ReviewInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('category', 'name', 'slug', 'description')
        }),
        ('Pricing and Inventory', {
            'fields': ('price', 'discount_price', 'stock')
        }),
        ('Status', {
            'fields': ('is_available', 'is_featured')
        }),
    )

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'title', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('title', 'comment', 'user__username', 'product__name')
    readonly_fields = ('product', 'user', 'rating', 'title', 'comment', 'created_at')
    list_per_page = 20

# Register with custom admin site
admin_site.register(Category, CategoryAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(Review, ReviewAdmin)

# Also register with default admin site for backwards compatibility
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
