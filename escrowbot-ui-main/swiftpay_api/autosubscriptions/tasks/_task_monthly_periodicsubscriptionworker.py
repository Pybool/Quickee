import asyncio, time
import random, celery, json
from celery import Celery
from swiftpay_api.celery import app
from asgiref.sync import sync_to_async
from autosubscriptions.tasks.__base__ import BatchDispenser,batchDataGather
from swiftpay_backend.models.batch_proc_status_model import BatchProcStatus


class MonthlyCheckDueSubscriptions(celery.Task):
    MONTHLY_SUBSCRIPTION_BATCH = {}
    def run(*args, **kwargs):
        def main():
            getAllMonthly()
        def getAllMonthly():
            periodicity = args[0]
            aggr_monthly = batchDataGather(periodicity)
            MonthlyCheckDueSubscriptions.MONTHLY_SUBSCRIPTION_BATCH = aggr_monthly
            BatchDispenser(MonthlyCheckDueSubscriptions.MONTHLY_SUBSCRIPTION_BATCH,periodicity)
        main()

@app.task(name='_task_monthly_periodicsubscriptionworker.checkDueMonthlySubscriptions')
def checkDueMonthlySubscriptions(periodicity):
    status = BatchProcStatus.returnBatchProcStatus('monthly')
    print(f"((((((((((((((({status}))))))))))))))))")
    if status == True or status == None: return MonthlyCheckDueSubscriptions.run(periodicity)
