# Generated by Django 5.1.6 on 2025-03-25 03:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hola', '0004_post_created_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200)),
                ('imagen', models.ImageField(upload_to='imagenespopup/')),
                ('enlace', models.URLField(blank=True, null=True)),
                ('activo', models.BooleanField(default=True)),
            ],
        ),
    ]
