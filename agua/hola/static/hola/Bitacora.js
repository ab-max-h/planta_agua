// Script para manejar el menú lateral, la navegación entre opciones y DataTables

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
/*
// Función para manejar el cierre de sesión (puedes personalizarla)
document.querySelector('[data-opcion="cerrar-sesion"]').addEventListener('click', function () {
    // Aquí puedes agregar la lógica para cerrar la sesión
    alert('Cerrando sesión...');
    // Redirigir a la página de inicio de sesión o realizar otras acciones
    window.location.href = '/logout'; // Cambia la URL según tu aplicación
});
*/
// Función para manejar la importación de Excel (puedes personalizarla)
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar el envío del formulario por defecto

    // Aquí puedes agregar la lógica para manejar la importación de Excel
    var formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Archivo importado correctamente.');
            location.reload(); // Recargar la página para mostrar los nuevos datos
        } else {
            alert('Error al importar el archivo: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al importar el archivo.');
    });
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
