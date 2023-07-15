import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from .user_model import VerifiedUsers

class RegisteredTvSmartCards(models.Model):
	 
   iuc_number = models.CharField(max_length=100, blank=True, null=True)
   public_id = models.ForeignKey(VerifiedUsers, on_delete=models.SET_NULL, blank=True, null=True)
	
   def __str__(self):
	   return self.iuc_number

