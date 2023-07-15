import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class CableTvProviders(models.Model):
	
   public_id = models.CharField(max_length=100,unique=True)
   cabletv_name = models.CharField(max_length=100,unique=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @transaction.atomic()
   def insert(public_id,cabletv_name):

      try:
         cableproviders = CableTvProviders(public_id=public_id,cabletv_name=cabletv_name)
         cableproviders.save()
         return True
      except Exception as e:
         print(e)
         return False
   
   def read():
      pass

