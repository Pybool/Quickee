from .models import Order
from rest_framework import serializers

class OrderInstanceSerializer(serializers.Serializer):
    class Meta:
        model = Order
        fields = '__all__'