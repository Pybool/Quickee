# Generated by Django 4.2.2 on 2023-06-17 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='accountno',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='users',
            name='bankname',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='users',
            name='country',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='users',
            name='firstname',
            field=models.CharField(default='Name N/A', max_length=255),
        ),
        migrations.AddField(
            model_name='users',
            name='othername',
            field=models.CharField(default='Name N/A', max_length=255),
        ),
        migrations.AddField(
            model_name='users',
            name='regdate',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='surname',
            field=models.CharField(default='Name N/A', max_length=255),
        ),
    ]