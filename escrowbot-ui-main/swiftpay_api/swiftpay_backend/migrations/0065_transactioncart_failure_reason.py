# Generated by Django 3.2.9 on 2022-01-05 22:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0064_alter_electricitypurchasehistory_amount_charged'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactioncart',
            name='failure_reason',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
