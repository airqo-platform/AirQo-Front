# Generated by Django 5.0.2 on 2024-04-06 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cleanair', '0017_alter_person_biography'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='biography',
            field=models.TextField(blank=True),
        ),
    ]
