from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Payment

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'get_cost')

    def get_cost(self, obj):
        return obj.get_cost()
    get_cost.short_description = 'Cost'

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'price', 'quantity', 'get_cost')

    def get_cost(self, obj):
        return obj.get_cost()
    get_cost.short_description = 'Cost'

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_id', 'get_total_items', 'get_total_price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'session_id')
    inlines = [CartItemInline]

    def get_total_items(self, obj):
        return obj.get_total_items()
    get_total_items.short_description = 'Total Items'

    def get_total_price(self, obj):
        return obj.get_total_price()
    get_total_price.short_description = 'Total Price'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'full_name', 'order_total', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'user__username', 'full_name', 'email', 'phone_number')
    readonly_fields = ('order_number', 'user', 'order_total', 'tax', 'ip_address', 'created_at')
    inlines = [OrderItemInline]
    list_per_page = 20

    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'order_total', 'tax', 'status', 'is_ordered')
        }),
        ('Customer Information', {
            'fields': ('full_name', 'email', 'phone_number')
        }),
        ('Shipping Information', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'payment_status')
        }),
        ('Additional Information', {
            'fields': ('order_note', 'tracking_number', 'ip_address', 'created_at')
        }),
    )

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'order', 'payment_method', 'amount_paid', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('payment_id', 'order__order_number')
    readonly_fields = ('payment_id', 'order', 'payment_method', 'amount_paid', 'status', 'created_at')
    list_per_page = 20
