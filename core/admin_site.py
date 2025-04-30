from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.db.models import Sum
from products.models import Product
from orders.models import Order

class VarnikaKartAdminSite(AdminSite):
    site_header = 'VarnikaKart Administration'
    site_title = 'VarnikaKart Admin'
    index_title = 'Dashboard'

    def index(self, request, extra_context=None):
        # Get statistics for the dashboard
        user_count = User.objects.count()
        product_count = Product.objects.count()
        order_count = Order.objects.count()

        # Calculate total revenue
        total_revenue = Order.objects.filter(status__in=['C', 'S', 'D']).aggregate(
            total=Sum('order_total')
        )['total'] or 0

        # Format revenue to 2 decimal places
        revenue = "{:.2f}".format(total_revenue)

        context = {
            'user_count': user_count,
            'product_count': product_count,
            'order_count': order_count,
            'revenue': revenue,
        }

        if extra_context:
            context.update(extra_context)

        return super().index(request, context)

# Create an instance of the custom admin site
admin_site = VarnikaKartAdminSite(name='varnikakart_admin')

# Register User and Group models with the custom admin site
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
