# Generated by Django 4.2.2 on 2023-06-22 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_users_transaction_pin_users_transaction_pin_enabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='otp',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='otp_timestamp',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
