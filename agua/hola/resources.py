# hola/resources.py

from import_export import resources, fields
from import_export.widgets import DateWidget
from .models import Bitacora

class BitacoraResource(resources.ModelResource):
    fecha = fields.Field(
        attribute='fecha',
        column_name='Fecha',
        widget=DateWidget(format='%Y-%m-%d')
    )
    vol_g = fields.Field(
        attribute='vol_g',
        column_name='Vol. G.'
    )
    vol_agregado_m3 = fields.Field(
        attribute='vol_agregado_m3',
        column_name='Vol. Agregado (m3)'
    )
    v_total_m3 = fields.Field(
        attribute='v_total_m3',
        column_name='V total m3'
    )

    class Meta:
        model = Bitacora
        import_id_fields = ['fecha']
        fields = ('fecha', 'vol_g', 'vol_agregado_m3', 'v_total_m3')
        skip_unchanged = True
        report_skipped = True
        use_transactions = True
        clean_model_instances = True

    def before_import_row(self, row, row_number=None, **kwargs):
        """
        Limpieza de datos antes de procesar cada fila.
        También se puede evitar la importación de filas duplicadas.
        """
        # Normaliza valores numéricos (coma a punto)
        for field in ['Vol. G.', 'Vol. Agregado (m3)', 'V total m3']:
            if field in row and isinstance(row[field], str):
                row[field] = row[field].replace(',', '.').strip()

        # Evita duplicados basados en 'fecha'
        if 'Fecha' in row:
            fecha = row['Fecha']
            if Bitacora.objects.filter(fecha=fecha).exists():
                raise Exception(f"Ya existe un registro para la fecha {fecha}.")
