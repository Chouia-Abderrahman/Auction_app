from ...serializers import ItemSerializer
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from ...models import Item



def get_items(request):
    search_query = request.query_params.get('search', '')
    items = Item.objects.filter(
        Q(name__icontains=search_query) | Q(description__icontains=search_query)
    )
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)