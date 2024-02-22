# Generated by Django 4.2.5 on 2024-02-07 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0004_cleanairresource_resource_authors'),
    ]

    operations = [
        migrations.AddField(
            model_name='cleanairresource',
            name='author_title_en',
            field=models.CharField(blank=True, default='Created By', max_length=40, null=True),
        ),
        migrations.AddField(
            model_name='cleanairresource',
            name='author_title_fr',
            field=models.CharField(blank=True, default='Created By', max_length=40, null=True),
        ),
        migrations.AddField(
            model_name='cleanairresource',
            name='resource_authors_en',
            field=models.CharField(default='AirQo', max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='cleanairresource',
            name='resource_authors_fr',
            field=models.CharField(default='AirQo', max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='cleanairresource',
            name='resource_title_en',
            field=models.CharField(max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='cleanairresource',
            name='resource_title_fr',
            field=models.CharField(max_length=120, null=True),
        ),
    ]