from rest_framework import serializers
from swiftpay_backend.models.cabletv_bouquet_model import *
     
class CableTvBouquetsSerializer(serializers.ModelSerializer):
   class Meta:
       model = CableTvBouquets
       fields = ('tv_bouquet_provider_id', 'tv_bouquet_name','tv_bouquet_price','tv_bouquet_variation_id')
