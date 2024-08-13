from rest_framework import status

from ...serializers import ItemSerializer
from rest_framework.response import Response


def modify_item(request, item):
    serializer = ItemSerializer(item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)