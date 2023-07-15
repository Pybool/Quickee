import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .plans_model import *
from .customers_model import *

class AirtimePeriodicSubscriptions(models.Model):

   customer = models.ForeignKey(Customers,blank=False, null=True,on_delete=models.CASCADE)
   plan = models.ForeignKey(Plans,blank=False, null=True,on_delete=models.CASCADE)
   network = models.CharField(max_length=100, blank=True, null=True)
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
         updatestatus = AirtimePeriodicSubscriptions.objects\
         .filter(user_public_id=uid,subscription_label=data['label']+'@'+uid)\
         .update(subscription_recipient = data['phonenumber'],
                  service_provider=data['service_provider'],subscription_label = data['label'],
                  subscription_volume = data['amount'],mode = data['mode'],timestamp_lastedit=time.time(),
                  periodicity=float(data['airtimeperiodic_select'])
                )
         return True,data['service_provider']
      except Exception as e:
         return False,None
   
   def returnBatchProcStatus(periodicity,id):
       
       if periodicity == 'weekly': 
           return AirtimePeriodicSubscriptions.objects.only('payment_status').get(id=id).payment_status
   
   @transaction.atomic()
   def update_last_subscription(s_uid,timestamp):
      return AirtimePeriodicSubscriptions.objects.filter(subscription_id=s_uid).update(last_subscription = timestamp)
