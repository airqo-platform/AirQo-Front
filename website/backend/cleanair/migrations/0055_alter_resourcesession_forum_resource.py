# Generated by Django 5.0.7 on 2024-08-12 07:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0054_alter_resourcefile_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resourcesession',
            name='forum_resource',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='resource_sessions', to='cleanair.forumresource'),
        ),
    ]
