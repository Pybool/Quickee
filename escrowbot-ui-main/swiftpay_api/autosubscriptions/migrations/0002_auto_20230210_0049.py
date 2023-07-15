# Generated by Django 3.2.9 on 2023-02-09 23:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autosubscriptions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstname', models.CharField(blank=True, max_length=100, null=True)),
                ('lastname', models.CharField(blank=True, max_length=100, null=True)),
                ('email', models.CharField(blank=True, max_length=100, null=True)),
                ('phonenumber', models.CharField(blank=True, max_length=1000, null=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Subscribers',
        ),
    ]
