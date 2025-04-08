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

function initTripticoObserver() {
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
    document.querySelectorAll('a.nav-item').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}