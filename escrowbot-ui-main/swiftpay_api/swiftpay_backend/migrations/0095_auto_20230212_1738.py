# Generated by Django 3.2.9 on 2023-02-12 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0094_auto_20230209_2246'),
    ]

    operations = [
        migrations.AddField(
            model_name='verifiedusers',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='verifiedusers',
            name='is_root',
            field=models.BooleanField(default=False),
        ),
    ]
