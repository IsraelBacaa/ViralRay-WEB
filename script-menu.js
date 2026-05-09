// ===== SCRIPT MENÚ DESPLEGABLE FULLSCREEN =====

function initMenu() {
    var overlay   = document.getElementById('menu-overlay');
    var cerrar    = document.getElementById('menuCerrar');
    var hamburger = document.querySelector('.menu-desplegable');
    
    if (!overlay || !hamburger) return;

    function abrirMenu() {
        overlay.classList.remove('cerrando');
        overlay.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        hamburger.classList.add('activo');
    }
    
    function cerrarMenu() {
        overlay.classList.add('cerrando');
        overlay.classList.remove('abierto');
        hamburger.classList.remove('activo');
        setTimeout(function() {
            overlay.classList.remove('cerrando');
            document.body.style.overflow = '';
        }, 320);
    }

    // Click en hamburger
    hamburger.addEventListener('click', function() {
        overlay.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
    });
    
    // Click en botón cerrar
    cerrar.addEventListener('click', cerrarMenu);

    // Cerrar al pulsar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarMenu();
    });

    // Cerrar menú al hacer clic en enlaces internos (#anchor) y hacer scroll suave
    overlay.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = link.getAttribute('href').substring(1);
            var target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                cerrarMenu();
                setTimeout(function() {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 330);
            }
        });
    });

    // Cerrar menú al hacer clic en enlaces que van a otras páginas
    overlay.querySelectorAll('a:not([href^="#"])').forEach(function(link) {
        link.addEventListener('click', function() {
            cerrarMenu();
        });
    });

    // Submenú hover en escritorio / click en móvil
    var items = document.querySelectorAll('.menu-fullscreen-item[data-submenu]');
    items.forEach(function(item) {
        item.addEventListener('mouseenter', function() { 
            item.classList.add('activo'); 
        });
        item.addEventListener('mouseleave', function() { 
            item.classList.remove('activo'); 
        });
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 700) {
                e.stopPropagation();
                item.classList.toggle('activo');
            }
        });
    });
    
    // Detectar página actual y marcar como activa
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    overlay.querySelectorAll('a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('activo');
        }
    });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
} else {
    initMenu();
}

// Scroll correcto al cargar con hash en la URL (compensa el header fijo)
window.addEventListener("load", function() {
    if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(function() {
                var headerH = document.querySelector(".encabezado") ? document.querySelector(".encabezado").offsetHeight : 80;
                var top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
                window.scrollTo({ top: top, behavior: "smooth" });
            }, 100);
        }
    }
});
