from datetime import timedelta
import os
from celery import Celery
PERIODICITY = {'WEEKLY':1000,'BI-MONTHLY':2000,'MONTHLY':3000}
#set the default django settings to celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swiftpay_api.settings')
app = Celery('swiftpay_api')
app.config_from_object('django.conf:settings', namespace='CELERY')
# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
#message broker configurations
BASE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')
app.conf.broker_url = BASE_REDIS_URL
#creating a celery beat scheduler to start the tasks
app.conf.beat_scheduler = 'django_celery_beat.schedulers.DatabaseScheduler'

app.conf.beat_schedule = {
    'check-due-weekly-periodic-subscriptions': {
        'task': '_task_weekly_periodicsubscriptionworker.checkDueWeeklySubscriptions',
        'schedule': timedelta(seconds=60),
        'args': (PERIODICITY['WEEKLY'],)
    },
    'check-due-bi-monthly-periodic-subscriptions': {
        'task': '_task_bimonthly_periodicsubscriptionworker.checkDueBimonthlySubscriptions',
        'schedule': timedelta(seconds=360),
        'args': (PERIODICITY['BI-MONTHLY'],)
    },
    'check-due-monthly-periodic-subscriptions': {
        'task': '_task_monthly_periodicsubscriptionworker.checkDueMonthlySubscriptions',
        'schedule': timedelta(seconds=540),
        'args': (PERIODICITY['MONTHLY'],)
    },
}

app.conf.timezone = 'UTC'

# celery --app=swiftpay_api worker -l INFO

# celery -A swiftpay_api beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler