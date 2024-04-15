# Generated by Django 5.0.2 on 2024-04-06 15:19

import backend.cleanair.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0015_forumevent_introduction_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='forumevent',
            name='title',
            field=models.CharField(default='CLEAN-Air Forum', max_length=100),
        ),
        migrations.AlterField(
            model_name='partner',
            name='category',
            field=models.CharField(choices=[('Funding Partner', 'FUNDING_PARTNER'), ('Host Partner', 'HOST_PARTNER'), (
                'Co-Convening Partner', 'CO_CONVENING_PARTNER')], default=backend.cleanair.models.PartnerCategoryChoices.FUNDING_PARTNER.name, max_length=50),
        ),
        migrations.AlterField(
            model_name='person',
            name='category',
            field=models.CharField(choices=[('Speaker', 'SPEAKER'), ('Committee Member', 'COMMITTEE_MEMBER')],
                                   default=backend.cleanair.models.CategoryChoices.SPEAKER.name, max_length=50),
        ),
    ]