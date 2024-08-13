from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from .models import Item, Bid, AutoBiddingConfig, Notification
from .serializers import ItemSerializer, BidSerializer, AutoBiddingConfigSerializer
from django.db.models import Q
from .api.item.get_items import get_items
from .api.item.create_item import create_item
from .api.item.get_item_details import get_item_details
from .api.item.modify_item import modify_item
from .api.item.delete_item import delete_item
from .api.bid.create_bid import create_bid
from .api.auto_bididng_config.get_config import get_config
from .api.auto_bididng_config.create_config import create_config

@api_view(['GET', 'POST'])
def item_list(request):
    if request.method == 'GET':
        return get_items(request)
    elif request.method == 'POST':
        return create_item(request)


@api_view(['GET', 'PUT', 'DELETE'])
def item_detail(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if request.method == 'GET':
        return get_item_details(request, item)
    elif request.method == 'PUT':
        return modify_item(request, item)
    elif request.method == 'DELETE':
        return delete_item(request, item)


@api_view(['POST'])
def place_bid(request, pk):
    item = get_object_or_404(Item, pk=pk)
    return create_bid(request, item)


@api_view(['POST'])
def create_auto_bidding_config(request):
    return create_config(request)

@api_view(['GET'])
def get_bidding_config(request, user_name):
    return get_config(request, user_name)


@api_view(['PUT', 'DELETE', 'GET'])
def add_item_auto_bid(request, user_access, item_id):
    try:
        config = AutoBiddingConfig.objects.get(user=user_access)
        item = Item.objects.get(id=item_id)
    except (AutoBiddingConfig.DoesNotExist, Item.DoesNotExist):
        return Response({"detail": "Config or Item not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        item_exists = config.items.filter(id=item_id).exists()
        return Response({"item_exists": item_exists}, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        config.items.add(item)
        return Response({"detail": "Item added to auto-bidding configuration."}, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        config.items.remove(item)
        return Response({"detail": "Item removed from auto-bidding configuration."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def send_notification(request, user_access):
    try:
        notification = Notification.objects.filter(user=user_access).order_by('id').first()

        if notification:
            response_data = {
                'user': notification.user,
                'message': notification.message
            }
            notification.delete()

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No notifications found for the user"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
