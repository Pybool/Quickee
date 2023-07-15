from rest_framework import serializers
from swiftpay_backend.models.datasubscription_model import *

class DataSubscriptionsSerializer(serializers.ModelSerializer):
   class Meta:
       model = DataSubscriptions
       fields = ('plan_provider_id', 'plan_name','plan_code','plan_price','duration')
