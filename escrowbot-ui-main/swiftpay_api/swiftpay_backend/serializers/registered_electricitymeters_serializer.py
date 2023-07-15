from rest_framework import serializers
from swiftpay_backend.models.registered_electric_meters_model import *

class RegisteredElectricityMetersSerializer(serializers.ModelSerializer):
   class Meta:
       model = RegisteredElectricityMeters
       fields = ('public_id', 'meternumber')
       

