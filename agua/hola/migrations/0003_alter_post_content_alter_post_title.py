# Generated by Django 5.1.6 on 2025-03-20 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hola', '0002_announcement'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='content',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=200),
        ),
    ]
