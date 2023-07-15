from rest_framework import serializers
from swiftpay_backend.models.registered_tv_smartcards_model import *

class RegisteredTvSmartCardsSerializer(serializers.ModelSerializer):
   class Meta:
       model = RegisteredTvSmartCards
       fields = ('public_id', 'iuc_number')
       
       