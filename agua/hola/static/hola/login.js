// Función para mostrar u ocultar el formulario de login
function Desplegar() {
    let desplegar = document.getElementById("loginForm");
    desplegar.style.display = (desplegar.style.display === "block") ? "none" : "block";
}
async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Obtener el token CSRF desde la cookie
    function getCSRFToken() {
        let cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            let [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    }

    let csrfToken = getCSRFToken();  // Extrae el token CSRF

    let response = await fetch("http://127.0.0.1:8000/admin/", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  // Envía el token en la cabecera
        },
        body: JSON.stringify({ username, password })
    });

    let data = await response.json();

    if (response.ok) {
        alert("Bienvenido, " + username);
        window.location.href = data.redirect_url;  // Redirección
    } else {
        alert("Error: " + data.message);
    }
}
