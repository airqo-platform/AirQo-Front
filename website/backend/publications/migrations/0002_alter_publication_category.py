# Generated by Django 4.1.1 on 2023-03-01 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='category',
            field=models.CharField(blank=True, choices=[('research', 'Research'), ('technical', 'Technical'), ('policy', 'Policy'), ('guide', 'Guide'), ('manual', 'Manual')], default='research', max_length=40, null=True),
        ),
    ]
