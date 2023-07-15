import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class Airtime(models.Model):
	
   network_provider = models.CharField(max_length=100, blank=True, null=True)
   discount = models.CharField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @transaction.atomic()
   def insert(provider,discount):

      try:
         airtime = Airtime(network_provider=provider,discount=discount)
         airtime.save()
         return True
      except Exception as e:
         print(e)
         return False
   
   def read():
      pass
   
