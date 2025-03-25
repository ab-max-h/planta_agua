document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    const loginForm = document.getElementById('loginForm');

    // Efecto de despliegue del formulario
    loginButton.addEventListener('click', function(e) {
        e.stopPropagation();
        loginForm.style.display = loginForm.style.display === 'block' ? 'none' : 'block';
    });

    // Cerrar formulario al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!loginForm.contains(e.target) && e.target !== loginButton) {
            loginForm.style.display = 'none';
        }
    });

    // Efecto ripple
    loginButton.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(255,255,255,0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});