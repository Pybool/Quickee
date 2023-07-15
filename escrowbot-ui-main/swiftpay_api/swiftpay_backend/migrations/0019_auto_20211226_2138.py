# Generated by Django 3.2.9 on 2021-12-27 05:38

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0018_auto_20211226_2054'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactioncart',
            name='payment_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('5882f6cb-105a-42d2-81a6-ef86946b7c45'), max_length=100),
        ),
    ]
