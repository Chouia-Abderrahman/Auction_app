from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('items/', views.item_list, name='item-list'),
    path('items/<int:pk>/', views.item_detail, name='item-detail'),
    path('items/<int:pk>/bid/', views.place_bid, name='place-bid'),
    path('auto-bidding-config/', views.create_auto_bidding_config, name='create-auto-bidding-config'),
    path('auto-bidding-config/<str:user_name>', views.get_bidding_config, name='get-auto-bidding-config'),
    path('autobid-config/<str:user_access>/add-item/<int:item_id>/',views.add_item_auto_bid, name='add-item-auto-bid'),
    path('notifications/<str:user_access>/',views.send_notification, name='send_notification'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)