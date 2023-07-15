import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class NetworkProviders(models.Model):
	
   public_id = models.CharField(max_length=100,unique=True)
   isp_name = models.CharField(max_length=100,unique=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   @transaction.atomic()
   def insert(public_id,isp_name):
      try:
         networkproviders = NetworkProviders(public_id=public_id,isp_name=isp_name)
         networkproviders.save()
         return True
      except Exception as e:
         print(e)
         return False
   
   def read():
      pass


