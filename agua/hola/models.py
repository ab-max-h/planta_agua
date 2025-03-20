from django.db import models
from django.db import models
from django.db import models

class Announcement(models.Model):  # Asegúrate de que este modelo exista
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        return self.title


class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

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
