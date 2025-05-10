document.addEventListener('DOMContentLoaded', function() {
    // Inicializar DataTable
    const tabla = $('#tablaBitacoras').DataTable({
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron registros",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        "responsive": true,
        "autoWidth": false,
        "order": [[0, "desc"]] // Ordenar por fecha descendente
    });

    // Función para cargar gráficos con tus datos específicos
    function cargarGraficas() {
        // Obtener datos de la tabla
        const datos = tabla.rows().data().toArray();
        
        // Procesar datos para gráficos
        const fechas = datos.map(d => d[0]); // Asumiendo que la fecha está en la primera columna
        const volG = datos.map(d => parseFloat(d[1]) || 0); // Vol. G.
        const volAgregado = datos.map(d => parseFloat(d[2]) || 0); // Vol. Agregado
        const volTotal = datos.map(d => parseFloat(d[3]) || 0); // V total
        
        // 1. Gráfico de Volumen Total
        const graficoVolumen = echarts.init(document.getElementById('grafico_volumen'));
        graficoVolumen.setOption({
            title: { text: 'Volumen Total (m³)', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { 
                type: 'category', 
                data: fechas,
                axisLabel: { rotate: 45 }
            },
            yAxis: { type: 'value', name: 'm³' },
            series: [{ 
                name: 'Volumen Total', 
                type: 'line', 
                data: volTotal,
                smooth: true,
                lineStyle: { width: 3 },
                itemStyle: { color: '#3498db' }
            }]
        });

        // 2. Gráfico comparativo Vol. G. vs Vol. Agregado
        const graficoComparativo = echarts.init(document.getElementById('grafico_comparativo'));
        graficoComparativo.setOption({
            title: { text: 'Comparación Volúmenes', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['Vol. G.', 'Vol. Agregado'], bottom: 0 },
            xAxis: { 
                type: 'category', 
                data: fechas,
                axisLabel: { rotate: 45 }
            },
            yAxis: { type: 'value', name: 'm³' },
            series: [
                {
                    name: 'Vol. G.',
                    type: 'bar',
                    data: volG,
                    itemStyle: { color: '#2ecc71' }
                },
                {
                    name: 'Vol. Agregado',
                    type: 'bar',
                    data: volAgregado,
                    itemStyle: { color: '#e74c3c' }
                }
            ]
        });

        // 3. Gráfico de relación Vol. Agregado vs Vol. Total
        const graficoRelacion = echarts.init(document.getElementById('grafico_relacion'));
        graficoRelacion.setOption({
            title: { text: 'Relación Vol. Agregado vs Vol. Total', left: 'center' },
            tooltip: { trigger: 'item' },
            xAxis: { type: 'value', name: 'Vol. Agregado (m³)' },
            yAxis: { type: 'value', name: 'Vol. Total (m³)' },
            series: [{ 
                name: 'Relación', 
                type: 'scatter', 
                data: volAgregado.map((v, i) => [v, volTotal[i]]),
                symbolSize: 10,
                itemStyle: { color: '#9b59b6' }
            }]
        });

        // Ajustar gráficos al cambiar tamaño de ventana
        window.addEventListener('resize', function() {
            graficoVolumen.resize();
            graficoComparativo.resize();
            graficoRelacion.resize();
        });
    }

    // Cargar gráficos al mostrar la sección
    document.querySelector('[data-opcion="graficacion"]').addEventListener('click', function() {
        setTimeout(cargarGraficas, 350);
    });

    // Botón para actualizar gráficos
    document.getElementById('actualizarGraficos').addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        setTimeout(() => {
            cargarGraficas();
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Gráficos';
            showToast('Gráficos actualizados');
        }, 500);
    });

    // Función para mostrar notificaciones
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show ' + type;
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    }
});