import asyncio, time
import random, celery, json
from celery import Celery
from swiftpay_api.celery import app
from asgiref.sync import sync_to_async
from autosubscriptions.tasks.__base__ import BatchDispenser,batchDataGather
from swiftpay_backend.models.batch_proc_status_model import BatchProcStatus

class WeeklyCheckDueSubscriptions():
    WEEKLY_SUBSCRIPTION_BATCH = {}
    def run(*args, **kwargs):
        def main():
            getAllWeekly()
        def getAllWeekly():
            print("===========> Batch empty, recreating new batch ", WeeklyCheckDueSubscriptions.WEEKLY_SUBSCRIPTION_BATCH)
            periodicity = args[0]
            aggr_weekly = batchDataGather(periodicity)
            WeeklyCheckDueSubscriptions.WEEKLY_SUBSCRIPTION_BATCH = aggr_weekly
            BatchDispenser(WeeklyCheckDueSubscriptions.WEEKLY_SUBSCRIPTION_BATCH,periodicity)     
        main()

@app.task(name='_task_weekly_periodicsubscriptionworker.checkDueWeeklySubscriptions')
def checkDueWeeklySubscriptions(periodicity):
    status = BatchProcStatus.returnBatchProcStatus('weekly')
    print(f"((((((((((((((({status}))))))))))))))))"+str(periodicity))
    if status == True or status == None: return WeeklyCheckDueSubscriptions.run(periodicity)
    
