// Función para abrir/cerrar el menú lateral
document.getElementById('menuToggle').addEventListener('click', function () {
    const menuLateral = document.getElementById('menuLateral');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    
    menuLateral.classList.toggle('abierto');
    contenidoPrincipal.classList.toggle('menu-abierto');
    
    // Guardar estado del menú en localStorage
    const isOpen = menuLateral.classList.contains('abierto');
    localStorage.setItem('menuOpen', isOpen);
});

// Cambiar entre las opciones del menú
document.querySelectorAll('.menu-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Remover clase active de todos los botones
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        
        // Añadir clase active al botón clickeado
        this.classList.add('active');
        
        const opcion = this.getAttribute('data-opcion');
        
        // Ocultar todas las secciones de contenido
        document.querySelectorAll('.contenido-opcion').forEach(function (seccion) {
            seccion.classList.remove('activo');
        });
        
        // Mostrar la sección correspondiente
        document.getElementById(opcion).classList.add('activo');
        
        // Si es la sección de gráficos, cargarlos
        if (opcion === 'graficacion') {
            cargarGraficas();
        }
    });
});

// Verificar estado del menú al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const menuOpen = localStorage.getItem('menuOpen') === 'true';
    if (menuOpen) {
        document.getElementById('menuLateral').classList.add('abierto');
        document.getElementById('contenidoPrincipal').classList.add('menu-abierto');
    }
    
    // Inicializar DataTables
    $('#tablaBitacoras').DataTable({
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
        "autoWidth": false
    });
    
    // Manejar la selección de archivos
    const fileInput = document.getElementById('archivo_excel');
    const fileInfo = document.getElementById('fileInfo');
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileInfo.textContent = this.files[0].name;
            fileInfo.style.color = '#28a745';
            fileInfo.innerHTML += ' <i class="fas fa-check-circle"></i>';
        } else {
            fileInfo.textContent = 'No se ha seleccionado ningún archivo';
            fileInfo.style.color = '#6c757d';
        }
    });
    
    // Botón de actualizar datos
    document.getElementById('refreshData').addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        
        // Simular carga
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
            showToast('Datos actualizados correctamente');
        }, 1500);
    });
    
    // Botón de exportar
    document.getElementById('exportExcel').addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exportando...';
        
        // Simular exportación
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-file-export"></i> Exportar';
            showToast('Archivo exportado correctamente');
        }, 1500);
    });
    
    // Actualizar gráficos al cambiar período
    document.getElementById('updateCharts').addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        cargarGraficas();
    });
});

// Función para mostrar notificación toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Configurar según el tipo
    if (type === 'success') {
        toast.style.backgroundColor = '#28a745';
        toastIcon.className = 'fas fa-check-circle toast-icon';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
        toastIcon.className = 'fas fa-exclamation-circle toast-icon';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#ffc107';
        toastIcon.className = 'fas fa-exclamation-triangle toast-icon';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Función para cargar gráficos
function cargarGraficas() {
    // Simular carga de datos desde API
    fetch("/api/datos-bitacora/")
        .then(response => response.json())
        .then(datos => {
            // Procesar datos y crear gráficos
            crearGraficos(datos);
            
            // Restaurar botón de actualizar
            document.getElementById('updateCharts').innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Gráficos';
            showToast('Gráficos actualizados correctamente');
        })
        .catch(error => {
            console.error("Error cargando datos:", error);
            document.getElementById('updateCharts').innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Gráficos';
            showToast('Error al cargar los datos', 'error');
        });
}

function crearGraficos(datos) {
    // Procesar datos
    const fechas = datos.map(d => new Date(d.fecha_hora).toLocaleDateString());
    const niveles = datos.map(d => d.nivel_agua);
    const temperaturas = datos.map(d => d.temperatura);
    const ph = datos.map(d => d.ph);
    const toc = datos.map(d => d.toc);
    const dqo = datos.map(d => d.dqo);
    
    // 1. Gráfico de Nivel del Agua
    const graficoNivel = echarts.init(document.getElementById('grafico_nivel'));
    graficoNivel.setOption({
        title: { text: 'Nivel del Agua a lo Largo del Tiempo', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { 
            type: 'category', 
            data: fechas,
            axisLabel: { rotate: 45 }
        },
        yAxis: { type: 'value', name: 'Nivel (m)' },
        series: [{ 
            name: 'Nivel', 
            type: 'line', 
            data: niveles,
            smooth: true,
            lineStyle: { width: 3 },
            itemStyle: { color: '#3498db' }
        }],
        grid: { containLabel: true }
    });
    
    // 2. Gráfico de Temperatura
    const graficoTemp = echarts.init(document.getElementById('grafico_temperatura'));
    graficoTemp.setOption({
        title: { text: 'Temperatura a lo Largo del Tiempo', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { 
            type: 'category', 
            data: fechas,
            axisLabel: { rotate: 45 }
        },
        yAxis: { type: 'value', name: 'Temperatura (°C)' },
        series: [{ 
            name: 'Temperatura', 
            type: 'line', 
            data: temperaturas,
            smooth: true,
            lineStyle: { width: 3 },
            itemStyle: { color: '#e74c3c' }
        }],
        grid: { containLabel: true }
    });
    
    // 3. Gráfico de pH vs Nivel
    const graficoPHvsNivel = echarts.init(document.getElementById('grafico_ph_vs_nivel'));
    graficoPHvsNivel.setOption({
        title: { text: 'Relación entre pH y Nivel de Agua', left: 'center' },
        tooltip: { trigger: 'item' },
        xAxis: { type: 'value', name: 'Nivel (m)' },
        yAxis: { type: 'value', name: 'pH' },
        series: [{ 
            name: 'pH vs Nivel', 
            type: 'scatter', 
            data: niveles.map((v, i) => [v, ph[i]]),
            symbolSize: 10,
            itemStyle: { color: '#9b59b6' }
        }],
        grid: { containLabel: true }
    });
    
    // 4. Gráfico de TOC vs DQO
    const graficoTocVsDqo = echarts.init(document.getElementById('grafico_toc_vs_dqo'));
    graficoTocVsDqo.setOption({
        title: { text: 'Relación entre TOC y DQO', left: 'center' },
        tooltip: { trigger: 'item' },
        xAxis: { type: 'value', name: 'TOC (mg/L)' },
        yAxis: { type: 'value', name: 'DQO (mg/L)' },
        series: [{ 
            name: 'TOC vs DQO', 
            type: 'scatter', 
            data: toc.map((v, i) => [v, dqo[i]]),
            symbolSize: 10,
            itemStyle: { color: '#2ecc71' }
        }],
        grid: { containLabel: true }
    });
    
    // 5. Histograma de pH
    const phRanges = {};
    ph.forEach(valor => {
        const range = Math.floor(valor);
        phRanges[range] = (phRanges[range] || 0) + 1;
    });
    
    const ranges = Object.keys(phRanges).sort((a, b) => a - b);
    const counts = ranges.map(r => phRanges[r]);
    
    const graficoPHHistograma = echarts.init(document.getElementById('grafico_ph_histograma'));
    graficoPHHistograma.setOption({
        title: { text: 'Distribución del pH', left: 'center' },
        tooltip: { trigger: 'item' },
        xAxis: { 
            type: 'category', 
            data: ranges.map(r => `${r}-${parseInt(r)+1}`),
            name: 'Rango de pH'
        },
        yAxis: { type: 'value', name: 'Frecuencia' },
        series: [{ 
            name: 'Frecuencia', 
            type: 'bar', 
            data: counts,
            itemStyle: { color: '#f39c12' }
        }],
        grid: { containLabel: true }
    });
    
    // 6. Gráfico de correlación entre variables
    const graficoCorrelacion = echarts.init(document.getElementById('grafico_correlacion'));
    graficoCorrelacion.setOption({
        title: { text: 'Correlación entre Variables', left: 'center' },
        tooltip: { trigger: 'item' },
        radar: {
            indicator: [
                { name: 'Nivel', max: Math.max(...niveles) },
                { name: 'Temperatura', max: Math.max(...temperaturas) },
                { name: 'pH', max: Math.max(...ph) },
                { name: 'TOC', max: Math.max(...toc) },
                { name: 'DQO', max: Math.max(...dqo) }
            ]
        },
        series: [{
            name: 'Promedio',
            type: 'radar',
            data: [{
                value: [
                    promedio(niveles),
                    promedio(temperaturas),
                    promedio(ph),
                    promedio(toc),
                    promedio(dqo)
                ],
                name: 'Promedio'
            }],
            areaStyle: { opacity: 0.2 }
        }]
    });
    
    // Ajustar tamaño de gráficos al cambiar ventana
    window.addEventListener('resize', function() {
        graficoNivel.resize();
        graficoTemp.resize();
        graficoPHvsNivel.resize();
        graficoTocVsDqo.resize();
        graficoPHHistograma.resize();
        graficoCorrelacion.resize();
    });
}

// Función auxiliar para calcular promedio
function promedio(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}
