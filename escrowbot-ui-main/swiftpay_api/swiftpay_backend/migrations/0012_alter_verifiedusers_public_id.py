# Generated by Django 3.2.9 on 2021-12-25 18:53

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0011_alter_verifiedusers_public_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('fd240802-2e6f-4d35-a9e0-a1299a0e7916'), max_length=100),
        ),
    ]