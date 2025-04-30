from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.db.models import Sum, Count, Q, F, ExpressionWrapper, FloatField
from django.db.models.functions import TruncMonth, TruncDay
from django.utils import timezone
from django.contrib.admin.models import LogEntry
from django.urls import reverse
import json
from datetime import timedelta, datetime
from products.models import Product, Category, Review
from orders.models import Order, OrderItem, Payment

class VarnikaKartAdminSite(AdminSite):
    site_header = 'VarnikaKart Administration'
    site_title = 'VarnikaKart Admin'
    index_title = 'Dashboard'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('reports/sales/', self.admin_view(self.sales_report_view), name='sales_report'),
            path('reports/inventory/', self.admin_view(self.inventory_report_view), name='inventory_report'),
            path('reports/customers/', self.admin_view(self.customer_report_view), name='customer_report'),
            path('export/sales/', self.admin_view(self.export_sales), name='export_sales'),
            path('export/orders/', self.admin_view(self.export_orders), name='export_orders'),
            path('settings/site/', self.admin_view(self.site_settings), name='site_settings'),
            path('settings/payment/', self.admin_view(self.payment_settings), name='payment_settings'),
            path('settings/shipping/', self.admin_view(self.shipping_settings), name='shipping_settings'),
            path('activity-log/', self.admin_view(self.activity_log), name='activity_log'),
            path('search/', self.admin_view(self.admin_search), name='search'),
        ]
        return custom_urls + urls

    def sales_report_view(self, request):
        """
        Display the sales report view with detailed analytics.
        """
        from django.core.paginator import Paginator
        from django.db.models.functions import TruncWeek

        context = self.each_context(request)

        # Get filter parameters
        date_range = request.GET.get('date_range', '')
        category_id = request.GET.get('category', '')
        payment_method = request.GET.get('payment_method', '')
        status = request.GET.get('status', '')

        # Base query for orders
        orders_query = Order.objects.filter(status__in=['C', 'S', 'D'])

        # Apply filters
        if date_range:
            try:
                start_date, end_date = date_range.split(' to ')
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                orders_query = orders_query.filter(created_at__date__gte=start_date, created_at__date__lte=end_date)
            except ValueError:
                pass

        if category_id:
            orders_query = orders_query.filter(items__product__category_id=category_id)

        if payment_method:
            orders_query = orders_query.filter(payment_method=payment_method)

        if status:
            orders_query = orders_query.filter(status=status)

        # Calculate statistics
        total_orders = orders_query.count()
        total_revenue = orders_query.aggregate(total=Sum('order_total'))['total'] or 0
        total_items_sold = OrderItem.objects.filter(order__in=orders_query).aggregate(total=Sum('quantity'))['total'] or 0

        # Calculate average order value
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0

        # Get growth rates (comparing to previous period)
        today = timezone.now().date()
        current_period_start = today - timedelta(days=30)
        previous_period_start = current_period_start - timedelta(days=30)

        current_period_orders = Order.objects.filter(
            status__in=['C', 'S', 'D'],
            created_at__date__gte=current_period_start,
            created_at__date__lte=today
        )

        previous_period_orders = Order.objects.filter(
            status__in=['C', 'S', 'D'],
            created_at__date__gte=previous_period_start,
            created_at__date__lt=current_period_start
        )

        current_revenue = current_period_orders.aggregate(total=Sum('order_total'))['total'] or 0
        previous_revenue = previous_period_orders.aggregate(total=Sum('order_total'))['total'] or 0

        current_orders_count = current_period_orders.count()
        previous_orders_count = previous_period_orders.count()

        current_items = OrderItem.objects.filter(order__in=current_period_orders).aggregate(total=Sum('quantity'))['total'] or 0
        previous_items = OrderItem.objects.filter(order__in=previous_period_orders).aggregate(total=Sum('quantity'))['total'] or 0

        revenue_growth = ((current_revenue - previous_revenue) / previous_revenue * 100) if previous_revenue > 0 else 0
        order_growth = ((current_orders_count - previous_orders_count) / previous_orders_count * 100) if previous_orders_count > 0 else 0
        items_growth = ((current_items - previous_items) / previous_items * 100) if previous_items > 0 else 0

        current_aov = current_revenue / current_orders_count if current_orders_count > 0 else 0
        previous_aov = previous_revenue / previous_orders_count if previous_orders_count > 0 else 0
        aov_growth = ((current_aov - previous_aov) / previous_aov * 100) if previous_aov > 0 else 0

        # Get top selling products
        top_products = Product.objects.annotate(
            quantity_sold=Sum('orderitem__quantity', filter=Q(orderitem__order__in=orders_query)),
            revenue=Sum(F('orderitem__price') * F('orderitem__quantity'), filter=Q(orderitem__order__in=orders_query))
        ).filter(quantity_sold__gt=0).order_by('-quantity_sold')[:10]

        # Get recent orders
        recent_orders = orders_query.order_by('-created_at')[:20]

        # Get all categories for filter
        categories = Category.objects.all()

        # Generate sales trend data
        # Daily sales
        daily_sales = orders_query.filter(
            created_at__date__gte=today - timedelta(days=30)
        ).annotate(
            day=TruncDay('created_at')
        ).values('day').annotate(
            total=Sum('order_total')
        ).order_by('day')

        daily_sales_labels = []
        daily_sales_data = []

        for i in range(30):
            day = today - timedelta(days=29-i)
            day_data = next((item for item in daily_sales if item['day'].date() == day), None)
            daily_sales_labels.append(day.strftime('%b %d'))
            daily_sales_data.append(float(day_data['total']) if day_data else 0)

        # Weekly sales
        weekly_sales = orders_query.filter(
            created_at__date__gte=today - timedelta(days=90)
        ).annotate(
            week=TruncWeek('created_at')
        ).values('week').annotate(
            total=Sum('order_total')
        ).order_by('week')

        weekly_sales_labels = []
        weekly_sales_data = []

        for i in range(12):
            week_start = today - timedelta(days=today.weekday() + 7*11) + timedelta(days=7*i)
            week_end = week_start + timedelta(days=6)
            week_data = next((item for item in weekly_sales if item['week'].date() <= week_start and item['week'].date() + timedelta(days=6) >= week_start), None)
            weekly_sales_labels.append(f"{week_start.strftime('%b %d')} - {week_end.strftime('%b %d')}")
            weekly_sales_data.append(float(week_data['total']) if week_data else 0)

        # Monthly sales
        monthly_sales = orders_query.filter(
            created_at__date__gte=today.replace(day=1) - timedelta(days=365)
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('order_total')
        ).order_by('month')

        monthly_sales_labels = []
        monthly_sales_data = []

        for i in range(12):
            month = (today.replace(day=1) - timedelta(days=30*11)) + timedelta(days=30*i)
            month_data = next((item for item in monthly_sales if item['month'].month == month.month and item['month'].year == month.year), None)
            monthly_sales_labels.append(month.strftime('%b %Y'))
            monthly_sales_data.append(float(month_data['total']) if month_data else 0)

        # Sales by category
        category_sales = OrderItem.objects.filter(
            order__in=orders_query
        ).values(
            'product__category__name'
        ).annotate(
            total=Sum(F('price') * F('quantity'))
        ).order_by('-total')

        category_labels = [item['product__category__name'] for item in category_sales]
        category_data = [float(item['total']) for item in category_sales]

        context.update({
            'title': 'Sales Report',
            'total_orders': total_orders,
            'total_revenue': "{:.2f}".format(total_revenue),
            'total_items_sold': total_items_sold,
            'avg_order_value': "{:.2f}".format(avg_order_value),
            'revenue_growth': revenue_growth,
            'order_growth': order_growth,
            'items_growth': items_growth,
            'aov_growth': aov_growth,
            'top_products': top_products,
            'recent_orders': recent_orders,
            'categories': categories,
            'daily_sales_labels': json.dumps(daily_sales_labels),
            'daily_sales_data': json.dumps(daily_sales_data),
            'weekly_sales_labels': json.dumps(weekly_sales_labels),
            'weekly_sales_data': json.dumps(weekly_sales_data),
            'monthly_sales_labels': json.dumps(monthly_sales_labels),
            'monthly_sales_data': json.dumps(monthly_sales_data),
            'category_labels': json.dumps(category_labels),
            'category_data': json.dumps(category_data),
        })

        return self.render_with_template('admin/sales_report.html', context, request)

    def inventory_report_view(self, request):
        """
        Display the inventory report view with detailed stock analytics.
        """
        context = self.each_context(request)

        # Get filter parameters
        category_id = request.GET.get('category', '')
        stock_status = request.GET.get('stock_status', '')
        availability = request.GET.get('availability', '')
        sort_by = request.GET.get('sort_by', 'name')

        # Base query for products
        products_query = Product.objects.select_related('category')

        # Apply filters
        if category_id:
            products_query = products_query.filter(category_id=category_id)

        if stock_status == 'in_stock':
            products_query = products_query.filter(stock__gt=10)
        elif stock_status == 'low_stock':
            products_query = products_query.filter(stock__gt=0, stock__lte=10)
        elif stock_status == 'out_of_stock':
            products_query = products_query.filter(stock=0)

        if availability == 'available':
            products_query = products_query.filter(is_available=True)
        elif availability == 'unavailable':
            products_query = products_query.filter(is_available=False)

        # Apply sorting
        if sort_by == 'name':
            products_query = products_query.order_by('name')
        elif sort_by == 'stock_asc':
            products_query = products_query.order_by('stock')
        elif sort_by == 'stock_desc':
            products_query = products_query.order_by('-stock')
        elif sort_by == 'price_asc':
            products_query = products_query.order_by('price')
        elif sort_by == 'price_desc':
            products_query = products_query.order_by('-price')

        # Calculate stock value for each product
        for product in products_query:
            product.stock_value = product.price * product.stock

        # Calculate statistics
        total_products = products_query.count()
        active_products = products_query.filter(is_available=True).count()
        active_percentage = (active_products / total_products * 100) if total_products > 0 else 0

        total_stock = products_query.aggregate(total=Sum('stock'))['total'] or 0

        # Calculate total stock value
        total_stock_value = sum(product.stock_value for product in products_query)
        stock_value_percentage = 100  # Placeholder, could be calculated based on target inventory value

        # Get low stock and out of stock counts
        low_stock_count = products_query.filter(stock__gt=0, stock__lte=10).count()
        out_of_stock_count = products_query.filter(stock=0).count()
        in_stock_count = products_query.filter(stock__gt=10).count()

        low_stock_percentage = (low_stock_count / total_products * 100) if total_products > 0 else 0
        out_of_stock_percentage = (out_of_stock_count / total_products * 100) if total_products > 0 else 0

        # Get low stock products
        low_stock_products = products_query.filter(stock__gt=0, stock__lte=10).order_by('stock')[:10]

        # Get all categories for filter
        categories = Category.objects.all()

        # Generate category stock data
        category_stock = Category.objects.annotate(
            stock_count=Sum('products__stock'),
            product_count=Count('products')
        ).filter(stock_count__gt=0).order_by('-stock_count')

        category_labels = [category.name for category in category_stock]
        category_stock_data = [category.stock_count for category in category_stock]

        # Calculate stock value by category
        category_value_data = []
        for category in category_stock:
            category_products = Product.objects.filter(category=category)
            category_value = sum(product.price * product.stock for product in category_products)
            category_value_data.append(float(category_value))

        context.update({
            'title': 'Inventory Report',
            'products': products_query,
            'total_products': total_products,
            'active_percentage': round(active_percentage),
            'total_stock': total_stock,
            'total_stock_value': "{:.2f}".format(total_stock_value),
            'stock_value_percentage': stock_value_percentage,
            'low_stock_count': low_stock_count,
            'out_of_stock_count': out_of_stock_count,
            'in_stock_count': in_stock_count,
            'low_stock_percentage': round(low_stock_percentage),
            'out_of_stock_percentage': round(out_of_stock_percentage),
            'low_stock_products': low_stock_products,
            'categories': categories,
            'category_labels': json.dumps(category_labels),
            'category_stock_data': json.dumps(category_stock_data),
            'category_value_data': json.dumps(category_value_data),
        })

        return self.render_with_template('admin/inventory_report.html', context, request)

    def customer_report_view(self, request):
        """
        Display the customer report view with detailed customer analytics.
        """
        from django.db.models.functions import TruncMonth
        from django.contrib.auth.models import User

        context = self.each_context(request)

        # Get filter parameters
        date_range = request.GET.get('date_range', '')
        customer_segment = request.GET.get('customer_segment', '')
        order_count_filter = request.GET.get('order_count', '')
        sort_by = request.GET.get('sort_by', 'date_joined')

        # Base query for customers
        customers_query = User.objects.select_related('profile').prefetch_related('orders')

        # Apply filters
        if date_range:
            try:
                start_date, end_date = date_range.split(' to ')
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                customers_query = customers_query.filter(date_joined__date__gte=start_date, date_joined__date__lte=end_date)
            except ValueError:
                pass

        # Calculate order counts and total spent for each customer
        today = timezone.now().date()
        active_threshold = today - timedelta(days=90)  # Active within last 90 days

        for customer in customers_query:
            customer_orders = Order.objects.filter(user=customer, status__in=['C', 'S', 'D'])
            customer.order_count = customer_orders.count()
            customer.total_spent = customer_orders.aggregate(total=Sum('order_total'))['total'] or 0

            if customer.order_count > 0:
                customer.avg_order_value = customer.total_spent / customer.order_count
                customer.last_order = customer_orders.order_by('-created_at').first().created_at

                # Determine customer segment
                if customer.last_order.date() >= active_threshold:
                    if customer.order_count >= 3:
                        customer.segment = 'loyal'
                    else:
                        customer.segment = 'active'
                else:
                    customer.segment = 'inactive'
            else:
                customer.avg_order_value = 0
                customer.last_order = None
                customer.segment = 'new'

        # Apply additional filters based on calculated fields
        if customer_segment:
            customers_query = [c for c in customers_query if c.segment == customer_segment]

        if order_count_filter:
            if order_count_filter == '0':
                customers_query = [c for c in customers_query if c.order_count == 0]
            elif order_count_filter == '1':
                customers_query = [c for c in customers_query if c.order_count == 1]
            elif order_count_filter == '2-5':
                customers_query = [c for c in customers_query if 2 <= c.order_count <= 5]
            elif order_count_filter == '5+':
                customers_query = [c for c in customers_query if c.order_count > 5]

        # Apply sorting
        if sort_by == 'date_joined':
            customers_query = sorted(customers_query, key=lambda c: c.date_joined, reverse=True)
        elif sort_by == 'order_count':
            customers_query = sorted(customers_query, key=lambda c: c.order_count, reverse=True)
        elif sort_by == 'total_spent':
            customers_query = sorted(customers_query, key=lambda c: c.total_spent, reverse=True)
        elif sort_by == 'last_order':
            # Sort by last_order, putting None values at the end
            customers_query = sorted(
                customers_query,
                key=lambda c: (c.last_order is None, c.last_order if c.last_order else timezone.now()),
                reverse=True
            )

        # Calculate statistics
        total_customers = len(customers_query)
        active_customers = len([c for c in customers_query if c.segment in ['active', 'loyal']])
        active_percentage = (active_customers / total_customers * 100) if total_customers > 0 else 0

        # Calculate segment counts
        new_segment_count = len([c for c in customers_query if c.segment == 'new'])
        active_segment_count = len([c for c in customers_query if c.segment == 'active'])
        inactive_segment_count = len([c for c in customers_query if c.segment == 'inactive'])
        loyal_segment_count = len([c for c in customers_query if c.segment == 'loyal'])

        # Calculate average customer value
        total_spent = sum(c.total_spent for c in customers_query)
        avg_customer_value = total_spent / total_customers if total_customers > 0 else 0

        # Calculate repeat purchase rate
        customers_with_orders = len([c for c in customers_query if c.order_count > 0])
        repeat_customers = len([c for c in customers_query if c.order_count > 1])
        repeat_purchase_rate = (repeat_customers / customers_with_orders * 100) if customers_with_orders > 0 else 0

        # Get growth rates (comparing to previous period)
        current_period_start = today - timedelta(days=30)
        previous_period_start = current_period_start - timedelta(days=30)

        current_period_customers = User.objects.filter(date_joined__date__gte=current_period_start, date_joined__date__lte=today).count()
        previous_period_customers = User.objects.filter(date_joined__date__gte=previous_period_start, date_joined__date__lt=current_period_start).count()

        customer_growth = ((current_period_customers - previous_period_customers) / previous_period_customers * 100) if previous_period_customers > 0 else 0

        # Calculate ACV growth and RPR growth (dummy data for now)
        acv_growth = 5.2
        rpr_growth = 3.8

        # Get top customers
        top_customers = sorted(customers_query, key=lambda c: c.total_spent, reverse=True)[:10]

        # Generate customer growth data
        months = 12
        monthly_new_customers = User.objects.filter(
            date_joined__date__gte=today.replace(day=1) - timedelta(days=30*months)
        ).annotate(
            month=TruncMonth('date_joined')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        growth_labels = []
        new_customers_data = []
        total_customers_data = []

        running_total = User.objects.filter(date_joined__date__lt=today.replace(day=1) - timedelta(days=30*months)).count()

        for i in range(months):
            month = (today.replace(day=1) - timedelta(days=30*(months-i-1)))
            month_data = next((item for item in monthly_new_customers if item['month'].month == month.month and item['month'].year == month.year), None)

            month_new = month_data['count'] if month_data else 0
            running_total += month_new

            growth_labels.append(month.strftime('%b %Y'))
            new_customers_data.append(month_new)
            total_customers_data.append(running_total)

        context.update({
            'title': 'Customer Report',
            'customers': customers_query,
            'total_customers': total_customers,
            'active_customers': active_customers,
            'active_percentage': round(active_percentage),
            'avg_customer_value': "{:.2f}".format(avg_customer_value),
            'repeat_purchase_rate': round(repeat_purchase_rate),
            'customer_growth': customer_growth,
            'acv_growth': acv_growth,
            'rpr_growth': rpr_growth,
            'top_customers': top_customers,
            'new_segment_count': new_segment_count,
            'active_segment_count': active_segment_count,
            'inactive_segment_count': inactive_segment_count,
            'loyal_segment_count': loyal_segment_count,
            'growth_labels': json.dumps(growth_labels),
            'new_customers_data': json.dumps(new_customers_data),
            'total_customers_data': json.dumps(total_customers_data),
        })

        return self.render_with_template('admin/customer_report.html', context, request)

    def export_sales(self, request):
        # Placeholder for export sales functionality
        from django.http import HttpResponse
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="sales_export.csv"'
        return response

    def export_orders(self, request):
        # Placeholder for export orders functionality
        from django.http import HttpResponse
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders_export.csv"'
        return response

    def site_settings(self, request):
        # Placeholder for site settings view
        context = self.each_context(request)
        context.update({
            'title': 'Site Settings',
        })
        return self.render_with_template('admin/settings/site_settings.html', context, request)

    def payment_settings(self, request):
        # Placeholder for payment settings view
        context = self.each_context(request)
        context.update({
            'title': 'Payment Settings',
        })
        return self.render_with_template('admin/settings/payment_settings.html', context, request)

    def shipping_settings(self, request):
        # Placeholder for shipping settings view
        context = self.each_context(request)
        context.update({
            'title': 'Shipping Settings',
        })
        return self.render_with_template('admin/settings/shipping_settings.html', context, request)

    def activity_log(self, request):
        """
        Display the activity log with filtering and analytics.
        """
        from django.core.paginator import Paginator
        from django.contrib.contenttypes.models import ContentType
        from django.db.models import Q

        context = self.each_context(request)

        # Get filter parameters
        user_id = request.GET.get('user', '')
        action_type = request.GET.get('action_type', '')
        content_type_id = request.GET.get('content_type', '')
        date_range = request.GET.get('date_range', '')
        query = request.GET.get('q', '')

        # Base query for log entries
        log_entries_query = LogEntry.objects.select_related('content_type', 'user').order_by('-action_time')

        # Apply filters
        if user_id:
            log_entries_query = log_entries_query.filter(user_id=user_id)

        if action_type:
            log_entries_query = log_entries_query.filter(action_flag=action_type)

        if content_type_id:
            log_entries_query = log_entries_query.filter(content_type_id=content_type_id)

        if date_range:
            try:
                start_date, end_date = date_range.split(' to ')
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                log_entries_query = log_entries_query.filter(action_time__date__gte=start_date, action_time__date__lte=end_date)
            except ValueError:
                pass

        if query:
            log_entries_query = log_entries_query.filter(
                Q(object_repr__icontains=query) |
                Q(user__username__icontains=query) |
                Q(content_type__model__icontains=query)
            )

        # Paginate results
        paginator = Paginator(log_entries_query, 25)  # Show 25 entries per page
        page_number = request.GET.get('page', 1)
        log_entries = paginator.get_page(page_number)

        # Get users for filter
        users = User.objects.filter(is_staff=True).order_by('username')

        # Get content types for filter
        content_types = ContentType.objects.order_by('app_label', 'model')

        # Calculate action type counts
        additions_count = log_entries_query.filter(action_flag=1).count()
        changes_count = log_entries_query.filter(action_flag=2).count()
        deletions_count = log_entries_query.filter(action_flag=3).count()

        # Calculate user activity data
        user_activity = log_entries_query.values('user__username').annotate(count=Count('id')).order_by('-count')[:10]
        user_activity_labels = [item['user__username'] for item in user_activity]
        user_activity_data = [item['count'] for item in user_activity]

        context.update({
            'title': 'Activity Log',
            'log_entries': log_entries,
            'users': users,
            'content_types': content_types,
            'additions_count': additions_count,
            'changes_count': changes_count,
            'deletions_count': deletions_count,
            'user_activity_labels': json.dumps(user_activity_labels),
            'user_activity_data': json.dumps(user_activity_data),
        })

        return self.render_with_template('admin/activity_log.html', context, request)

    def admin_search(self, request):
        # Placeholder for admin search functionality
        context = self.each_context(request)
        query = request.GET.get('q', '')
        context.update({
            'title': 'Search Results',
            'query': query,
        })
        return self.render_with_template('admin/search_results.html', context, request)

    def render_with_template(self, template, context, request):
        from django.shortcuts import render
        return render(request, template, context)

    def index(self, request, extra_context=None):
        # Get time range from request
        time_range = request.GET.get('time_range', 'today')

        # Define date ranges
        today = timezone.now().date()
        if time_range == 'today':
            start_date = today
        elif time_range == 'yesterday':
            start_date = today - timedelta(days=1)
            today = start_date
        elif time_range == 'week':
            start_date = today - timedelta(days=7)
        elif time_range == 'month':
            start_date = today.replace(day=1)
        elif time_range == 'year':
            start_date = today.replace(month=1, day=1)
        else:
            start_date = today

        # Basic statistics
        user_count = User.objects.count()
        product_count = Product.objects.count()
        order_count = Order.objects.count()

        # Active products percentage
        active_products = Product.objects.filter(is_available=True).count()
        active_products_percentage = int((active_products / product_count * 100) if product_count > 0 else 0)

        # Calculate total revenue
        total_revenue = Order.objects.filter(status__in=['C', 'S', 'D']).aggregate(
            total=Sum('order_total')
        )['total'] or 0

        # Format revenue to 2 decimal places
        revenue = "{:.2f}".format(total_revenue)

        # Calculate growth rates (dummy data for now)
        revenue_growth = 15.8
        order_growth = 8.5
        user_growth = 12.3

        # Get order counts by status
        pending_orders_count = Order.objects.filter(status='P').count()
        confirmed_orders_count = Order.objects.filter(status='C').count()
        shipped_orders_count = Order.objects.filter(status='S').count()
        delivered_orders_count = Order.objects.filter(status='D').count()
        cancelled_orders_count = Order.objects.filter(status='X').count()

        # Get recent orders
        recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]

        # Get low stock products
        low_stock_products = Product.objects.select_related('category').filter(
            stock__lte=10, is_available=True
        ).order_by('stock')[:5]

        # Get recent reviews
        recent_reviews = Review.objects.select_related('product', 'user').order_by('-created_at')[:5]

        # Get admin log entries
        admin_log = LogEntry.objects.select_related('content_type', 'user').order_by('-action_time')[:10]

        # Generate monthly sales data for chart
        months = 12
        monthly_sales = Order.objects.filter(
            status__in=['C', 'S', 'D'],
            created_at__gte=timezone.now() - timedelta(days=30*months)
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('order_total')
        ).order_by('month')

        # Format data for Chart.js
        monthly_sales_data = []
        for i in range(months):
            month = (timezone.now() - timedelta(days=30*(months-i-1))).replace(day=1)
            month_data = next((item for item in monthly_sales if item['month'].month == month.month and
                              item['month'].year == month.year), None)
            monthly_sales_data.append(float(month_data['total']) if month_data else 0)

        # Revenue sources data (dummy data for now)
        revenue_sources_data = {
            'labels': ['Direct', 'Social Media', 'Email', 'Affiliates', 'Other'],
            'data': [55, 20, 15, 8, 2]
        }

        # Today's, weekly, and monthly sales
        today_sales = Order.objects.filter(
            status__in=['C', 'S', 'D'],
            created_at__date=today
        ).aggregate(total=Sum('order_total'))['total'] or 0

        weekly_sales = Order.objects.filter(
            status__in=['C', 'S', 'D'],
            created_at__date__gte=today - timedelta(days=7)
        ).aggregate(total=Sum('order_total'))['total'] or 0

        monthly_sales = Order.objects.filter(
            status__in=['C', 'S', 'D'],
            created_at__date__gte=today.replace(day=1)
        ).aggregate(total=Sum('order_total'))['total'] or 0

        context = {
            'user_count': user_count,
            'product_count': product_count,
            'order_count': order_count,
            'revenue': revenue,
            'active_products_percentage': active_products_percentage,
            'revenue_growth': revenue_growth,
            'order_growth': order_growth,
            'user_growth': user_growth,
            'pending_orders_count': pending_orders_count,
            'confirmed_orders_count': confirmed_orders_count,
            'shipped_orders_count': shipped_orders_count,
            'delivered_orders_count': delivered_orders_count,
            'cancelled_orders_count': cancelled_orders_count,
            'recent_orders': recent_orders,
            'low_stock_products': low_stock_products,
            'recent_reviews': recent_reviews,
            'admin_log': admin_log,
            'monthly_sales_data': json.dumps(monthly_sales_data),
            'revenue_sources_data': json.dumps(revenue_sources_data),
            'today_sales': "{:.2f}".format(today_sales),
            'weekly_sales': "{:.2f}".format(weekly_sales),
            'monthly_sales': "{:.2f}".format(monthly_sales),
            'time_range': time_range,
        }

        if extra_context:
            context.update(extra_context)

        # Use our custom dashboard template instead of the default admin index
        return self.render_with_template('admin/custom_dashboard.html', context, request)

# Create an instance of the custom admin site
admin_site = VarnikaKartAdminSite(name='varnikakart_admin')

# Register User and Group models with the custom admin site
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
