import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .plans_model import *
from .customers_model import *
from swiftpay_backend.models.cabletv_bouquet_model import CableTvBouquets

class CablePeriodicSubscriptions(models.Model):

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
         parameters = data['bouquet'].split("$")
         price = parameters[1]
         bouquet = parameters[0]
         apiprovider = parameters[2]
         
         bouquet = CableTvBouquets.objects.get(tv_bouquet_variation_id = bouquet).tv_bouquet_name
         print("-----------------> ",bouquet)
         serviceprovider = data['service_provider'].split(",")[0].title()
         updatestatus = CablePeriodicSubscriptions.objects\
         .filter(user_public_id=uid,subscription_label=data['label']+'@'+uid)\
         .update(subscription_recipient = data['iucnumber'],
                  service_provider=serviceprovider,subscription_volume = bouquet,
                  mode = data['mode'], unitprice= price, api_provider = apiprovider,
                  timestamp_lastedit = time.time(),periodicity=data['cableperiodic_select']
                )
         return (True,bouquet,serviceprovider)
      except Exception as e:
         return False,None
      
   
   @transaction.atomic()
   def update_last_subscription(s_uid,timestamp):
      return CablePeriodicSubscriptions.objects.filter(subscription_id=s_uid).update(last_subscription = timestamp)