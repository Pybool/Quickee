# Generated by Django 3.2.9 on 2021-12-28 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0045_electricitydiscos'),
    ]

    operations = [
        migrations.AddField(
            model_name='electricitydiscos',
            name='disco_code',
            field=models.CharField(default='null', max_length=100),
            preserve_default=False,
        ),
    ]
