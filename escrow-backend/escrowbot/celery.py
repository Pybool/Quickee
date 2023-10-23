from datetime import timedelta
import os
from celery import Celery
# from tasks.check_payment import check_payment_confirmation
#set the default django settings to celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'escrowbot.settings')
app = Celery('escrowbot')
app.config_from_object('django.conf:settings', namespace='CELERY')
# app.task(check_payment_confirmation)
app.autodiscover_tasks()
#message broker configurations
BASE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')
app.conf.broker_url = BASE_REDIS_URL
#creating a celery beat scheduler to start the tasks
app.conf.beat_scheduler = 'django_celery_beat.schedulers.DatabaseScheduler'

app.conf.beat_schedule = {
    'check-payment-confirmation': {
        'task': 'escrowbot.tasks',
        'schedule': timedelta(seconds=600),
    },
    
}

app.conf.timezone = 'UTC'

# celery -A escrowbot worker --loglevel=info -P eventlet

# python -m http.server -b 127.0.0.42 8080