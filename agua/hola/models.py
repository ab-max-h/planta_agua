from django.db import models


class Galeria(models.Model):
    TIPO_CONTENIDO = [
        ('imagen', 'Imagen'),
        ('video', 'Video'),
    ]

    titulo = models.CharField(max_length=200)
    contenido = models.FileField(upload_to='galeria/')  # Archivos subidos (imágenes o videos)
    tipo = models.CharField(max_length=10, choices=TIPO_CONTENIDO)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    enlace_externo = models.URLField(blank=True, null=True)  # Para YouTube, Vimeo, etc.

    def __str__(self):
        return self.titulo

    def es_video(self):
        return self.tipo == 'video'


class Evento(models.Model):
    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='imagenespopup/')
    enlace = models.URLField(blank=True, null=True)
    activo = models.BooleanField(default=True)  # Para activar/desactivar el popup

    def __str__(self):
        return self.titulo


class Announcement(models.Model):  # Asegúrate de que este modelo exista
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

# Modelo para la bitácora de la planta de tratamiento de aguas residuales
class Bitacora(models.Model):
    fecha_hora = models.DateTimeField(auto_now_add=True)
    numero_muestra = models.CharField(max_length=50)
    nivel_agua = models.FloatField()
    ph = models.FloatField()
    toc = models.FloatField(help_text="Carbono Orgánico Total (mg/L)")
    dqo = models.FloatField(help_text="Demanda Química de Oxígeno (mg/L)")
    r = models.FloatField()
    ssed = models.FloatField()
    ud_ph = models.FloatField()
    temperatura = models.FloatField(help_text="Temperatura en °C")
    observaciones = models.TextField(blank=True, null=True)
    supervisor = models.CharField(max_length=100)

    def __str__(self):
        return f"Muestra {self.numero_muestra} - {self.fecha_hora}"

# models.py (corrección)
class Portada(models.Model):
    imagen = models.ImageField(upload_to='portadas/')
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Nombre correcto

    def __str__(self):
        return f"Portada {self.fecha_creacion}"  # Usa fecha_creacion (con "n")