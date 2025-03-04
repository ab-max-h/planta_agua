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
