# Generated by Django 3.2.9 on 2021-12-25 19:08

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0012_alter_verifiedusers_public_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='verifiedusers',
            name='password',
            field=models.CharField(default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('75f5c90b-f268-49ed-a9da-ec7dc9f867d7'), max_length=100),
        ),
    ]