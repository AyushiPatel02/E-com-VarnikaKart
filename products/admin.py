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

def make_active(modeladmin, request, queryset):
    """Admin action to make selected categories active"""
    queryset.update(is_active=True)
    modeladmin.message_user(request, f"{queryset.count()} categories marked as active.")
make_active.short_description = "Mark selected categories as active"

def make_inactive(modeladmin, request, queryset):
    """Admin action to make selected categories inactive"""
    queryset.update(is_active=False)
    modeladmin.message_user(request, f"{queryset.count()} categories marked as inactive.")
make_inactive.short_description = "Mark selected categories as inactive"

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_count', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active',)
    list_per_page = 20
    actions = [make_active, make_inactive]

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'image')
        }),
        ('Display Options', {
            'fields': ('is_active',)
        }),
    )

    def product_count(self, obj):
        """Display the number of products in the category"""
        count = obj.products.filter(is_available=True).count()
        return f'{count} product{"s" if count != 1 else ""}'
    product_count.short_description = 'Products'

    def save_model(self, request, obj, form, change):
        """
        Override save_model to ensure categories are active by default
        when added by the super admin
        """
        # Always set is_active to True, whether it's a new category or an update
        obj.is_active = True

        # Call the parent save_model method
        super().save_model(request, obj, form, change)

        # Log the action
        if not change:
            self.message_user(request, f"Category '{obj.name}' has been created and is active on the main website.")
        else:
            self.message_user(request, f"Category '{obj.name}' has been updated and is active on the main website.")

    def get_queryset(self, request):
        """
        Override get_queryset to ensure all categories are returned
        """
        queryset = super().get_queryset(request)
        # Force refresh from database to ensure we get all categories
        return Category.objects.all()

    def changelist_view(self, request, extra_context=None):
        # Get active categories count
        active_categories = Category.objects.filter(is_active=True).count()
        total_categories = Category.objects.count()
        active_percentage = int((active_categories / total_categories * 100) if total_categories > 0 else 0)

        # Get total products count
        total_products = Product.objects.count()

        # Get all categories for the list
        category_list = Category.objects.all()

        # Create context
        context = {
            'active_categories': active_categories,
            'active_percentage': active_percentage,
            'total_products': total_products,
            'category_list': category_list,
        }

        if extra_context:
            context.update(extra_context)

        return super().changelist_view(request, context)

def make_available(modeladmin, request, queryset):
    """Admin action to make selected products available"""
    queryset.update(is_available=True)
    modeladmin.message_user(request, f"{queryset.count()} products marked as available.")
make_available.short_description = "Mark selected products as available"

def make_unavailable(modeladmin, request, queryset):
    """Admin action to make selected products unavailable"""
    queryset.update(is_available=False)
    modeladmin.message_user(request, f"{queryset.count()} products marked as unavailable.")
make_unavailable.short_description = "Mark selected products as unavailable"

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'discount_price', 'stock', 'is_available', 'is_featured', 'created_at')
    list_filter = ('category', 'is_available', 'is_featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'discount_price', 'stock', 'is_available', 'is_featured')
    list_per_page = 20
    inlines = [ProductImageInline, ProductVariationInline, ReviewInline]
    actions = [make_available, make_unavailable]

    # Use custom template for add/edit form
    change_form_template = 'admin/products/product/custom_add_form.html'

    def save_model(self, request, obj, form, change):
        """
        Override save_model to ensure products are available by default
        when added by the super admin
        """
        # Always set is_available to True, whether it's a new product or an update
        obj.is_available = True

        # Ensure the category is active
        if obj.category and not obj.category.is_active:
            obj.category.is_active = True
            obj.category.save()

        # Call the parent save_model method
        super().save_model(request, obj, form, change)

        # Log the action
        if not change:
            self.message_user(request, f"Product '{obj.name}' has been created and is available on the main website.")
        else:
            self.message_user(request, f"Product '{obj.name}' has been updated and is available on the main website.")

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
            'all': ('admin/css/admin_base.css', 'admin/css/admin_components.css', 'admin/css/admin_pages.css',)
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
