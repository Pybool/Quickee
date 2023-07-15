# Generated by Django 3.2.9 on 2021-12-27 06:30

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0021_alter_verifiedusers_public_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transactioncart',
            old_name='amount',
            new_name='amounts',
        ),
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('615f042e-c93a-4017-8523-34ee60b40975'), max_length=100),
        ),
    ]