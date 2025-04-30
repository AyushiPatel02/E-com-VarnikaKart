from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.product_list, name='product_list'),

    # Category by slug
    path('category/<slug:category_slug>/', views.product_list, name='product_list_by_category'),

    # Trending page (keeping this as a separate page)
    path('trending/', views.trending, name='trending'),

    # Artists pages (keeping these as separate pages)
    path('featured-artists/', views.featured_artists, name='featured_artists'),
    path('artist-stores/', views.artist_stores, name='artist_stores'),
    path('become-artist/', views.become_artist, name='become_artist'),

    # Product detail and review
    path('add-review/<int:product_id>/', views.add_review, name='add_review'),
    path('<slug:slug>/', views.product_detail, name='product_detail'),
]
