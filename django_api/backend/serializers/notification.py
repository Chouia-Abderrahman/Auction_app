from ..models import Notification
from rest_framework import serializers

class NotificaionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['user', 'message']