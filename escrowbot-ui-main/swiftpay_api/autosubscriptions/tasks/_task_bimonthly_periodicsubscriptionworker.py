import asyncio, time
import random, celery, json
from celery import Celery
from swiftpay_api.celery import app
from asgiref.sync import sync_to_async
from autosubscriptions.tasks.__base__ import BatchDispenser,batchDataGather
from swiftpay_backend.models.batch_proc_status_model import BatchProcStatus

class BiMonthlyCheckDueSubscriptions(celery.Task):
    BIMONTHLY_SUBSCRIPTION_BATCH = {}
    def run(*args, **kwargs):
        def main():
            getAllBiMonthly()
        def getAllBiMonthly():
            periodicity = args[0]
            aggr_bimonthly = batchDataGather(periodicity)
            BiMonthlyCheckDueSubscriptions.BIMONTHLY_SUBSCRIPTION_BATCH = aggr_bimonthly
            BatchDispenser(BiMonthlyCheckDueSubscriptions.BIMONTHLY_SUBSCRIPTION_BATCH,periodicity)
        main()
    
@app.task(name='_task_bimonthly_periodicsubscriptionworker.checkDueBimonthlySubscriptions')
def checkDueBimonthlySubscriptions(periodicity):
    status = BatchProcStatus.returnBatchProcStatus('bi_monthly')
    if status == True or status == None: 
        return BiMonthlyCheckDueSubscriptions.run(periodicity)

