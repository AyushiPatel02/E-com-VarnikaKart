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

    def changelist_view(self, request, extra_context=None):
        # Get active categories count
        active_categories = Category.objects.filter(is_active=True).count()
        total_categories = Category.objects.count()
        active_percentage = int((active_categories / total_categories * 100) if total_categories > 0 else 0)

        # Get total products count
        total_products = Product.objects.count()

        # Create context
        context = {
            'active_categories': active_categories,
            'active_percentage': active_percentage,
            'total_products': total_products,
        }

        if extra_context:
            context.update(extra_context)

        return super().changelist_view(request, context)

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

    def changelist_view(self, request, extra_context=None):
        # Get product stats
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_available=True).count()
        featured_products = Product.objects.filter(is_featured=True).count()
        low_stock_products = Product.objects.filter(stock__lte=10, is_available=True).count()

        # Calculate percentages
        active_percentage = int((active_products / total_products * 100) if total_products > 0 else 0)
        featured_percentage = int((featured_products / total_products * 100) if total_products > 0 else 0)
        low_stock_percentage = int((low_stock_products / total_products * 100) if total_products > 0 else 0)

        # Get all categories for filter dropdown
        categories = Category.objects.filter(is_active=True).order_by('name')

        # Get all products for the list
        products = Product.objects.all()

        # Create context
        context = {
            'total_products': total_products,
            'active_products': active_products,
            'featured_products': featured_products,
            'low_stock_products': low_stock_products,
            'active_percentage': active_percentage,
            'featured_percentage': featured_percentage,
            'low_stock_percentage': low_stock_percentage,
            'categories': categories,
            'product_list': products,
        }

        if extra_context:
            context.update(extra_context)

        return super().changelist_view(request, context)

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
        js = ('admin/js/custom_admin.js',)

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
