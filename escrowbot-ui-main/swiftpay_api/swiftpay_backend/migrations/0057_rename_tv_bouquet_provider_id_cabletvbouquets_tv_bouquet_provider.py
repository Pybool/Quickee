# Generated by Django 3.2.9 on 2022-01-02 11:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0056_auto_20220102_0132'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cabletvbouquets',
            old_name='tv_bouquet_provider_id',
            new_name='tv_bouquet_provider',
        ),
    ]