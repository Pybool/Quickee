# Generated by Django 3.2.9 on 2022-04-03 01:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0085_auto_20220402_1531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airtimeperiodicsubscriptions',
            name='timestamp_created',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='cableperiodicsubscriptions',
            name='timestamp_created',
            field=models.FloatField(blank=True, default=1648949770.3972273, null=True),
        ),
        migrations.AlterField(
            model_name='dataperiodicsubscriptions',
            name='timestamp_created',
            field=models.FloatField(blank=True, default=1648949770.3972273, null=True),
        ),
        migrations.AlterField(
            model_name='electricityperiodicsubscriptions',
            name='timestamp_created',
            field=models.FloatField(blank=True, default=1648949770.3972273, null=True),
        ),
    ]
