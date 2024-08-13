from ...models import AutoBiddingConfig
from ...serializers import AutoBiddingConfigSerializer
from rest_framework import status
from rest_framework.response import Response


def create_config(request):
    try:
        config = AutoBiddingConfig.objects.get(user=request.data["user"])
        # If it exists, update it
        serializer = AutoBiddingConfigSerializer(config, data=request.data, partial=True)
    except AutoBiddingConfig.DoesNotExist:
        # If it doesn't exist, create a new one
        serializer = AutoBiddingConfigSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)