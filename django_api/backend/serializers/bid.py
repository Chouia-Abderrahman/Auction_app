from ..models import Bid
from rest_framework import serializers

class BidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bid
        fields = ['id', 'user', 'amount', 'time']