# Generated by Django 3.2.9 on 2023-02-09 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AirtimePeriodicSubscriptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_public_id', models.CharField(max_length=100)),
                ('subscription_id', models.CharField(max_length=100, unique=True)),
                ('subscription_type', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_status', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recipient', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_label', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('subscription_volume', models.CharField(blank=True, max_length=100, null=True)),
                ('service_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recurrence', models.CharField(blank=True, max_length=100, null=True)),
                ('last_subscription', models.FloatField(blank=True, null=True)),
                ('next_subscription', models.FloatField(blank=True, null=True)),
                ('mode', models.CharField(blank=True, max_length=100, null=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('periodicity', models.FloatField(blank=True, null=True)),
                ('timestamp_created', models.FloatField(blank=True, null=True)),
                ('timestamp_lastedit', models.FloatField(blank=True, null=True)),
                ('payment_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='CablePeriodicSubscriptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_public_id', models.CharField(max_length=100)),
                ('subscription_id', models.CharField(max_length=100, unique=True)),
                ('subscription_type', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_status', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recipient', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_label', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_volume', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recurrence', models.CharField(blank=True, max_length=100, null=True)),
                ('service_code', models.CharField(blank=True, max_length=100, null=True)),
                ('service_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('unitprice', models.FloatField(blank=True, max_length=100, null=True)),
                ('last_subscription', models.FloatField(blank=True, null=True)),
                ('next_subscription', models.FloatField(blank=True, null=True)),
                ('mode', models.CharField(blank=True, max_length=100, null=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('periodicity', models.FloatField(blank=True, null=True)),
                ('timestamp_created', models.FloatField(blank=True, null=True)),
                ('timestamp_lastedit', models.FloatField(blank=True, null=True)),
                ('payment_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='DataPeriodicSubscriptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_public_id', models.CharField(max_length=100)),
                ('subscription_id', models.CharField(max_length=100, unique=True)),
                ('subscription_type', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_status', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recipient', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_label', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('subscription_volume', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recurrence', models.CharField(blank=True, max_length=100, null=True)),
                ('service_code', models.CharField(blank=True, max_length=100, null=True)),
                ('service_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('unitprice', models.FloatField(blank=True, max_length=100, null=True)),
                ('last_subscription', models.FloatField(blank=True, null=True)),
                ('next_subscription', models.FloatField(blank=True, null=True)),
                ('mode', models.CharField(blank=True, max_length=100, null=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('periodicity', models.FloatField(blank=True, null=True)),
                ('timestamp_created', models.FloatField(blank=True, null=True)),
                ('timestamp_lastedit', models.FloatField(blank=True, null=True)),
                ('payment_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ElectricityPeriodicSubscriptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_public_id', models.CharField(max_length=100)),
                ('subscription_id', models.CharField(max_length=100, unique=True)),
                ('subscription_type', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_status', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recipient', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_label', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_volume', models.CharField(blank=True, max_length=100, null=True)),
                ('subscription_recurrence', models.CharField(blank=True, max_length=100, null=True)),
                ('service_code', models.CharField(blank=True, max_length=100, null=True)),
                ('service_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('unitprice', models.FloatField(blank=True, max_length=100, null=True)),
                ('last_subscription', models.FloatField(blank=True, null=True)),
                ('next_subscription', models.FloatField(blank=True, null=True)),
                ('mode', models.CharField(blank=True, max_length=100, null=True)),
                ('api_provider', models.CharField(blank=True, max_length=100, null=True)),
                ('periodicity', models.FloatField(blank=True, null=True)),
                ('timestamp_created', models.FloatField(blank=True, null=True)),
                ('timestamp_lastedit', models.FloatField(blank=True, null=True)),
                ('payment_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Plans',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(blank=True, max_length=100, null=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('interval', models.CharField(blank=True, max_length=100, null=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, default=500.0, max_digits=10)),
                ('description', models.CharField(blank=True, max_length=1000, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Subscribers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(blank=True, max_length=100, null=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('interval', models.CharField(blank=True, max_length=100, null=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, default=500.0, max_digits=10)),
                ('description', models.CharField(blank=True, max_length=1000, null=True)),
            ],
        ),
    ]
