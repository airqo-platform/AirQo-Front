# Generated by Django 5.0.2 on 2024-05-02 01:26

import django_quill.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0041_forumevent_partners_text_section_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='forumevent',
            old_name='travel_logistics',
            new_name='travel_logistics_vaccination_details',
        ),
        migrations.AddField(
            model_name='forumevent',
            name='travel_logistics_visa_details',
            field=django_quill.fields.QuillField(blank=True, null=True),
        ),
    ]