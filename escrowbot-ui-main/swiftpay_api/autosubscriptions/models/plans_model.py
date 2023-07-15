from django.db import models

class Plans(models.Model):
	
   owner = models.CharField(max_length=100, blank=True, null=False,default='')
   category = models.CharField(max_length=100, blank=True, null=True)
   plan_code = models.CharField(max_length=100, blank=True, null=True)
   name = models.CharField(max_length=100, blank=True, null=True)
   interval = models.CharField(max_length=100, blank=True, null=True)
   amount = models.DecimalField( max_digits=10, decimal_places=2, blank=True, default=500.00)
   description = models.CharField(max_length=1000, blank=True, null=True)
   