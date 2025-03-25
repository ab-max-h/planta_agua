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

document.addEventListener("click", () => {
    let audio = document.getElementById("audio");
    audio.muted = false; // Asegura que el audio no esté en mute
    audio.play().catch(error => {
      console.log("Error al reproducir el audio:", error);
    });
  }, { once: true });

  // Animación al hacer scroll
document.addEventListener('DOMContentLoaded', function () {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const gallerySection = document.querySelector('.gallery-section');

    // Animación para la galería al aparecer
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    galleryObserver.observe(gallerySection);

    // Ajustar la línea de tiempo al cargar y al redimensionar
    function adjustTimeline() {
        const timeline = document.querySelector('.timeline');
        const timelineLine = document.querySelector('.timeline-line');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (timelineItems.length > 0) {
            // Calcular el ancho total necesario
            const firstItem = timelineItems[0];
            const lastItem = timelineItems[timelineItems.length - 1];
            const totalWidth = (lastItem.offsetLeft + lastItem.offsetWidth) - firstItem.offsetLeft;
            
            // Ajustar el ancho de la línea
            timelineLine.style.width = `${totalWidth}px`;
            
            // Centrar la línea horizontalmente
            const lineOffset = firstItem.offsetLeft + (firstItem.offsetWidth / 2);
            timelineLine.style.left = `${lineOffset}px`;
            
            // Asegurar que el contenedor tenga suficiente espacio
            timeline.style.minWidth = `${totalWidth + (lineOffset * 2)}px`;
        }
    }

    // Animación para la línea de tiempo
    function checkTimeline() {
        const triggerPoint = window.innerHeight * 0.8;

        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < triggerPoint && rect.bottom > 0) {
                // Añadir un retraso escalonado para cada elemento
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 200);
            }
        });
    }

    // Event listeners
    window.addEventListener('scroll', checkTimeline);
    window.addEventListener('resize', function() {
        checkTimeline();
        adjustTimeline();
    });
    
    // Iniciar animaciones al cargar
    checkTimeline();
    adjustTimeline();
});
// Galería de fotos
document.addEventListener('DOMContentLoaded', function() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pagination = document.querySelector('.gallery-pagination');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-btn');
    
    let currentIndex = 0;
    const itemWidth = galleryItems[0].offsetWidth + 30; // Ancho + gap
    
    // Crear puntos de paginación
    galleryItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        pagination.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.pagination-dot');
    
    // Función para mover la galería con efecto de rebote
    function goToSlide(index) {
        currentIndex = index;
        const offset = -currentIndex * itemWidth;
        
        // Añadir clase de transición suave
        galleryTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
        galleryTrack.style.transform = `translateX(${offset}px)`;
        
        // Actualizar clases activas
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
            if (i === currentIndex) {
                dot.classList.add('pulse');
                setTimeout(() => dot.classList.remove('pulse'), 1000);
            }
        });
    }
    
    // Botones de navegación con efecto
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        goToSlide(currentIndex);
        prevBtn.classList.add('pulse');
        setTimeout(() => prevBtn.classList.remove('pulse'), 500);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        goToSlide(currentIndex);
        nextBtn.classList.add('pulse');
        setTimeout(() => nextBtn.classList.remove('pulse'), 500);
    });
    
    // Abrir modal al hacer clic en botón "Ampliar"
    document.querySelectorAll('.view-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = galleryItems[index].querySelector('.gallery-image').src;
            const title = galleryItems[index].querySelector('.image-overlay h3').textContent;
            const desc = galleryItems[index].querySelector('.image-overlay p').textContent;
            
            modalImg.src = imgSrc;
            modalCaption.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Deshabilitar scroll
        });
    });
    
    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Habilitar scroll
    });
    
    // Cerrar al hacer clic fuera de la imagen
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Habilitar scroll
        }
    });

    // Efecto de hover para los items de la galería
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('float');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('float');
        });
    });

    // Auto-desplazamiento opcional (descomentar si se desea)
    /*
    let autoScroll = setInterval(() => {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        goToSlide(currentIndex);
    }, 5000);

    galleryTrack.addEventListener('mouseenter', () => {
        clearInterval(autoScroll);
    });

    galleryTrack.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => {
            currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
            goToSlide(currentIndex);
        }, 5000);
    });
    */
});