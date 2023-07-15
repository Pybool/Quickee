import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .cabletv_providers_model import CableTvProviders

class CableTvBouquets(models.Model):
   tv_bouquet_provider = models.ForeignKey(CableTvProviders, on_delete=models.SET_NULL, blank=True, null=True)
   tv_bouquet_name = models.CharField(max_length=100, blank=True, null=True)
   tv_bouquet_price = models.DecimalField(max_digits=10, decimal_places=2)
   tv_bouquet_variation_id = models.CharField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @transaction.atomic()
   def insert(uid,provider,plan_name,plan_code,plan_price):

      try:
         CableTvProviders.objects.get(cabletv_name=""+provider.title())
         bouquets = CableTvBouquets(tv_bouquet_provider=CableTvProviders.objects.get(public_id = uid,cabletv_name=""+provider.title()),tv_bouquet_name=plan_name,tv_bouquet_variation_id=plan_code,tv_bouquet_price=plan_price)
         bouquets.save()
         return True
      except Exception as e:
         return False
   
   def returnapi_tv_bouquetname(self,servicename):
       return CableTvBouquets.objects.only('tv_bouquet_name').get(tv_bouquet_variation_id=servicename).tv_bouquet_name

