import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class AirtimePurchaseHistory(models.Model):
	
   buyer_public_id = models.CharField(max_length=100)
   order_id = models.CharField(unique=True,max_length=100)
   network_provider = models.CharField(max_length=100)
   phone_number = models.CharField(max_length=100)
   amount = models.DecimalField(max_digits=10, decimal_places=2)
   vend_status = models.BooleanField(default = False)
   date_time = models.CharField(max_length=100)
   cart_reference = models.CharField(max_length=500, blank=True, null=True)
   timestamp = models.FloatField(blank=True, null=True)
   mode = models.CharField(max_length=100, blank=True, null=True)
   payment_status =  models.BooleanField(default = False) # Only direct mode uses this field to store payment status, cart mode does not use this field at all
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @staticmethod
   def returntimestamp(order_id):
       return AirtimePurchaseHistory.objects.only('timestamp').get(order_id= order_id).timestamp

