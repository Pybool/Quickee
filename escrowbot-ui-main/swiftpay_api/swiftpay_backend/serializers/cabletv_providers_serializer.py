from rest_framework import serializers
from swiftpay_backend.models.cabletv_providers_model import *

class CableTvProvidersSerializer(serializers.ModelSerializer):
   class Meta:
       model = CableTvProviders
       fields = ('public_id', 'cabletv_name')
       