from django.contrib import admin
from django.utils.safestring import mark_safe
from django import forms
from import_export.admin import ImportExportModelAdmin
from django_summernote.admin import SummernoteModelAdmin
from .models import Galeria, Portada, Evento, Post, Bitacora
from .resources import BitacoraResource
from django.utils.dateparse import parse_date

class BitacoraForm(forms.ModelForm):
    class Meta:
        model = Bitacora
        fields = '__all__'
        widgets = {
            'fecha': forms.DateInput(
                format='%Y-%m-%d',
                attrs={
                    'type': 'date',
                    'placeholder': 'YYYY-MM-DD',
                    'pattern': r'\d{4}-\d{2}-\d{2}'
                }
            )
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.initial['fecha'] = self.instance.fecha.strftime('%Y-%m-%d')

    def clean_fecha(self):
        fecha = self.cleaned_data.get('fecha')
        if isinstance(fecha, str):
            try:
                return parse_date(fecha)
            except (ValueError, TypeError):
                raise forms.ValidationError("Formato de fecha inválido. Use YYYY-MM-DD")
        return fecha

@admin.register(Bitacora)
class BitacoraAdmin(ImportExportModelAdmin):
    form = BitacoraForm
    resource_class = BitacoraResource
    list_display = ('fecha', 'vol_g', 'vol_agregado_m3', 'v_total_m3')
    date_hierarchy = 'fecha'
    
    def get_changelist_form(self, request, **kwargs):
        kwargs.setdefault('form', BitacoraForm)
        return super().get_changelist_form(request, **kwargs)

    def delete_model(self, request, obj):
        from django.db import models
        try:
            original = models.DateField.to_python
            models.DateField.to_python = lambda self, value: value
            obj.delete()
        finally:
            models.DateField.to_python = original

@admin.register(Galeria)
class GaleriaAdmin(admin.ModelAdmin):
    list_display = ['preview', 'titulo', 'tipo', 'activo']
    list_editable = ['activo']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.tipo == 'imagen' and obj.contenido:
            return mark_safe(f'<img src="{obj.contenido.url}" width="150" />')
        elif obj.tipo == 'video':
            return f"🎥 Video: {obj.titulo}"
        return "Sin vista previa"
    preview.short_description = "Vista Previa"

@admin.register(Portada)
class PortadaAdmin(admin.ModelAdmin):
    list_display = ['imagen_previa', 'activa', 'fecha_creacion']
    readonly_fields = ['imagen_previa']
    list_filter = ['activa']

    def imagen_previa(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="150" />')
        return "Sin imagen"
    imagen_previa.short_description = "Vista previa"

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'activo', 'enlace')
    list_filter = ('activo',)
    search_fields = ('titulo',)

@admin.register(Post)
class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)
    list_display = ('title', 'created_at')
    search_fields = ('title', 'content')