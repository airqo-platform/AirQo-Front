# Generated by Django 5.0.7 on 2024-08-06 10:44

import django.db.models.deletion
import django_quill.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0050_forumresource_resource_file_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='forumresource',
            name='resource_file',
        ),
        migrations.RemoveField(
            model_name='forumresource',
            name='resource_summary',
        ),
        migrations.CreateModel(
            name='ResourceFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('resource_summary', django_quill.fields.QuillField(blank=True, null=True)),
                ('file', models.FileField(upload_to='cleanair/resources/')),
                ('resource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resource_files', to='cleanair.forumresource')),
            ],
        ),
    ]
