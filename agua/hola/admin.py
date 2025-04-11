from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from .models import Bitacora
from . import  models
from django_summernote.admin import SummernoteModelAdmin
from .models import Post
from .models import Announcement
from django.contrib import admin
from .models import Evento
from .models import Portada
from django.utils.safestring import mark_safe
from django.contrib import admin
from django.utils.safestring import mark_safe  # ¡Importa esto!
from .models import Portada

from django.contrib import admin
from .models import Galeria
from django.utils.safestring import mark_safe

@admin.register(Galeria)
class GaleriaAdmin(admin.ModelAdmin):
    list_display = ['preview', 'titulo', 'tipo', 'activo']
    list_editable = ['activo']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.tipo == 'imagen':
            return mark_safe(f'<img src="{obj.contenido.url}" width="150" />')
        else:
            return "🎥 Video: " + obj.titulo
    preview.short_description = "Vista Previa"

@admin.register(Portada)
class PortadaAdmin(admin.ModelAdmin):
    list_display = ['imagen_previa', 'activa', 'fecha_creacion']  # Asegúrate de incluir los campos reales
    readonly_fields = ['imagen_previa']

    # Define el método para la vista previa
    def imagen_previa(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="150" />')  # Usa mark_safe
        return "Sin imagen"
    imagen_previa.short_description = "Vista previa"  # Nombre de la columna

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'activo')  # Para ver qué eventos están activos
    list_filter = ('activo',)




class PostAdmin(SummernoteModelAdmin):  
    summernote_fields = ('content',)  # Campo donde se aplicará Summernote

admin.site.register(Post, PostAdmin)




# Definir el recurso para importar y exportar
class BitacoraResource(resources.ModelResource):
    class Meta:
        model = Bitacora

# Registrar en el admin con Importación y Exportación habilitadas
@admin.register(Bitacora)
class BitacoraAdmin(ImportExportModelAdmin):  # Habilita importación/exportación
    resource_class = BitacoraResource
    list_display = ('numero_muestra', 'fecha_hora', 'nivel_agua', 'ph', 'temperatura', 'supervisor')
    search_fields = ('numero_muestra', 'supervisor')
    list_filter = ('fecha_hora', 'supervisor')
