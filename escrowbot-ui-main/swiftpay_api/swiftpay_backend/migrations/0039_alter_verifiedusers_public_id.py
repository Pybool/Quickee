# Generated by Django 3.2.9 on 2021-12-27 14:59

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0038_alter_verifiedusers_public_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('b328cb78-7356-470c-aafc-142bbb989676'), max_length=100),
        ),
    ]