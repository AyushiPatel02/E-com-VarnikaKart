from django.contrib import admin
from .models import Contact, Newsletter
from .admin_site import admin_site

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    list_per_page = 20
    date_hierarchy = 'created_at'

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return ('name', 'email', 'subject', 'message', 'user', 'created_at')
        return ()

class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('email',)
    list_per_page = 50

# Register models with the custom admin site
admin_site.register(Contact, ContactAdmin)
admin_site.register(Newsletter, NewsletterAdmin)

# Also register with the default admin site for backwards compatibility
admin.site.register(Contact, ContactAdmin)
admin.site.register(Newsletter, NewsletterAdmin)
