from ..models import Item
from rest_framework import serializers
from .bid import BidSerializer
from django.utils import timezone


class ItemSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'starting_price', 'current_price', 'auction_end_time', 'picture', 'bids']

    def validate(self, data):

        if data.get('starting_price', 0) <= 0:
            raise serializers.ValidationError("Starting price must be greater than zero.")

        if data.get('auction_end_time') and data.get('auction_end_time') <= timezone.now():
            raise serializers.ValidationError("Auction end time must be in the future.")

        return data

    def create(self, validated_data):
        return Item.objects.create(**validated_data)
