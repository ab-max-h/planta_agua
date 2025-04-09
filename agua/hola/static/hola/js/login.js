document.addEventListener('DOMContentLoaded', function () {
    initLoginEvents();
    initTripticoObserver();
    initHorizontalPosts();
    initTimeline();
    initGallery();
    initAudioEvent();
    initNavEvents();
});
function initLoginEvents() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            toggleLoginForm();
        });
    }

    // Efecto hover persistente en botón
    loginButton.addEventListener('mousemove', (e) => {
        const rect = loginButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        loginButton.style.setProperty('--mouse-x', `${x}px`);
        loginButton.style.setProperty('--mouse-y', `${y}px`);
    });

    // Mejorar interacción con inputs
    const inputs = document.querySelectorAll('#loginForm input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('.input-icon').style.transform = 'translateY(-50%) scale(1.2)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.querySelector('.input-icon').style.transform = 'translateY(-50%)';
        });
    });
}

function createRippleEffect(e, button) {
    let wave = button.querySelector('.btn-wave');
    
    if (!wave) {
        wave = document.createElement('div');
        wave.className = 'btn-wave';
        button.appendChild(wave);
    }
    
    // Reset animation
    wave.style.animation = 'none';
    wave.offsetHeight; // Trigger reflow
    wave.style.animation = null;
    
    // Position wave
    const rect = button.getBoundingClientRect();
    wave.style.left = `${e.clientX - rect.left - 50}px`;
    wave.style.top = `${e.clientY - rect.top - 50}px`;
    
    // Start animation
    wave.style.animation = 'wave 0.6s linear forwards';
}

async function login(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Efecto de carga
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
        let response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        let data = await response.json();
        if (response.ok) {
            // Efecto de éxito
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Bienvenido';
            setTimeout(() => {
                toggleLoginForm();
                submitBtn.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
                submitBtn.disabled = false;
            }, 1500);
        } else {
            showError(data.message || "Credenciales incorrectas");
            submitBtn.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
            submitBtn.disabled = false;
        }
    } catch (error) {
        showError("Error de conexión: " + error.message);
        submitBtn.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
        submitBtn.disabled = false;
    }
}

function toggleLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        if (loginForm.classList.contains('show')) {
            loginForm.classList.remove('show');
            setTimeout(() => {
                loginForm.style.display = "none";
            }, 300);
        } else {
            loginForm.style.display = "block";
            setTimeout(() => {
                loginForm.classList.add('show');
            }, 10);
        }
    }
}

function showError(message) {
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initTripticoObserver();
    initButtonEffects();
    initParallaxEffect();
  });
  
  function initTripticoObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.style.opacity = 1;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  
    document.querySelectorAll('.animate-slideUp').forEach(el => observer.observe(el));
  }
  
  function initButtonEffects() {
    document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
      });
    });
  }
  
  function initParallaxEffect() {
    const portada = document.querySelector('.hero-portada');
    if (!portada) return;
  
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      portada.style.transform = `scale(1.05) translateY(${scroll * 0.2}px)`;
    });
  }
  

function initHorizontalPosts() {
    const postsContainer = document.querySelector('.posts-container');
    if (!postsContainer) return;

    Object.assign(postsContainer.style, {
        display: 'flex',
        overflowX: 'auto',
        gap: '25px',
        flexWrap: 'nowrap',
        padding: '20px 10px',
        scrollSnapType: 'x mandatory'
    });

    document.querySelectorAll('.post-item').forEach(post => {
        Object.assign(post.style, {
            flex: '0 0 300px',
            marginBottom: '0',
            scrollSnapAlign: 'start'
        });
    });

    setupDragScroll(postsContainer);
}

function setupDragScroll(container) {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => isDown = false);
    container.addEventListener('mouseup', () => isDown = false);
    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}

function initTimeline() {
    adjustTimeline();
    window.addEventListener('resize', adjustTimeline);
    window.addEventListener('scroll', checkTimelineVisibility);
}

function adjustTimeline() {
    const timelineLine = document.querySelector('.timeline-line');
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;
    
    const firstItem = timelineItems[0];
    const lastItem = timelineItems[timelineItems.length - 1];
    const totalWidth = (lastItem.offsetLeft + lastItem.offsetWidth) - firstItem.offsetLeft;
    
    timelineLine.style.width = `${totalWidth}px`;
}

function checkTimelineVisibility() {
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        if (item.getBoundingClientRect().top < window.innerHeight * 0.8) {
            setTimeout(() => item.classList.add('animate'), index * 200);
        }
    });
}
function initGallery() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationContainer = document.querySelector('.gallery-pagination');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-btn');

    if (!galleryTrack || !galleryItems.length || !prevBtn || !nextBtn || !paginationContainer || !modal) {
        console.warn('Elementos de la galería no encontrados');
        return;
    }

    let currentIndex = 0;
    let autoScrollInterval;
    let itemWidth = galleryItems[0].getBoundingClientRect().width + 40;
    const visibleItems = Math.min(3, galleryItems.length);
    const totalItems = galleryItems.length;

    function updateItemWidth() {
        itemWidth = galleryItems[0].getBoundingClientRect().width + 40;
        moveGallery();
    }

    function createPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / visibleItems);

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToPage(i));
            paginationContainer.appendChild(dot);
        }
    }

    function updatePagination() {
        const dots = document.querySelectorAll('.pagination-dot');
        const activePage = Math.floor(currentIndex / visibleItems);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activePage);
        });
    }

    function moveGallery() {
        const maxOffset = (totalItems - visibleItems) * itemWidth;
        let offset = -currentIndex * itemWidth;

        if (offset < -maxOffset) {
            offset = -maxOffset;
            currentIndex = totalItems - visibleItems;
        } else if (offset > 0) {
            offset = 0;
            currentIndex = 0;
        }

        galleryTrack.style.transform = `translateX(${offset}px)`;
        updatePagination();
    }

    function goToPage(pageIndex) {
        const totalPages = Math.ceil(totalItems / visibleItems);
        pageIndex = Math.max(0, Math.min(pageIndex, totalPages - 1));
        currentIndex = pageIndex * visibleItems;
        moveGallery();
        resetAutoScroll();
    }

    function openModal(src, title, description) {
        modalImage.src = src;
        modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(autoScrollInterval);
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        startAutoScroll();
    }

    function startAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % (totalItems - visibleItems + 1);
            moveGallery();
        }, 5000);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        moveGallery();
        resetAutoScroll();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(totalItems - visibleItems, currentIndex + 1);
        moveGallery();
        resetAutoScroll();
    });

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.overlay-content h3').textContent;
        const desc = item.querySelector('.overlay-content p').textContent;
        const btn = item.querySelector('.view-btn');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(img.src, title, desc);
        });

        img.addEventListener('click', () => openModal(img.src, title, desc));
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
        if (modal.style.display !== 'block') {
            if (e.key === 'ArrowLeft') {
                currentIndex = Math.max(0, currentIndex - 1);
                moveGallery();
                resetAutoScroll();
            }
            if (e.key === 'ArrowRight') {
                currentIndex = Math.min(totalItems - visibleItems, currentIndex + 1);
                moveGallery();
                resetAutoScroll();
            }
        }
    });

    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.classList.add('float'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('float'));
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.classList.add('pulse'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('pulse'));
    });

    createPagination();
    moveGallery();
    startAutoScroll();

    window.addEventListener('resize', updateItemWidth);
}

document.addEventListener('DOMContentLoaded', initGallery);

function initAudioEvent() {
    document.addEventListener("click", () => {
        const audio = document.getElementById("audio");
        if (audio) {
            audio.muted = false;
            audio.play().catch(error => console.log("Error al reproducir el audio:", error));
        }
    }, { once: true });
}

function initNavEvents() {
    const nav = document.querySelector('.floating-nav');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Eventos para cada ítem del menú
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Marcar como activo
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mantener el menú visible mientras el cursor esté sobre él
    nav.addEventListener('mouseenter', () => {
        nav.style.left = '0';
        nav.style.opacity = '1';
        nav.style.width = '200px';
    });

    nav.addEventListener('mouseleave', () => {
        nav.style.left = '-50px';
        nav.style.opacity = '0.7';
        nav.style.width = '70px';
    });
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', initNavEvents);

//hero

document.addEventListener('DOMContentLoaded', function() {
    // 1. Efecto de partículas dinámicas
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.querySelector('.hero-section').appendChild(particlesContainer);
        
        const particleCount = window.innerWidth > 768 ? 30 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Configuración aleatoria para cada partícula
            const size = Math.random() * 4 + 2;
            const posX = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 15 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            
            Object.assign(particle.style, {
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                bottom: `-10px`,
                animation: `float ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                opacity: opacity,
                backgroundColor: `rgba(255, 200, 87, ${opacity})`
            });
            
            particlesContainer.appendChild(particle);
        }
    }

    // 2. Scroll suave para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Añadir clase de animación al target
                if (targetElement.classList.contains('animate-on-scroll')) {
                    targetElement.classList.add('animate__animated', 'animate__fadeInUp');
                }
            }
        });
    });

    // 3. Efecto parallax para la imagen de portada
    function setupParallax() {
        const heroImg = document.querySelector('.b-hero__img');
        const heroPortada = document.querySelector('.hero-portada');
        
        if (heroImg && heroPortada) {
            let lastScroll = 0;
            let ticking = false;
            
            window.addEventListener('scroll', function() {
                lastScroll = window.pageYOffset;
                
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        heroPortada.style.transform = `translateY(${lastScroll * 0.3}px) scale(1.05)`;
                        ticking = false;
                    });
                    
                    ticking = true;
                }
            });
        }
    }

    // 4. Animación de texto para el título principal (solo desktop)
    function typeWriterEffect() {
        const title = document.querySelector('.hero-title');
        if (!title || window.innerWidth <= 768) return;
        
        const originalText = title.textContent;
        title.textContent = '';
        let i = 0;
        
        function type() {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, Math.random() * 100 + 50);
            }
        }
        
        setTimeout(type, 1000);
    }

    // 5. Animaciones al hacer scroll
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    
                    // Eliminar el observer después de la animación
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1000);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }

    // Inicializar todos los efectos
    createParticles();
    setupParallax();
    typeWriterEffect();
    setupScrollAnimations();

    // 6. Re-iniciar partículas al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        const particles = document.querySelector('.particles');
        if (particles) {
            particles.remove();
            createParticles();
        }
    });
});