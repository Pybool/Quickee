# Generated by Django 3.2.9 on 2023-02-12 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autosubscriptions', '0007_auto_20230212_1557'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plans',
            name='owner',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
