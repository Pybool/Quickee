# Generated by Django 3.2.9 on 2022-04-11 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0090_auto_20220408_1656'),
    ]

    operations = [
        migrations.AddField(
            model_name='dataperiodicsubscriptions',
            name='subscription_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
