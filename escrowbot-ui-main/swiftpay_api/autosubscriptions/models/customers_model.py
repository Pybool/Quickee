from django.db import models

class Customers(models.Model):
	
   owner = models.CharField(max_length=100, blank=True, null=True)
   firstname = models.CharField(max_length=100, blank=True, null=True)
   lastname = models.CharField(max_length=100, blank=True, null=True)
   email = models.CharField(max_length=100, blank=True, null=True)
   phonenumber = models.CharField(max_length=1000, blank=True, null=True)
   iuc_number = models.CharField(max_length=100, blank=True, null=True)
   meter_number = models.CharField(max_length=100, blank=True, null=True)
   paystack_customer_id = models.CharField(max_length=1000, blank=True, null=True)
