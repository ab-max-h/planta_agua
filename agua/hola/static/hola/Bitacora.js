
        // Manejar el menú lateral
        document.addEventListener('DOMContentLoaded', function () {
            const botonesMenu = document.querySelectorAll('.menu-btn');
            const contenidos = document.querySelectorAll('.contenido-opcion');
            const menuLateral = document.getElementById('menuLateral');
            const btnContraer = document.getElementById('btnContraer');
            const contenidoPrincipal = document.getElementById('contenidoPrincipal');

            // Mostrar/ocultar contenido al hacer clic en una opción del menú
            botonesMenu.forEach(boton => {
                if (boton.getAttribute('data-opcion')) {
                    boton.addEventListener('click', function () {
                        // Ocultar todos los contenidos
                        contenidos.forEach(contenido => {
                            contenido.classList.remove('activo');
                        });

                        // Mostrar el contenido correspondiente
                        const opcion = this.getAttribute('data-opcion');
                        document.getElementById(opcion).classList.add('activo');
                    });
                }
            });

            // Contraer/desplegar el menú lateral
            btnContraer.addEventListener('click', function () {
                menuLateral.classList.toggle('contraido');
                contenidoPrincipal.classList.toggle('menu-contraido');
            });
        });

        // Inicializar DataTables
        $(document).ready(function() {
            // Destruir la tabla si ya está inicializada
            if ($.fn.DataTable.isDataTable('#tablaBitacoras')) {
                $('#tablaBitacoras').DataTable().destroy();
            }

            // Inicializar DataTables
            $('#tablaBitacoras').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"  // Traducción al español
                },
                "paging": true,         // Habilitar paginación
                "searching": true,      // Habilitar búsqueda
                "ordering": true,       // Habilitar ordenamiento
                "info": true,           // Mostrar información de la tabla
                "autoWidth": false      // Deshabilitar ajuste automático de ancho
            });
        });