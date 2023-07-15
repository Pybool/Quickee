import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class BatchProcStatus(models.Model):
	
   weekly = models.BooleanField(null=True)
   bi_monthly = models.BooleanField(null=True)
   monthly = models.BooleanField(null=True)
   def recordBatchProcStatus(periodicity,status, null=True):

       if periodicity == 1000: 
          BatchProcStatus.objects.filter(id=1).update(weekly=status)
       if periodicity == 2000: 
          BatchProcStatus.objects.filter(id=1).update(monthly=status)
       if periodicity == 3000: 
          BatchProcStatus.objects.filter(id=1).update(bi_monthly=status)
       
       
   def returnBatchProcStatus(periodicity):
       
       if periodicity == 'weekly': 
           return BatchProcStatus.objects.only(periodicity).get(id=1).weekly
       if periodicity == 'monthly': 
           return BatchProcStatus.objects.only(periodicity).get(id=1).monthly
       if periodicity == 'bi_monthly': 
           return BatchProcStatus.objects.only(periodicity).get(id=1).bi_monthly
   

   def resetBatchProcStatus(status):
        BatchProcStatus.objects.filter(id=1).update(weekly=status,monthly=status,bi_monthly=status)
       