# Generated by Django 3.2.9 on 2021-12-31 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0047_alter_electricitydiscos_disco_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactioncart',
            name='cart_reference',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]