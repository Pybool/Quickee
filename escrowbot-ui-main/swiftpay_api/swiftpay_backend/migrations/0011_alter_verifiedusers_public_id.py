# Generated by Django 3.2.9 on 2021-12-25 09:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0010_auto_20211225_0151'),
    ]

    operations = [
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('6d91fab7-e42b-4059-9daf-6c70813cfd18'), max_length=100),
        ),
    ]