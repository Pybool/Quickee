import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class ElectricityDiscos(models.Model):
	
   public_id = models.CharField(max_length=100,unique=True, blank=True, null=True)
   disco_name = models.CharField(max_length=100,unique=True, blank=True, null=True)
   disco_code = models.CharField(max_length=100,unique=True, blank=True, null=True)
   api_code = models.CharField(max_length=100,unique=True, blank=True, null=True)
   discount = models.FloatField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @transaction.atomic()
   def insert(uid,disco_name,disco_code,api_code,discount):

      try:
         disco = ElectricityDiscos(public_id=uid,disco_name=disco_name,disco_code=disco_code,api_code=api_code ,discount=discount)
         disco.save()
         return True
      except Exception as e:
         print(e)
         return False
   
   def returnapi_code(self,uid):
       return ElectricityDiscos.objects.only('api_code').get(public_id=uid).api_code

