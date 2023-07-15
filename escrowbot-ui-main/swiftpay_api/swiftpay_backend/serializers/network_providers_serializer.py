from rest_framework import serializers
from swiftpay_backend.models.network_providers_model import *
       
class NetworkProvidersSerializer(serializers.ModelSerializer):
   class Meta:
       model = NetworkProviders
       fields = ('public_id', 'isp_name')
       
