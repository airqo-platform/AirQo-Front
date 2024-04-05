# Generated by Django 5.0.2 on 2024-04-05 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0011_alter_event_event_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='inquiry',
            name='inquiry_en',
            field=models.CharField(max_length=80, null=True),
        ),
        migrations.AddField(
            model_name='inquiry',
            name='inquiry_fr',
            field=models.CharField(max_length=80, null=True),
        ),
        migrations.AddField(
            model_name='inquiry',
            name='role_en',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='inquiry',
            name='role_fr',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
