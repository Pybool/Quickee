import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class ApiProviders(models.Model):
	
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   @transaction.atomic()
   def insert(api_provider):
      try:
         apiproviders = ApiProviders(api_provider=api_provider)
         apiproviders.save()
         return True
      except Exception as e:
         return False
