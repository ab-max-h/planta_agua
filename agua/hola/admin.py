from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from .models import Bitacora

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
