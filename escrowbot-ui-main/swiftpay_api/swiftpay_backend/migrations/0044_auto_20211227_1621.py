# Generated by Django 3.2.9 on 2021-12-28 00:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0043_auto_20211227_0737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transactioncart',
            name='order_id',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(max_length=100),
        ),
    ]
