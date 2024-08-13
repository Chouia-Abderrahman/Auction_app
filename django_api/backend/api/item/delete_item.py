from rest_framework import status

from ...serializers import ItemSerializer
from rest_framework.response import Response

def delete_item(request, item):
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)