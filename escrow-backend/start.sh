#!/bin/bash

# Start Gunicorn
gunicorn --bind 0.0.0.0:8000 escrowbot.wsgi &

# Start Celery worker
celery -A escrowbot worker --loglevel=info &

# Start Celery Beat
celery -A escrowbot beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info
