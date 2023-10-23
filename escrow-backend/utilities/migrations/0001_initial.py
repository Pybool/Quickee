# Generated by Django 4.2.2 on 2023-07-01 00:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Airtime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('network_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('discount', models.CharField(blank=True, max_length=100, null=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='NetworkProviders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.CharField(max_length=100, unique=True)),
                ('isp_name', models.CharField(max_length=100, unique=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='DataSubscriptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_name', models.CharField(blank=True, max_length=100, null=True)),
                ('plan_code', models.CharField(max_length=100)),
                ('plan_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('duration', models.CharField(blank=True, max_length=100, null=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('plan_provider', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='utilities.networkproviders')),
            ],
        ),
    ]