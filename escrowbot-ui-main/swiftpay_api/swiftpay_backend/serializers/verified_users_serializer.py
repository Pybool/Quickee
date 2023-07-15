from rest_framework import serializers
from swiftpay_backend.models.user_model import *

class VerifiedUsersSerializer(serializers.ModelSerializer):
   class Meta:
       model = VerifiedUsers
       fields = ('public_id','firstname','middlename','lastname','email',
                 'username','default_phonenumber','auto_data_subscription',
                 'auto_electricity_subscription','auto_cable_subscription',
                 'password'
                 )
       extra_kwargs = {'password': {'write_only': True}}
       
        