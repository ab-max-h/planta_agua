from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class Bitacora(models.Model):
    fecha = models.DateField(
        primary_key=True,
        verbose_name="Fecha",
        unique=True,
        null=False,
        blank=False,
        help_text="Formato: YYYY-MM-DD"
    )
    vol_g = models.FloatField(verbose_name="Vol. G.")
    vol_agregado_m3 = models.FloatField(verbose_name="Vol. Agregado (m3)")
    v_total_m3 = models.FloatField(verbose_name="V total m3")

    def __str__(self):
        return f"Registro del {self.fecha.strftime('%Y-%m-%d')}"

    def clean(self):
        """Validaciones lógicas sin verificar formato"""
        if not self.fecha:
            raise ValidationError("La fecha es obligatoria.")
        if self.fecha > timezone.now().date():
            raise ValidationError("No se permiten fechas futuras.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-fecha']
        verbose_name = "Registro Diario de Bitácora"
        verbose_name_plural = "Registros Diarios de Bitácora"


class Galeria(models.Model):
    TIPO_CONTENIDO = [
        ('imagen', 'Imagen'),
        ('video', 'Video'),
    ]

    titulo = models.CharField(max_length=200)
    contenido = models.FileField(upload_to='galeria/')
    tipo = models.CharField(max_length=10, choices=TIPO_CONTENIDO)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    enlace_externo = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.titulo


class Evento(models.Model):
    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='imagenespopup/')
    enlace = models.URLField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        return self.title


class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Portada(models.Model):
    imagen = models.ImageField(upload_to='portadas/')
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Portada creada el {self.fecha_creacion.strftime('%Y-%m-%d')}"