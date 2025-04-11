document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los módulos
    initLoginEvents();
    initTripticoEffects();
    initButtonEffects();
    initHorizontalPosts(); // Módulo actualizado
    initTimeline();
    initGallery();
    initAudioEvent();
    initNavEvents();
    initHeroEffects();
});

/* ========== MÓDULO DE LOGIN ========== */
function initLoginEvents() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            toggleLoginForm();
        });
    }

    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
        submitButton.addEventListener("click", login);
    }
}

function createRippleEffect(e, button) {
    let rect = button.getBoundingClientRect();
    let wave = button.querySelector('.btn-wave');
    
    if (!wave) {
        wave = document.createElement('span');
        wave.className = 'btn-wave';
        button.appendChild(wave);
    }
    
    wave.style.left = `${e.clientX - rect.left}px`;
    wave.style.top = `${e.clientY - rect.top}px`;
}

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
            toggleLoginForm();
        } else {
            showError(data.message || "Credenciales incorrectas");
        }
    } catch (error) {
        showError("Error de conexión: " + error.message);
    }
}

function toggleLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.style.display = loginForm.style.display === "block" ? "none" : "block";
    }
}

function showError(message) {
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => errorContainer.style.display = 'none', 5000);
    }
}

/* ========== MÓDULO DE TRÍPTICO ========== */
function initTripticoEffects() {
    initTripticoObserver();
    initTripticoHoverEffects();
}

function initTripticoObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateTripticoElements(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.triptico-item').forEach(el => {
        prepareTripticoElements(el);
        observer.observe(el);
    });
}

function prepareTripticoElements(el) {
    const elements = {
        icon: el.querySelector('.triptico-icon'),
        heading: el.querySelector('h2'),
        content: el.querySelector('p, ul')
    };

    const animationStyle = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    for (const [key, element] of Object.entries(elements)) {
        if (!element) continue;
        
        element.style.transition = animationStyle;
        element.style.opacity = '0';
        element.style.transform = key === 'icon' ? 'scale(0.5)' : 'translateY(20px)';
    }
}

function animateTripticoElements(el) {
    const elements = {
        icon: el.querySelector('.triptico-icon'),
        heading: el.querySelector('h2'),
        content: el.querySelector('p, ul')
    };

    const delays = { icon: 200, heading: 400, content: 600 };
    
    for (const [key, element] of Object.entries(elements)) {
        if (!element) continue;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = key === 'icon' ? 'scale(1)' : 'translateY(0)';
        }, delays[key]);
    }
}

function initTripticoHoverEffects() {
    document.querySelectorAll('.triptico-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const centerX = item.offsetWidth / 2;
            const centerY = item.offsetHeight / 2;
            item.style.transform = `
                rotateX(${(e.offsetY - centerY) / 20}deg) 
                rotateY(${(centerX - e.offsetX) / 20}deg) 
                translateY(-8px) 
                scale(1.02)
            `;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(-8px) scale(1.02) rotateX(1deg)';
        });
        
        item.addEventListener('mouseenter', () => {
            const particles = item.querySelector('.particles') || document.createElement('div');
            particles.className = 'particles';
            item.appendChild(particles);
            particles.innerHTML = '';
            
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                Object.assign(particle.style, {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${5 + Math.random() * 10}px`,
                    height: `${5 + Math.random() * 10}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 10}s`
                });
                particles.appendChild(particle);
            }
        });
    });
}

/* ========== MÓDULO DE BOTONES ========== */
function initButtonEffects() {
    document.querySelectorAll('.btn, .cta-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            button.style.setProperty('--x', `${e.offsetX}px`);
            button.style.setProperty('--y', `${e.offsetY}px`);
        });
        
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = button.classList.contains('cta-button') ? 'ripple' : 'btn-wave';
            
            if (button.classList.contains('cta-button')) {
                ripple.style.left = `${e.offsetX}px`;
                ripple.style.top = `${e.offsetY}px`;
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 1000);
            } else {
                createRippleEffect(e, button);
            }
        });
    });
}

/* ========== MÓDULO DE POSTS HORIZONTALES (ACTUALIZADO) ========== */
function initHorizontalPosts() {
    const postsContainer = document.querySelector('.posts-container');
    if (!postsContainer) return;

    setupHorizontalScroll(postsContainer);
    setupPostModals();
    animatePostsOnLoad();
}

function setupHorizontalScroll(container) {
    let isDragging = false;
    let startPos = 0;
    let currentScroll = 0;
    let velocity = 0;
    let animationId = null;
    let lastTime = 0;
    
    // Eventos de ratón
    container.addEventListener('mousedown', startDrag);
    container.addEventListener('mousemove', drag);
    container.addEventListener('mouseup', endDrag);
    container.addEventListener('mouseleave', endDrag);
    
    // Eventos táctiles
    container.addEventListener('touchstart', touchStart, {passive: true});
    container.addEventListener('touchmove', touchMove, {passive: true});
    container.addEventListener('touchend', touchEnd, {passive: true});

    function startDrag(e) {
        isDragging = true;
        container.style.cursor = 'grabbing';
        startPos = getClientX(e);
        currentScroll = container.scrollLeft;
        velocity = 0;
        lastTime = performance.now();
        
        cancelAnimationFrame(animationId);
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        const x = getClientX(e);
        const dragDistance = x - startPos;
        const newScroll = currentScroll - dragDistance;
        
        if (deltaTime > 0) {
            velocity = (container.scrollLeft - newScroll) / deltaTime * 15;
        }
        
        container.scrollLeft = newScroll;
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        
        if (Math.abs(velocity) > 0.5) {
            applyInertia();
        }
    }

    function applyInertia() {
        if (Math.abs(velocity) > 0.5) {
            velocity *= 0.95;
            container.scrollLeft += velocity;
            
            if (Math.abs(velocity) > 0.5) {
                animationId = requestAnimationFrame(applyInertia);
            } else {
                velocity = 0;
            }
        }
    }

    function touchStart(e) {
        startDrag(e.touches[0]);
    }

    function touchMove(e) {
        drag(e.touches[0]);
    }

    function touchEnd() {
        endDrag();
    }

    function getClientX(event) {
        return event.clientX || event.touches[0].clientX;
    }
}

function setupPostModals() {
    const modal = document.getElementById('post-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalDate = document.getElementById('modal-date');
    const closeBtn = modal.querySelector('.close-modal');

    // Delegación de eventos
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.read-more-btn');
        if (btn) {
            const post = btn.closest('.post-item');
            const title = post.querySelector('h3').textContent;
            const content = post.querySelector('.post-content').innerHTML;
            const date = post.querySelector('.post-meta').textContent;
            
            openModal(title, content, date);
        }
        
        if (e.target === modal || e.target === closeBtn) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal(title, content, date) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modalDate.textContent = date;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function animatePostsOnLoad() {
    const posts = document.querySelectorAll('.post-item');
    
    posts.forEach((post, index) => {
        post.style.transitionDelay = `${index * 0.1}s`;
        post.classList.add('loaded');
    });
}

/* ========== MÓDULO DE TIMELINE ========== */
function initTimeline() {
    adjustTimeline();
    window.addEventListener('resize', adjustTimeline);
    window.addEventListener('scroll', checkTimelineVisibility);
    window.addEventListener('scroll', updateTimelineProgress);
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const dot = item.querySelector('.timeline-dot');
            dot.style.transform = 'translateX(-50%) scale(1.3)';
            dot.style.boxShadow = '0 0 0 15px rgba(102, 126, 234, 0.4)';
        });
        
        item.addEventListener('mouseleave', () => {
            const dot = item.querySelector('.timeline-dot');
            dot.style.transform = 'translateX(-50%) scale(1)';
            dot.style.boxShadow = '0 0 0 10px rgba(102, 126, 234, 0.3)';
        });
    });
}

function adjustTimeline() {
    const timelineLine = document.querySelector('.timeline-line');
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    const firstItem = timelineItems[0];
    const lastItem = timelineItems[timelineItems.length - 1];
    const totalWidth = (lastItem.offsetLeft + lastItem.offsetWidth) - firstItem.offsetLeft;
    
    if (timelineLine) timelineLine.style.width = `${100}%`;
}

function checkTimelineVisibility() {
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isVisible = (rect.top < window.innerHeight * 0.75) && 
                         (rect.bottom > 0);
        
        if (isVisible) {
            setTimeout(() => {
                item.classList.add('animate');
                
                const content = item.querySelector('.timeline-content');
                if (content) {
                    setTimeout(() => {
                        content.style.transitionDelay = `${index * 0.1}s`;
                    }, index * 200);
                }
            }, index * 200);
        }
    });
}

function updateTimelineProgress() {
    const timelineSection = document.querySelector('.timeline-section');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    if (!timelineSection || !timelineProgress) return;
    
    const scrollLeft = timelineSection.scrollLeft;
    const scrollWidth = timelineSection.scrollWidth - timelineSection.clientWidth;
    const progress = scrollLeft / scrollWidth;
    progress += 0.05;
    timelineProgress.style.width = `${progress * 50000}%`;
}

/* ========== MÓDULO DE GALERÍA ========== */
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const gallery = {
        track: document.querySelector('.gallery-track'),
        items: document.querySelectorAll('.gallery-item'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        pagination: document.querySelector('.gallery-pagination'),
        modal: document.getElementById('contentModal'),
        mediaContainer: document.getElementById('modalMediaContainer'),
        modalCaption: document.getElementById('modalCaption'),
        closeBtn: document.querySelector('.close-btn'),
        activeVideo: null
    };

    if (!gallery.track || !gallery.items.length) return;

    let currentIndex = 0;
    let autoScrollInterval;
    let itemWidth = gallery.items[0].getBoundingClientRect().width + 40;
    const visibleItems = Math.min(3, gallery.items.length);
    const totalItems = gallery.items.length;

    // Inicialización
    function init() {
        initEvents();
        createPagination();
        moveGallery();
        startAutoScroll();
    }

    // Manejadores de eventos
    function initEvents() {
        // Navegación
        if (gallery.prevBtn && gallery.nextBtn) {
            gallery.prevBtn.addEventListener('click', () => navigateGallery(-1));
            gallery.nextBtn.addEventListener('click', () => navigateGallery(1));
        }

        // Modal
        if (gallery.closeBtn && gallery.modal) {
            gallery.closeBtn.addEventListener('click', closeModal);
            gallery.modal.addEventListener('click', (e) => e.target === gallery.modal && closeModal());
        }

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && gallery.modal.style.display === 'block') {
                closeModal();
            } else if (gallery.modal.style.display !== 'block') {
                if (e.key === 'ArrowLeft') navigateGallery(-1);
                if (e.key === 'ArrowRight') navigateGallery(1);
            }
        });

        // Items de la galería
        gallery.items.forEach((item) => {
            const isVideo = item.querySelector('video, .video-container') !== null;
            const btn = item.querySelector('.view-btn');
            const video = item.querySelector('video');
            const iframe = item.querySelector('iframe');
            
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMediaModal(item, isVideo);
                });
            }

            item.addEventListener('click', () => openMediaModal(item, isVideo));

            // Para videos locales
            if (video) {
                video.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMediaModal(item, true);
                });
            }

            // Para iframes (videos externos)
            if (iframe) {
                iframe.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMediaModal(item, true);
                });
            }
        });

        // Efectos hover
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.classList.add('float'));
            btn.addEventListener('mouseleave', () => btn.classList.remove('float'));
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.classList.add('pulse'));
            btn.addEventListener('mouseleave', () => btn.classList.remove('pulse'));
        });
    }

    // Navegación de la galería
    function navigateGallery(direction) {
        currentIndex = Math.max(0, Math.min(totalItems - visibleItems, currentIndex + direction));
        moveGallery();
        resetAutoScroll();
    }

    function moveGallery() {
        const maxOffset = (totalItems - visibleItems) * itemWidth;
        let offset = -currentIndex * itemWidth;
        
        offset = Math.max(-maxOffset, Math.min(0, offset));
        gallery.track.style.transform = `translateX(${offset}px)`;
        updatePagination();
    }

    // Paginación
    function createPagination() {
        if (!gallery.pagination) return;
        
        gallery.pagination.innerHTML = '';
        const totalPages = Math.ceil(totalItems / visibleItems);

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i * visibleItems;
                moveGallery();
                resetAutoScroll();
            });
            gallery.pagination.appendChild(dot);
        }
    }

    function updatePagination() {
        const dots = document.querySelectorAll('.pagination-dot');
        const activePage = Math.floor(currentIndex / visibleItems);
        dots.forEach((dot, index) => dot.classList.toggle('active', index === activePage));
    }

    // Modal de medios
    function openMediaModal(item, isVideo) {
        if (!gallery.modal || !gallery.mediaContainer || !gallery.modalCaption) return;
        
        const title = item.querySelector('h3')?.textContent || '';
        const date = item.querySelector('.overlay-content p')?.textContent || '';
        
        gallery.mediaContainer.innerHTML = '';
        
        if (isVideo) {
            const videoContainer = item.querySelector('.video-container');
            if (videoContainer) {
                // Video externo (iframe)
                gallery.mediaContainer.innerHTML = `
                    <div class="modal-video">
                        ${videoContainer.innerHTML}
                    </div>
                `;
            } else {
                // Video local
                const video = item.querySelector('video').cloneNode(true);
                video.controls = true;
                video.classList.add('modal-video');
                gallery.mediaContainer.appendChild(video);
                gallery.activeVideo = video;
            }
        } else {
            // Imagen
            const img = item.querySelector('img').cloneNode();
            img.classList.add('modal-image');
            gallery.mediaContainer.appendChild(img);
        }
        
        gallery.modalCaption.innerHTML = `
            <h3>${title}</h3>
            <p>${date}</p>
        `;
        
        gallery.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(autoScrollInterval);
    }

    function closeModal() {
        if (!gallery.modal) return;
        
        // Pausar video si está reproduciendo
        if (gallery.activeVideo) {
            gallery.activeVideo.pause();
            gallery.activeVideo = null;
        }
        
        gallery.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        startAutoScroll();
    }

    // Auto-scroll
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

    // Responsive
    function handleResize() {
        itemWidth = gallery.items[0].getBoundingClientRect().width + 40;
        moveGallery();
    }

    window.addEventListener('resize', handleResize);

    // Inicializar
    init();
}
/* ========== MÓDULO DE AUDIO ========== */
function initAudioEvent() {
    document.addEventListener("click", () => {
        const audio = document.getElementById("audio");
        if (audio) {
            audio.muted = false;
            audio.play().catch(error => console.log("Error al reproducir el audio:", error));
        }
    }, { once: true });
}

/* ========== MÓDULO DE NAVEGACIÓN ========== */
function initNavEvents() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;

    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

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

/* ========== MÓDULO HERO ========== */
function initHeroEffects() {
    createParticles();
    setupParallax();
    typeWriterEffect();
    setupScrollAnimations();
    setupSmoothScroll();

    window.addEventListener('resize', () => {
        document.querySelector('.particles')?.remove();
        createParticles();
    });
}

function createParticles(container = document.querySelector('.hero-section')) {
    if (!container) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    container.appendChild(particlesContainer);
    
    const particleCount = window.innerWidth > 768 ? 30 : 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const opacity = Math.random() * 0.5 + 0.1;
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-10px`,
            animation: `float ${Math.random() * 15 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: opacity,
            backgroundColor: `rgba(255, 200, 87, ${opacity})`
        });
        
        particlesContainer.appendChild(particle);
    }
}

function setupParallax() {
    const heroPortada = document.querySelector('.hero-portada');
    if (!heroPortada) return;
    
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

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                setTimeout(() => observer.unobserve(entry.target), 1000);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

function setupSmoothScroll() {
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
                
                if (targetElement.classList.contains('animate-on-scroll')) {
                    targetElement.classList.add('animate__animated', 'animate__fadeInUp');
                }
            }
        });
    });
}

/* ========== MÓDULO DE VIDEOS ========== */
document.addEventListener('DOMContentLoaded', function() {
    // Animación de contadores
    const counters = document.querySelectorAll('.stat-count, .view-count');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if(count < target) {
            const updateCount = () => {
                const current = +counter.innerText;
                if(current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        }
    });
    
    // Lightbox para videos
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const lightbox = document.querySelector('.video-lightbox');
    const lightboxIframe = document.getElementById('lightbox-iframe');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-src');
            lightboxIframe.src = videoSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeLightbox.addEventListener('click', function() {
        lightbox.classList.remove('active');
        lightboxIframe.src = '';
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', function(e) {
        if(e.target === lightbox) {
            lightbox.classList.remove('active');
            lightboxIframe.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Efecto hover para botones de ver
    const watchButtons = document.querySelectorAll('.watch-btn');
    
    watchButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const videoBlock = this.closest('.video-block');
            const videoWrapper = videoBlock.querySelector('.video-wrapper');
            videoWrapper.style.transform = 'scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            const videoBlock = this.closest('.video-block');
            const videoWrapper = videoBlock.querySelector('.video-wrapper');
            videoWrapper.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', function() {
            const videoBlock = this.closest('.video-block');
            const thumbnail = videoBlock.querySelector('.video-thumbnail');
            thumbnail.click();
        });
    });
    
    // Efecto parallax para la sección
    window.addEventListener('scroll', function() {
        const videosSection = document.querySelector('.videos-texto');
        const scrollPosition = window.pageYOffset;
        videosSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
});

/* ========== FUNCIONES UTILITARIAS ========== */
function toggleElement(element, toggleClass, displayType, timeout) {
    if (!element) return;
    
    if (element.classList.contains(toggleClass)) {
        element.classList.remove(toggleClass);
        setTimeout(() => element.style.display = displayType, timeout);
    } else {
        element.style.display = 'block';
        setTimeout(() => element.classList.add(toggleClass), 10);
    }
}