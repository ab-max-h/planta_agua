// Espera a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function () {
    // ========== EVENTO LOGIN CON EFECTO RIPPLE ========== //
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            // Efecto wave
            let rect = this.getBoundingClientRect();
            let wave = this.querySelector('.btn-wave');
            
            if (!wave) {
                wave = document.createElement('span');
                wave.className = 'btn-wave';
                this.appendChild(wave);
            }
            
            wave.style.left = `${e.clientX - rect.left}px`;
            wave.style.top = `${e.clientY - rect.top}px`;
            
            // Mostrar/ocultar formulario
            Desplegar();
        });
    }

    // ========== EVENTO SUBMIT LOGIN ========== //
    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
        submitButton.addEventListener("click", login);
    }

    // ========== OBSERVER PARA ANIMACIÓN TRÍPTICO ========== //
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

    // ========== CONFIGURACIÓN POSTS HORIZONTALES ========== //
    const postsContainer = document.querySelector('.posts-container');
    if (postsContainer) {
        // Estilos contenedor principal
        Object.assign(postsContainer.style, {
            display: 'flex',
            overflowX: 'auto',
            gap: '25px',
            flexWrap: 'nowrap',
            padding: '20px 10px',
            scrollSnapType: 'x mandatory'
        });

        // Estilos para cada post
        document.querySelectorAll('.post-item').forEach(post => {
            Object.assign(post.style, {
                flex: '0 0 300px',
                marginBottom: '0',
                scrollSnapAlign: 'start'
            });
        });

        // Mejorar experiencia de scroll en móviles
        let isDown = false;
        let startX;
        let scrollLeft;

        postsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - postsContainer.offsetLeft;
            scrollLeft = postsContainer.scrollLeft;
        });

        postsContainer.addEventListener('mouseleave', () => {
            isDown = false;
        });

        postsContainer.addEventListener('mouseup', () => {
            isDown = false;
        });

        postsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - postsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            postsContainer.scrollLeft = scrollLeft - walk;
        });
    }
});

// ========== FUNCIÓN LOGIN ========== //
async function login(e) {
    e.preventDefault();
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
            Desplegar(); // Ocultar formulario
        } else {
            mostrarError(data.message || "Credenciales incorrectas");
        }
    } catch (error) {
        mostrarError("Error de conexión: " + error.message);
    }
}

// ========== FUNCIONES AUXILIARES ========== //
function Desplegar() {
    const desplegar = document.getElementById("loginForm");
    if (desplegar) {
        desplegar.style.display = desplegar.style.display === "block" ? "none" : "block";
    }
}

function mostrarError(mensaje) {
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
        errorContainer.textContent = mensaje;
        errorContainer.style.display = 'block';
        
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}