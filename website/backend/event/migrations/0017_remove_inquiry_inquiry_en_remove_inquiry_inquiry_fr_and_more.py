# Generated by Django 4.2.5 on 2024-02-06 17:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0016_remove_inquiry_role_en_remove_inquiry_role_fr_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inquiry',
            name='inquiry_en',
        ),
        migrations.RemoveField(
            model_name='inquiry',
            name='inquiry_fr',
        ),
        migrations.RemoveField(
            model_name='partnerlogo',
            name='name_en',
        ),
        migrations.RemoveField(
            model_name='partnerlogo',
            name='name_fr',
        ),
        migrations.RemoveField(
            model_name='program',
            name='program_details_en',
        ),
        migrations.RemoveField(
            model_name='program',
            name='program_details_fr',
        ),
        migrations.RemoveField(
            model_name='session',
            name='session_details_en',
        ),
        migrations.RemoveField(
            model_name='session',
            name='session_details_fr',
        ),
        migrations.RemoveField(
            model_name='session',
            name='session_title_en',
        ),
        migrations.RemoveField(
            model_name='session',
            name='session_title_fr',
        ),
        migrations.RemoveField(
            model_name='session',
            name='venue_en',
        ),
        migrations.RemoveField(
            model_name='session',
            name='venue_fr',
        ),
    ]
