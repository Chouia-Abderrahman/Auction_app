from ...models import AutoBiddingConfig
from ...serializers import AutoBiddingConfigSerializer
from rest_framework import status
from rest_framework.response import Response

def get_config(request, user_name):
    try:
        config = AutoBiddingConfig.objects.get(user=user_name)
    except AutoBiddingConfig.DoesNotExist:
        return Response({'detail': 'Configuration not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AutoBiddingConfigSerializer(config)
    return Response(serializer.data, status=status.HTTP_200_OK)