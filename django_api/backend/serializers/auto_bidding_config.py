from rest_framework import serializers
from ..models import AutoBiddingConfig
from ..models import Item


class AutoBiddingConfigSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), many=True, required=False)

    class Meta:
        model = AutoBiddingConfig
        fields = ['max_bid_amount', 'alert_percentage', 'user', 'items']
