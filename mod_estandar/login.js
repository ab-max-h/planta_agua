document.getElementById('loginButton').addEventListener('click', function(e) {
    // Animación del efecto onda
    let rect = this.getBoundingClientRect();
    let wave = this.querySelector('.btn-wave');
    wave.style.left = `${e.clientX - rect.left}px`;
    wave.style.top = `${e.clientY - rect.top}px`;
    
    // Mantener la función original de despliegue
    Desplegar();
});

document.addEventListener('DOMContentLoaded', function () {
    // Evento para el botón de login (existente)
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

    // Evento para el botón Entrar (existente)
    document.getElementById("submitButton").addEventListener("click", login);

    // Animación para elementos del tríptico
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

function Desplegar() {
    let desplegar = document.getElementById("loginForm");
    desplegar.style.display = desplegar.style.display === "block" ? "none" : "block";
}