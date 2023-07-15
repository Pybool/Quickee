import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .plans_model import *
from .customers_model import *
from swiftpay_backend.models.electricity_discos_model import ElectricityDiscos

class ElectricityPeriodicSubscriptions(models.Model):

   customer = models.ForeignKey(Customers,blank=False, null=True,on_delete=models.CASCADE)
   plan = models.ForeignKey(Plans,blank=False, null=True,on_delete=models.CASCADE)
   disco = models.CharField(max_length=100, blank=True, null=True)
   amount = models.CharField(max_length=100, blank=True, null=True)
   last_subscription = models.FloatField(blank=True, null=True)
   next_subscription = models.FloatField(blank=True, null=True)
   created_at = models.FloatField(blank=True, null=True)
   updated_at = models.FloatField(blank=True, null=True)
   payment_status =  models.BooleanField(default=False)
      
   @transaction.atomic()
   def update(data):
      try:
         uid = data['uid']
         data = data['data']
         serviceprovider = data['service_provider']
         updatestatus = ElectricityPeriodicSubscriptions.objects\
         .filter(user_public_id=uid,subscription_label=data['label']+'@'+uid)\
         .update(subscription_recipient = data['meternumber'],
                  service_provider=serviceprovider,subscription_volume = data['amount'],
                  mode = data['mode'], unitprice= data['amount'], api_provider = 'vtung',
                  timestamp_lastedit=time.time(),periodicity=data['powerperiodic_select']
                )
         print("Update status ==> ",updatestatus)
         return (True,data['amount'],serviceprovider)
      except Exception as e:
         print("Update error ",e)
         return False,None
   
   @transaction.atomic()
   def update_last_subscription(s_uid,timestamp):
      return ElectricityPeriodicSubscriptions.objects.filter(subscription_id=s_uid).update(last_subscription = timestamp)