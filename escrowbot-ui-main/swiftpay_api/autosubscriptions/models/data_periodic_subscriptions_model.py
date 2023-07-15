import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .plans_model import *
from .customers_model import *
from swiftpay_backend.models.datasubscription_model import DataSubscriptions

class DataPeriodicSubscriptions(models.Model):

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
         parameters = data['dataplan'].split("$")
         price = parameters[1]
         dataplan = parameters[0]
         apiprovider = parameters[2]
         
         planGB = DataSubscriptions.objects.get(plan_code = dataplan).plan_name
         print("-----------------> ",planGB)
         serviceprovider = data['service_provider'].split(",")[0].title()
         updatestatus = DataPeriodicSubscriptions.objects\
         .filter(user_public_id=uid,subscription_label=data['label']+'@'+uid)\
         .update(subscription_recipient = data['phonenumber'],
                  service_provider=serviceprovider,subscription_volume = planGB,
                  mode = data['mode'], unitprice= price, api_provider = apiprovider,
                  timestamp_lastedit = time.time(),periodicity=data['dataperiodic_select']
                )
         print("Upadate status ==> ",updatestatus)
         return (True,planGB,serviceprovider)
      except Exception as e:
         print("Update error ",e)
         return False,None
   
   @transaction.atomic()
   def update_last_subscription(s_uid,timestamp):
      return DataPeriodicSubscriptions.objects.filter(subscription_id=s_uid).update(last_subscription = timestamp)