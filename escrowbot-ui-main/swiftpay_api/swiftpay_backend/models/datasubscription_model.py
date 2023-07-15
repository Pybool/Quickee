import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .network_providers_model import NetworkProviders

class DataSubscriptions(models.Model):
	
   plan_provider = models.ForeignKey(NetworkProviders, on_delete=models.SET_NULL, blank=True, null=True)
   plan_name = models.CharField(max_length=100, blank=True, null=True)
   plan_code = models.CharField(max_length=100)
   plan_price = models.DecimalField(max_digits=10, decimal_places=2)
   duration = models.CharField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @transaction.atomic()
   def insert(uid,provider,plan_name,plan_code,plan_price,duration):

      try:
         print(provider.title(),provider.title())
         NetworkProviders.objects.get(isp_name=""+provider.title())
         datasub = DataSubscriptions(plan_provider=NetworkProviders.objects.get(public_id = uid,isp_name=""+provider.title()),plan_name=plan_name,plan_code=plan_code,plan_price=plan_price,duration=duration)
         datasub.save()
         return True
      except Exception as e:
         print(e)
         return False
   
   def getplanname(self,code):
 
      
      return DataSubscriptions.objects.only('plan_name').get(plan_code=code).plan_name



