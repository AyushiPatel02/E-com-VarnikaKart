from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from .superadmin_views import superadmin_login, superadmin_dashboard, superadmin_logout

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('deals/', views.deals, name='deals'),
    path('test/', views.test_page, name='test'),

    # Super Admin URLs
    path('super-admin/', superadmin_login, name='superadmin_login'),
    path('super-admin/dashboard/', superadmin_dashboard, name='superadmin_dashboard'),
    path('super-admin/logout/', superadmin_logout, name='superadmin_logout'),

    # Password Reset URLs
    path('password-reset/', auth_views.PasswordResetView.as_view(
        template_name='admin/password_reset.html',
        email_template_name='admin/password_reset_email.html',
        subject_template_name='admin/password_reset_subject.txt',
        success_url='/password-reset/done/'
    ), name='password_reset'),

    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='admin/password_reset_done.html'
    ), name='password_reset_done'),

    path('password-reset-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='admin/password_reset_confirm.html',
        success_url='/password-reset-complete/'
    ), name='password_reset_confirm'),

    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='admin/password_reset_complete.html'
    ), name='password_reset_complete'),
]

