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