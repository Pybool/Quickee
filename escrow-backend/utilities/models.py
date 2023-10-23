import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class NetworkProviders(models.Model):
	
   public_id = models.CharField(max_length=100,unique=True)
   isp_name = models.CharField(max_length=100,unique=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)


class Airtime(models.Model):
	
   network_provider = models.CharField(max_length=100, blank=True, null=True)
   discount = models.CharField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
class DataSubscriptions(models.Model):
	
   plan_provider = models.ForeignKey(NetworkProviders, on_delete=models.SET_NULL, blank=True, null=True)
   plan_name = models.CharField(max_length=100, blank=True, null=True)
   plan_code = models.CharField(max_length=100)
   plan_price = models.DecimalField(max_digits=10, decimal_places=2)
   duration = models.CharField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   def getplanname(self,code):
      return DataSubscriptions.objects.only('plan_name').get(plan_code=code).plan_name
   
   
class AirtimeDataTransactionHistory(models.Model):
	
   phone_number = models.CharField(max_length=100, blank=True, null=True)
   _type = models.CharField(max_length=100, blank=True, null=True)
   transaction = models.JSONField(default={})
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   created_at = models.DateTimeField(auto_now_add=True)
   
class PendingPayments(models.Model):
	
   _type = models.CharField(max_length=100, blank=True, null=True)
   phone = models.CharField(max_length=100, blank=True, null=True)
   service_request = models.JSONField(default={})
   order_ref = models.CharField(max_length=200, blank=True, null=True)
   created_at = models.DateTimeField(auto_now_add=True)
   
class CableTvProviders(models.Model):
	
   public_id = models.CharField(max_length=100,unique=True)
   cabletv_name = models.CharField(max_length=100,unique=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   

class CableTvBouquets(models.Model):
   bouquet_provider = models.ForeignKey(CableTvProviders, on_delete=models.SET_NULL, blank=True, null=True)
   bouquet_name = models.CharField(max_length=100, blank=True, null=True)
   bouquet_price = models.DecimalField(max_digits=10, decimal_places=2)
   bouquet_code = models.CharField(max_length=100, blank=True, null=True)
   api_provider = models.CharField(max_length=100, blank=True, null=True)
         