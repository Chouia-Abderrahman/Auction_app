from rest_framework import status

from ...serializers import ItemSerializer
from rest_framework.response import Response


def create_item(request):
    user_access = request.headers.get('user-access', None)

    if user_access == "admin":
        data = request.data.copy()
        if not data.get('current_price'):
            data['current_price'] = data.get('starting_price')
        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)