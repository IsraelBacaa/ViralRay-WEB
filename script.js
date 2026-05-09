// Viral Ray E-Commerce - Funcionalidad Completa de JavaScript

document.addEventListener('DOMContentLoaded', function() {
    inicializarEfectoGaleria();
    inicializarMenuMovil();
    inicializarBusqueda();
    inicializarCarrito();
    inicializarSistemaCuenta();
    inicializarDesplazamientoEncabezado();
    inicializarNavegacionActiva();
    inicializarAnimaciones();
    inicializarSistemaNotificaciones();
    inicializarPopupBienvenida();
    inicializarMostrarCrearCuenta();
});

// ==================== Popup de Bienvenida ====================
function inicializarPopupBienvenida() {
    const popup = document.getElementById('popupBienvenida');
    if (!popup) return;

    // Mostrar solo si no se ha aceptado/rechazado antes
    const cookieDecision = localStorage.getItem('viralrayCookies');
    if (cookieDecision) return;

    setTimeout(() => {
        popup.classList.add('activo');
    }, 800);

    function cerrarCookieBanner() {
        popup.classList.remove('activo');
    }

    const btnAceptar = document.getElementById('cookieAceptar');
    if (btnAceptar) {
        btnAceptar.addEventListener('click', () => {
            localStorage.setItem('viralrayCookies', 'all');
            cerrarCookieBanner();
        });
    }

    const btnRechazar = document.getElementById('cookieRechazar');
    if (btnRechazar) {
        btnRechazar.addEventListener('click', () => {
            localStorage.setItem('viralrayCookies', 'necessary');
            cerrarCookieBanner();
        });
    }
}

// ==================== Mostrar formulario de crear cuenta ====================
function inicializarMostrarCrearCuenta() {
    const btnMostrar = document.getElementById('mostrarCrearCuenta');
    const formLogin = document.getElementById('formularioIniciarSesion');
    const formCrear = document.getElementById('formularioCrearCuenta');
    const btnVolver = document.getElementById('volverInicioSesion');

    if (btnMostrar && formLogin && formCrear) {
        btnMostrar.addEventListener('click', () => {
            formLogin.classList.add('oculto');
            formCrear.classList.remove('oculto');
        });
    }

    if (btnVolver && formLogin && formCrear) {
        btnVolver.addEventListener('click', () => {
            formCrear.classList.add('oculto');
            formLogin.classList.remove('oculto');
        });
    }
}

// ==================== Efecto Hover de Galería ====================
function inicializarEfectoGaleria() {
    const galeria = document.getElementById('galeriaHeroe');
    if (!galeria) return;

    const elementos = galeria.querySelectorAll('.elemento-galeria');

    let tiempoExcedidoDesplazamiento;
    window.addEventListener('scroll', () => {
        if (tiempoExcedidoDesplazamiento) return;
        tiempoExcedidoDesplazamiento = setTimeout(() => {
            const rectanguloGaleria = galeria.getBoundingClientRect();
            if (rectanguloGaleria.top < window.innerHeight && rectanguloGaleria.bottom > 0) {
                galeria.classList.add('video-enfocado');
            } else {
                galeria.classList.remove('video-enfocado');
            }
            tiempoExcedidoDesplazamiento = null;
        }, 20);
    });

    elementos.forEach(elemento => {
        elemento.addEventListener('mouseenter', function() {
            galeria.classList.remove('video-enfocado');
            const esVideo = this.classList.contains('elemento-video');
            elementos.forEach(i => {
                if (i === this) {
                    i.classList.add('activo');
                    i.classList.remove('atenuado');
                    i.style.transform = esVideo ? 'scale(1.5)' : 'scale(1.15)';
                } else {
                    i.classList.remove('activo');
                    i.classList.add('atenuado');
                    i.style.transform = i.classList.contains('elemento-video') ? 'scale(0.7)' : 'scale(0.95)';
                }
            });
        });

        elemento.addEventListener('mouseleave', function() {
            elementos.forEach(i => {
                i.classList.remove('activo', 'atenuado');
                i.style.transform = '';
            });
        });
    });
}

// ==================== Menú Móvil ====================
function inicializarMenuMovil() {
    const menuHamburguesa = document.querySelector('.menu-desplegable');
    const menuNavegacion = document.querySelector('.menu-navegacion');
    const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');

    if (!menuHamburguesa || !menuNavegacion) return;

    menuHamburguesa.addEventListener('click', () => {
        menuHamburguesa.classList.toggle('activo');
        menuNavegacion.classList.toggle('activo');
    });

    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', function() {
            enlacesNavegacion.forEach(e => e.classList.remove('activo'));
            this.classList.add('activo');
            menuHamburguesa.classList.remove('activo');
            menuNavegacion.classList.remove('activo');
        });
    });
}

// ==================== Búsqueda ====================
function inicializarBusqueda() {
    const entradaBusqueda = document.querySelector('.entrada-busqueda');
    const botonBusqueda = document.querySelector('.boton-busqueda');
    if (!entradaBusqueda || !botonBusqueda) return;

    botonBusqueda.addEventListener('click', () => {
        const consulta = entradaBusqueda.value.trim();
        if (consulta) {
            mostrarNotificacion(`Buscando: "${consulta}"`);
        } else {
            mostrarNotificacion('Por favor ingresa un término de búsqueda', true);
        }
    });

    entradaBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') botonBusqueda.click();
    });
}

// ==================== Carrito de Compras ====================
let articulosCarrito = [];
let totalCarrito = 0;

function inicializarCarrito() {
    const iconoCarrito = document.querySelector('.icono-carrito');
    const modalCarrito = document.getElementById('modalCarrito');
    const botonCerrarCarrito = document.getElementById('cerrarModalCarrito');
    const botonFinalizarCompra = document.getElementById('botonPagar');

    if (!iconoCarrito || !modalCarrito) return;

    iconoCarrito.addEventListener('click', () => {
        modalCarrito.classList.add('activo');
    });

    botonCerrarCarrito.addEventListener('click', () => {
        modalCarrito.classList.remove('activo');
    });

    modalCarrito.addEventListener('click', (e) => {
        if (e.target === modalCarrito) modalCarrito.classList.remove('activo');
    });

    botonFinalizarCompra.addEventListener('click', () => {
        if (articulosCarrito.length > 0) {
            // Asegurar que cada artículo tiene id y cantidad definidos
            const carritoParaPago = articulosCarrito.map(a => ({
                id: a.id || a.nombre.toLowerCase().replace(/\s+/g, '-'),
                nombre: a.nombre,
                precio: a.precio,
                cantidad: a.cantidad || 1,
                imagen: a.imagen || 'images/productos/Panel hexagonal.png'
            }));
            sessionStorage.setItem('carrito', JSON.stringify(carritoParaPago));
            window.location.href = 'pago.html';
        } else {
            mostrarNotificacion('Tu carrito está vacío', true);
        }
    });
}

function agregarAlCarrito(producto) {
    // Garantizar siempre un id único basado en el nombre si no viene uno
    if (!producto.id) {
        producto.id = producto.nombre.toLowerCase().replace(/\s+/g, '-');
    }
    const articuloExistente = articulosCarrito.find(a => a.id === producto.id);
    if (articuloExistente) {
        articuloExistente.cantidad++;
    } else {
        producto.cantidad = 1;
        articulosCarrito.push({ ...producto });
    }
    actualizarInterfazCarrito();
    mostrarNotificacion(`"${producto.nombre}" añadido al carrito`);

    const contadorCarrito = document.querySelector('.contador-carrito');
    if (contadorCarrito) {
        contadorCarrito.classList.add('rebote');
        setTimeout(() => contadorCarrito.classList.remove('rebote'), 500);
    }
}

function eliminarDelCarrito(idProducto) {
    const indice = articulosCarrito.findIndex(a => a.id === idProducto);
    if (indice > -1) {
        const articulo = articulosCarrito[indice];
        articulosCarrito.splice(indice, 1);
        actualizarInterfazCarrito();
        mostrarNotificacion(`"${articulo.nombre}" eliminado del carrito`);
    }
}

function cambiarCantidad(idProducto, cambio) {
    const articulo = articulosCarrito.find(a => a.id === idProducto);
    if (articulo) {
        articulo.cantidad += cambio;
        if (articulo.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            actualizarInterfazCarrito();
        }
    }
}

function actualizarInterfazCarrito() {
    const contadorCarrito = document.querySelector('.contador-carrito');
    const cuerpoCarrito = document.getElementById('cuerpoModalCarrito');
    const elementoTotalCarrito = document.getElementById('totalCarrito');

    if (!cuerpoCarrito || !elementoTotalCarrito) return;

    const totalArticulos = articulosCarrito.reduce((suma, a) => suma + a.cantidad, 0);
    if (contadorCarrito) contadorCarrito.textContent = totalArticulos;

    if (articulosCarrito.length === 0) {
        cuerpoCarrito.innerHTML = `
            <div class="carrito-vacio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="opacity:0.4;margin-bottom:12px">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <p>Tu carrito está vacío</p>
                <p style="margin-top:8px;font-size:12px;color:rgba(255,215,0,0.6)">¡Añade productos para comenzar!</p>
            </div>
        `;
    } else {
        cuerpoCarrito.innerHTML = articulosCarrito.map(articulo => `
            <div class="articulo-carrito" data-id="${articulo.id}">
                <div class="imagen-articulo-carrito">
                    <img src="${articulo.imagen}" alt="${articulo.nombre}" onerror="this.src='images/productos/Panel hexagonal.png'">
                </div>
                <div class="detalles-articulo-carrito">
                    <h4>${articulo.nombre}</h4>
                    <div class="cantidad-container">
                        <button class="boton-cantidad menos" onclick="cambiarCantidad('${articulo.id}', -1)">&#8722;</button>
                        <span class="cantidad-valor">${articulo.cantidad}</span>
                        <button class="boton-cantidad mas" onclick="cambiarCantidad('${articulo.id}', 1)">+</button>
                    </div>
                    <p class="precio">${(articulo.precio * articulo.cantidad).toFixed(2)}&euro;</p>
                </div>
                <button class="boton-eliminar-articulo" onclick="eliminarDelCarrito('${articulo.id}')">&times;</button>
            </div>
        `).join('');
    }

    totalCarrito = articulosCarrito.reduce((suma, a) => suma + (a.precio * a.cantidad), 0);
    elementoTotalCarrito.textContent = totalCarrito.toFixed(2) + '\u20AC';
}

// ==================== Sistema de Cuenta ====================
let sesionIniciada = false;
let usuarioActual = null;

function cargarSesion() {
    const sesionGuardada = localStorage.getItem('viralRayUsuario');
    if (sesionGuardada) {
        const datos = JSON.parse(sesionGuardada);
        sesionIniciada = true;
        usuarioActual = datos;
        actualizarIconoUsuario(true, datos);
        const nombreUsuario = document.getElementById('nombreUsuario');
        const correoUsuario = document.getElementById('correoUsuario');
        if (nombreUsuario) nombreUsuario.textContent = datos.nombre;
        if (correoUsuario) correoUsuario.textContent = datos.correo;
        return true;
    }
    return false;
}

function guardarSesion() {
    localStorage.setItem('viralRayUsuario', JSON.stringify(usuarioActual));
}

function eliminarSesion() {
    localStorage.removeItem('viralRayUsuario');
}

function inicializarSistemaCuenta() {
    const iconoUsuario = document.querySelector('.icono-usuario');
    const modalCuenta = document.getElementById('modalCuenta');
    const botonCerrarCuenta = document.getElementById('cerrarModalCuenta');
    const panelUsuario = document.getElementById('panelUsuario');
    const botonCerrarPanel = document.getElementById('cerrarPanel');
    const botonCerrarSesion = document.getElementById('botonCerrarSesion');
    const formularioInicioSesion = document.getElementById('formularioIniciarSesion');
    const formularioRegistro = document.getElementById('formularioCrearCuenta');

    if (!iconoUsuario || !modalCuenta) return;

    cargarSesion();

    iconoUsuario.addEventListener('click', () => {
        if (sesionIniciada) {
            panelUsuario.classList.add('activo');
        } else {
            modalCuenta.classList.add('activo');
        }
    });

    if (botonCerrarCuenta) {
        botonCerrarCuenta.addEventListener('click', () => modalCuenta.classList.remove('activo'));
    }

    if (botonCerrarPanel) {
        botonCerrarPanel.addEventListener('click', () => panelUsuario.classList.remove('activo'));
    }

    if (formularioInicioSesion) {
        formularioInicioSesion.addEventListener('submit', (e) => {
            e.preventDefault();
            const correoEl = document.getElementById('correoIniciarSesion') || document.getElementById('correoInicioSesion');
            const contrasenaEl = document.getElementById('contrasenaIniciarSesion') || document.getElementById('contrasenaInicioSesion');
            const correo = correoEl ? correoEl.value : '';
            const contrasena = contrasenaEl ? contrasenaEl.value : '';
            if (correo && contrasena) {
                iniciarSesionUsuario({ nombre: correo.split('@')[0], correo });
                modalCuenta.classList.remove('activo');
                mostrarNotificacion('¡Bienvenido de nuevo!');
            }
        });
    }

    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombreRegistro')?.value;
            const correo = document.getElementById('correoRegistro')?.value;
            const contrasena = document.getElementById('contrasenaRegistro')?.value;
            const confirmar = document.getElementById('confirmarContrasena')?.value;
            const terminos = document.getElementById('aceptarTerminos')?.checked;

            if (contrasena !== confirmar) { mostrarNotificacion('Las contraseñas no coinciden', true); return; }
            if (!terminos) { mostrarNotificacion('Debes aceptar los términos', true); return; }
            if (nombre && correo && contrasena) {
                iniciarSesionUsuario({ nombre, correo });
                modalCuenta.classList.remove('activo');
                mostrarNotificacion('¡Cuenta creada exitosamente!');
            }
        });
    }

    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', () => cerrarSesionUsuario());
    }

    modalCuenta.addEventListener('click', (e) => {
        if (e.target === modalCuenta) modalCuenta.classList.remove('activo');
    });

    if (panelUsuario) {
        panelUsuario.addEventListener('click', (e) => {
            if (e.target === panelUsuario) panelUsuario.classList.remove('activo');
        });
    }
}

function iniciarSesionUsuario(usuario) {
    sesionIniciada = true;
    usuarioActual = usuario;
    guardarSesion();
    if (document.getElementById('nombreUsuario')) document.getElementById('nombreUsuario').textContent = usuario.nombre;
    if (document.getElementById('correoUsuario')) document.getElementById('correoUsuario').textContent = usuario.correo;
    actualizarIconoUsuario(true, usuario);
}

function cerrarSesionUsuario() {
    sesionIniciada = false;
    usuarioActual = null;
    eliminarSesion();
    actualizarIconoUsuario(false);
    const panelUsuario = document.getElementById('panelUsuario');
    if (panelUsuario) panelUsuario.classList.remove('activo');
    mostrarNotificacion('Sesión cerrada');
}

function actualizarIconoUsuario(sesionActiva, usuario = null) {
    const iconoUsuario = document.querySelector('.icono-usuario');
    if (!iconoUsuario) return;
    if (sesionActiva && usuario) {
        iconoUsuario.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="color:var(--neon-green)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    } else {
        iconoUsuario.innerHTML = `<img src="images/icon-user.svg" alt="Mi Cuenta" class="icono-svg">`;
    }
}

// ==================== Desplazamiento del Encabezado ====================
function inicializarDesplazamientoEncabezado() {
    const encabezado = document.querySelector('.encabezado');
    window.addEventListener('scroll', () => {
        encabezado.classList.toggle('desplazado', window.pageYOffset > 50);
    });
}

// ==================== Navegación Activa ====================
function inicializarNavegacionActiva() {
    const secciones = document.querySelectorAll('section[id]');
    const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const idSeccion = entrada.target.getAttribute('id');
                enlacesNavegacion.forEach(e => e.classList.remove('activo'));
                const enlaceActivo = document.querySelector(`.enlace-navegacion[href="#${idSeccion}"]`);
                if (enlaceActivo) enlaceActivo.classList.add('activo');
            }
        });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    secciones.forEach(s => observador.observe(s));
}

// ==================== Animaciones ====================
function inicializarAnimaciones() {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) entrada.target.classList.add('animar-entrada');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observador.observe(seccion);
    });

    const estilo = document.createElement('style');
    estilo.textContent = `.animar-entrada { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(estilo);
}

// ==================== Notificaciones ====================
let tiempoExcedidoNotificacion;

function inicializarSistemaNotificaciones() {}

function mostrarNotificacion(mensaje, esError = false) {
    const toast = document.getElementById('notificacionToast');
    if (!toast) return;
    const elementoMensaje = toast.querySelector('.mensaje-notificacion');
    if (tiempoExcedidoNotificacion) clearTimeout(tiempoExcedidoNotificacion);
    elementoMensaje.textContent = mensaje;
    toast.classList.toggle('error', esError);
    toast.classList.add('mostrar');
    tiempoExcedidoNotificacion = setTimeout(() => toast.classList.remove('mostrar'), 3000);
}

// ==================== Carrusel ====================
function moverCarrusel(direccion) {
    const pista = document.getElementById('pistaProductos');
    if (!pista) return;
    const tarjeta = pista.querySelector('.tarjeta-producto');
    if (!tarjeta) return;
    const anchoTarjeta = tarjeta.offsetWidth + 25;
    pista.scrollBy({ left: anchoTarjeta * direccion, behavior: 'smooth' });
}

// ==================== Agregar al carrito desde botón ====================
function agregarAlCarritoDesdeBoton(boton) {
    const tarjeta = boton.closest('.tarjeta-producto');
    const idProducto = tarjeta.dataset.producto;
    const nombreProducto = tarjeta.dataset.nombre;
    const precioProducto = parseFloat(tarjeta.dataset.precio);
    const imagenProducto = tarjeta.querySelector('.imagen-producto img').src;
    agregarAlCarrito({ id: idProducto, nombre: nombreProducto, precio: precioProducto, imagen: imagenProducto });
}

// ==================== Exposición global ====================
window.eliminarDelCarrito = eliminarDelCarrito;
window.moverCarrusel = moverCarrusel;
window.agregarAlCarritoDesdeBoton = agregarAlCarritoDesdeBoton;
window.mostrarNotificacion = mostrarNotificacion;
window.cambiarCantidad = cambiarCantidad;
window.agregarAlCarrito = agregarAlCarrito;

console.log('Viral Ray E-Commerce cargado correctamente!');
