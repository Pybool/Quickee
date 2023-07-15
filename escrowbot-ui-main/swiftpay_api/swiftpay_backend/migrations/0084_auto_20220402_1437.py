# Generated by Django 3.2.9 on 2022-04-02 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0083_auto_20220402_1315'),
    ]

    operations = [
        migrations.AddField(
            model_name='electricityperiodicsubscriptions',
            name='service_provider',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='electricityperiodicsubscriptions',
            name='unitprice',
            field=models.FloatField(blank=True, max_length=100, null=True),
        ),
    ]