from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    def changelist_view(self, request, extra_context=None):
        # Get staff users count
        staff_users = User.objects.filter(is_staff=True).count()
        total_users = User.objects.count()
        staff_percentage = int((staff_users / total_users * 100) if total_users > 0 else 0)
        
        # Get superusers count
        superusers = User.objects.filter(is_superuser=True).count()
        superuser_percentage = int((superusers / total_users * 100) if total_users > 0 else 0)
        
        # Get active users count
        active_users = User.objects.filter(is_active=True).count()
        active_percentage = int((active_users / total_users * 100) if total_users > 0 else 0)
        
        # Create context
        context = {
            'staff_users': staff_users,
            'staff_percentage': staff_percentage,
            'superusers': superusers,
            'superuser_percentage': superuser_percentage,
            'active_users': active_users,
            'active_percentage': active_percentage,
        }
        
        if extra_context:
            context.update(extra_context)
            
        return super().changelist_view(request, context)
