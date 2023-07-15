# Generated by Django 3.2.9 on 2022-01-07 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0065_transactioncart_failure_reason'),
    ]

    operations = [
        migrations.AddField(
            model_name='airtimepurchasehistory',
            name='timestamp',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='cablesubscriptionhistory',
            name='timestamp',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='datasubscriptionhistory',
            name='timestamp',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='electricitypurchasehistory',
            name='timestamp',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='transactioncart',
            name='timestamp',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
