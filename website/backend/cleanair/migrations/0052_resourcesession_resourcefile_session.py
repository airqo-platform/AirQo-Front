# Generated by Django 5.0.7 on 2024-08-12 06:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0051_remove_forumresource_resource_file_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourceSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_title', models.CharField(max_length=120)),
                ('forum_event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='forum_resource_sessions', to='cleanair.forumevent')),
            ],
        ),
        migrations.AddField(
            model_name='resourcefile',
            name='session',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='resource_files', to='cleanair.resourcesession'),
        ),
    ]