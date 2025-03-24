// Espera a que el DOM se cargue completamente para asignar eventos
document.addEventListener('DOMContentLoaded', function () {
    // Asigna evento de clic al botón de login para efecto ripple y despliegue del formulario
    document.getElementById('loginButton').addEventListener('click', function(e) {
        let rect = this.getBoundingClientRect();
        let wave = this.querySelector('.btn-wave');
        if (!wave) {
            wave = document.createElement('span');
            wave.className = 'btn-wave';
            this.appendChild(wave);
        }
        wave.style.left = `${e.clientX - rect.left}px`;
        wave.style.top = `${e.clientY - rect.top}px`;
        Desplegar();
    });

    // Evento para el botón "Entrar"
    document.getElementById("submitButton").addEventListener("click", login);

    // Intersection Observer para animar la aparición de los elementos del tríptico
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.triptico-item').forEach(item => {
        observer.observe(item);
    });
});

// Función para realizar el login mediante fetch
async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
        let response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        let data = await response.json();
        if (response.ok) {
            alert("Bienvenido, " + username);
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
}

// Función para alternar la visibilidad del formulario de login
function Desplegar() {
    let desplegar = document.getElementById("loginForm");
    desplegar.style.display = desplegar.style.display === "block" ? "none" : "block";
}
