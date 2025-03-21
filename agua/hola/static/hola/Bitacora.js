// Obtener elementos del formulario y el botón de enviar
const fileInput = document.querySelector('input[type="file"]');
const submitButton = document.querySelector('button');
const messageDiv = document.createElement('div');
messageDiv.style.marginTop = '10px';
messageDiv.style.fontSize = '16px';
messageDiv.style.fontWeight = 'bold';
messageDiv.style.color = 'green';

// Mostrar mensaje cuando un archivo es seleccionado
fileInput.addEventListener('change', function () {
    // Verifica si se seleccionó un archivo
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        messageDiv.textContent = `Archivo seleccionado: ${fileName}`;
        fileInput.parentElement.appendChild(messageDiv);
    } else {
        messageDiv.textContent = '';
    }
});

// Cambiar el texto del botón al enviar el formulario
submitButton.addEventListener('click', function (e) {
    if (fileInput.files.length === 0) {
        e.preventDefault(); // Evita que se envíe el formulario si no hay archivo
        alert("Por favor, selecciona un archivo primero.");
    } else {
        submitButton.innerHTML = 'Cargando...'; // Cambia el texto del botón a "Cargando..."
        setTimeout(() => {
            submitButton.innerHTML = '📤 Importar Excel'; // Después de 2 segundos, vuelve a cambiar el texto
        }, 2000);
    }
});

// Añadir efecto hover al botón
submitButton.addEventListener('mouseover', function() {
    submitButton.style.backgroundColor = '#45a049'; // Cambia el fondo al pasar el ratón
});
submitButton.addEventListener('mouseout', function() {
    submitButton.style.backgroundColor = '#4CAF50'; // Vuelve al color original cuando se quita el ratón
});


// Inicialización de DataTables
$(document).ready(function () {
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
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Solo ejecutar el código cuando se seleccione la opción "Graficación"
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            if (this.getAttribute("data-opcion") === "graficacion") {
                cargarGrafica();
            }
        });
    });
});

function cargarGrafica() {
    // Verifica si la librería de ECharts ya está cargada
    if (typeof echarts === "undefined") {
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
        script.onload = inicializarGrafico;
        document.body.appendChild(script);
    } else {
        inicializarGrafico();
    }
}

function inicializarGrafico() {
    fetch("/api/datos-bitacora/")  // Ruta Django que devuelve JSON
        .then(response => response.json())
        .then(datos => {
            let fechas = datos.map(d => d.fecha_hora);
            let niveles = datos.map(d => d.nivel_agua);
            let temperaturas = datos.map(d => d.temperatura);

            let grafico = echarts.init(document.getElementById("grafico"));

            let opciones = {
                title: { text: "Nivel del Agua y Temperatura" },
                tooltip: { trigger: "axis" },
                legend: { data: ["Nivel (m)", "Temperatura (°C)"] },
                xAxis: { type: "category", data: fechas },
                yAxis: [
                    { type: "value", name: "Nivel (m)" },
                    { type: "value", name: "Temperatura (°C)", position: "right" }
                ],
                series: [
                    { name: "Nivel (m)", type: "line", data: niveles },
                    { name: "Temperatura (°C)", type: "line", data: temperaturas, yAxisIndex: 1 }
                ]
            };

            grafico.setOption(opciones);
        })
        .catch(error => console.error("Error cargando datos:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            if (this.getAttribute("data-opcion") === "graficacion") {
                cargarGraficas();
            }
        });
    });
});

function cargarGraficas() {
    if (typeof echarts === "undefined") {
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
        script.onload = inicializarGraficas;
        document.body.appendChild(script);
    } else {
        inicializarGraficas();
    }
}

function inicializarGraficas() {
    fetch("/api/datos-bitacora/") 
        .then(response => response.json())
        .then(datos => {
            let fechas = datos.map(d => d.fecha_hora);
            let niveles = datos.map(d => d.nivel_agua);
            let temperaturas = datos.map(d => d.temperatura);
            let ph = datos.map(d => d.ph);
            let toc = datos.map(d => d.toc);
            let dqo = datos.map(d => d.dqo);

            // 📊 Nivel del Agua vs. Fecha
            let graficoNivel = echarts.init(document.getElementById("grafico_nivel"));
            graficoNivel.setOption({
                title: { text: "Nivel del Agua a lo Largo del Tiempo" },
                xAxis: { type: "category", data: fechas },
                yAxis: { type: "value", name: "Nivel (m)" },
                series: [{ name: "Nivel", type: "line", data: niveles }]
            });

            // 🌡 Temperatura vs. Fecha
            let graficoTemp = echarts.init(document.getElementById("grafico_temperatura"));
            graficoTemp.setOption({
                title: { text: "Temperatura a lo Largo del Tiempo" },
                xAxis: { type: "category", data: fechas },
                yAxis: { type: "value", name: "Temperatura (°C)" },
                series: [{ name: "Temperatura", type: "line", data: temperaturas }]
            });

            // ⚡ pH vs. Nivel de Agua (Dispersión)
            let graficoPHvsNivel = echarts.init(document.getElementById("grafico_ph_vs_nivel"));
            graficoPHvsNivel.setOption({
                title: { text: "Relación entre pH y Nivel de Agua" },
                xAxis: { type: "value", name: "Nivel (m)" },
                yAxis: { type: "value", name: "pH" },
                series: [{ name: "pH vs Nivel", type: "scatter", data: niveles.map((v, i) => [v, ph[i]]) }]
            });

            // 🧪 TOC vs. DQO (Dispersión)
            let graficoTocVsDqo = echarts.init(document.getElementById("grafico_toc_vs_dqo"));
            graficoTocVsDqo.setOption({
                title: { text: "Relación entre TOC y DQO" },
                xAxis: { type: "value", name: "TOC (mg/L)" },
                yAxis: { type: "value", name: "DQO (mg/L)" },
                series: [{ name: "TOC vs DQO", type: "scatter", data: toc.map((v, i) => [v, dqo[i]]) }]
            });

            // 📉 Histograma de pH
            let conteoPH = {};
            ph.forEach(valor => conteoPH[valor] = (conteoPH[valor] || 0) + 1);
            let valoresPH = Object.keys(conteoPH);
            let frecuenciasPH = Object.values(conteoPH);

            let graficoPHHistograma = echarts.init(document.getElementById("grafico_ph_histograma"));
            graficoPHHistograma.setOption({
                title: { text: "Distribución del pH" },
                xAxis: { type: "category", data: valoresPH, name: "pH" },
                yAxis: { type: "value", name: "Frecuencia" },
                series: [{ name: "Frecuencia", type: "bar", data: frecuenciasPH }]
            });

        })
        .catch(error => console.error("Error cargando datos:", error));
}
// Función para abrir/cerrar el menú lateral
document.getElementById('menuToggle').addEventListener('click', function () {
    var menuLateral = document.getElementById('menuLateral');
    var contenidoPrincipal = document.getElementById('contenidoPrincipal');

    // Alternar la clase 'abierto' en el menú lateral
    menuLateral.classList.toggle('abierto');

    // Alternar la clase 'menu-abierto' en el contenido principal
    contenidoPrincipal.classList.toggle('menu-abierto');
});

// Función para cambiar entre las opciones del menú
document.querySelectorAll('.menu-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Obtener la opción seleccionada
        var opcion = this.getAttribute('data-opcion');

        // Ocultar todas las secciones de contenido
        document.querySelectorAll('.contenido-opcion').forEach(function (seccion) {
            seccion.classList.remove('activo');
        });

        // Mostrar la sección correspondiente a la opción seleccionada
        document.getElementById(opcion).classList.add('activo');
    });
});