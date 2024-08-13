from ...serializers import ItemSerializer
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status

def get_item_details(request, item):
    serializer = ItemSerializer(item)
    return Response(serializer.data, status=status.HTTP_200_OK)