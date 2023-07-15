# Generated by Django 3.2.9 on 2021-12-27 06:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('swiftpay_backend', '0034_auto_20211226_2249'),
    ]

    operations = [
        migrations.CreateModel(
            name='AirtimePurchaseHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buyer_public_id', models.CharField(max_length=100, unique=True)),
                ('network_provider', models.CharField(max_length=100, unique=True)),
                ('phone_number', models.CharField(max_length=100, unique=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='CableSubscriptionHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buyer_public_id', models.CharField(max_length=100, unique=True)),
                ('cable_provider', models.CharField(max_length=100, unique=True)),
                ('iuc_number', models.IntegerField(unique=True)),
                ('bouquet', models.CharField(max_length=100, unique=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='DataSubscriptionHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buyer_public_id', models.CharField(max_length=100, unique=True)),
                ('network_provider', models.CharField(max_length=100, unique=True)),
                ('phone_number', models.CharField(max_length=100, unique=True)),
                ('plan', models.CharField(max_length=100, unique=True)),
                ('variation_id', models.CharField(max_length=100, unique=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='ElectricityPurchaseHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buyer_public_id', models.CharField(max_length=100, unique=True)),
                ('disco', models.CharField(max_length=100, unique=True)),
                ('meter_number', models.IntegerField(unique=True)),
                ('meter_type', models.CharField(max_length=100, unique=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='TransactionCart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buyer_public_id', models.CharField(max_length=100, unique=True)),
                ('order_id', models.CharField(max_length=100, unique=True)),
                ('service', models.CharField(blank=True, max_length=100, null=True)),
                ('provider', models.CharField(blank=True, max_length=100, null=True)),
                ('recipient', models.CharField(blank=True, max_length=100, null=True)),
                ('servicename', models.CharField(blank=True, max_length=100, null=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10)),
                ('payment_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.AlterField(
            model_name='verifiedusers',
            name='public_id',
            field=models.CharField(default=uuid.UUID('7a78a8a2-ebcf-4dee-aa86-b72c721aca8b'), max_length=100),
        ),
    ]