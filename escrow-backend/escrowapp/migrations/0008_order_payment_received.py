# Generated by Django 4.2.2 on 2023-07-17 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('escrowapp', '0007_vendorpaymentpool_bankname_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_received',
            field=models.BooleanField(default=False),
        ),
    ]
