# Generated by Django 5.1.6 on 2025-03-20 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hola', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Announcement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
            ],
        ),
    ]
