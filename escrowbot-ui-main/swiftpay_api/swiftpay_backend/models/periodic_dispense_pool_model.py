import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class DispensePool(models.Model): #Transient model

   buyer_public_id = models.CharField(max_length=100)
   service = models.CharField(max_length=100, blank=True, null=True)
   provider = models.CharField(max_length=100, blank=True, null=True)
   recipient = models.CharField(max_length=100, blank=True, null=True)
   phone_number = models.CharField(max_length=100, blank=True, null=True)
   servicename = models.CharField(max_length=100, blank=True, null=True)
   amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
   subscription_reference = models.CharField(max_length=500, blank=True, null=True)
   payment_status = models.BooleanField(default = False)
   date_time = models.CharField(max_length=100)
   vend_status = models.BooleanField(default = False)
   failure_reason = models.CharField(max_length=500, blank=True, null=True)
   timestamp = models.FloatField(blank=True, null=True)
   mode = models.CharField(max_length=100, blank=True, null=True)
   payment_status =  models.BooleanField(default = False) 
   api_provider = models.CharField(max_length=100, blank=True, null=True)