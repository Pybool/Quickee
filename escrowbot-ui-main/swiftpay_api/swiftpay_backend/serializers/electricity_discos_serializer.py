from rest_framework import serializers
from swiftpay_backend.models.electricity_discos_model import *

class ElectricityDiscosSerializer(serializers.ModelSerializer):
   class Meta:
        model =  ElectricityDiscos
        public_id = models.CharField(max_length=100,unique=True)
        disco_name = models.CharField(max_length=100,unique=True)
        disco_code = models.CharField(max_length=100)
        fields = ('public_id', 'disco_name','disco_code')
