# Generated by Django 3.2.9 on 2021-12-27 06:33

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0025_auto_20211226_2232'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AirtimePurchaseHistory',
        ),
        migrations.DeleteModel(
            name='CableSubscriptionHistory',
        ),
        migrations.DeleteModel(
            name='DataSubscriptionHistory',
        ),
        migrations.DeleteModel(
            name='ElectricityPurchaseHistory',
        ),
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('383f1623-d90c-4db3-ba78-eaa55f84d9ff'), max_length=100),
        ),
    ]