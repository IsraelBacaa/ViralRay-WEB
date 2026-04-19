// Viral Ray E-Commerce - Funcionalidad Completa de JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los componentes
    inicializarEfectoGaleria();
    inicializarMenuMovil();
    inicializarBusqueda();
    inicializarCarrito();
    inicializarSistemaCuenta();
    inicializarCarrusel();
    inicializarDesplazamientoEncabezado();
    inicializarAnimaciones();
    inicializarSistemaNotificaciones();
});

// ==================== Efecto Hover de Galería y Efecto de Desplazamiento ====================
function inicializarEfectoGaleria() {
    const galeria = document.getElementById('galeriaHeroe');
    if (!galeria) return;

    const elementos = galeria.querySelectorAll('.elemento-galeria');
    const elementoVideo = galeria.querySelector('.elemento-video');

    // Efecto basado en desplazamiento para video
    let tiempoExcedidoDesplazamiento;
    window.addEventListener('scroll', () => {
        if (tiempoExcedidoDesplazamiento) return;
        
        tiempoExcedidoDesplazamiento = setTimeout(() => {
            const rectanguloGaleria = galeria.getBoundingClientRect();
            const centroGaleria = rectanguloGaleria.top + rectanguloGaleria.height / 2;
            const centroVentana = window.innerHeight / 2;
            
            // Si la galería es visible y el usuario desplaza
            if (rectanguloGaleria.top < window.innerHeight && rectanguloGaleria.bottom > 0) {
                galeria.classList.add('video-enfocado');
            } else {
                galeria.classList.remove('video-enfocado');
            }
            
            tiempoExcedidoDesplazamiento = null;
        }, 20);
    });

    // Efecto basado en hover (mouse tiene prioridad sobre desplazamiento)
    elementos.forEach(elemento => {
        elemento.addEventListener('mouseenter', function() {
            // Eliminar efecto basado en desplazamiento al hacer hover
            galeria.classList.remove('video-enfocado');
            
            const esVideo = this.classList.contains('elemento-video');

            elementos.forEach(i => {
                if (i === this) {
                    i.classList.add('activo');
                    i.classList.remove('atenuado');
                    if (esVideo) {
                        i.style.transform = 'scale(1.5)';
                    } else {
                        i.style.transform = 'scale(1.15)';
                    }
                } else {
                    i.classList.remove('activo');
                    i.classList.add('atenuado');
                    if (i.classList.contains('elemento-video')) {
                        i.style.transform = 'scale(0.7)';
                    } else {
                        i.style.transform = 'scale(0.95)';
                    }
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
    const menuHamburguesa = document.querySelector('.menu-hamburguesa');
    const menuNavegacion = document.querySelector('.menu-navegacion');

    if (!menuHamburguesa || !menuNavegacion) return;

    menuHamburguesa.addEventListener('click', () => {
        menuHamburguesa.classList.toggle('activo');
        menuNavegacion.classList.toggle('activo');
    });

    // Cerrar menú al hacer clic en un enlace
    menuNavegacion.querySelectorAll('.enlace-navegacion').forEach(enlace => {
        enlace.addEventListener('click', () => {
            menuHamburguesa.classList.remove('activo');
            menuNavegacion.classList.remove('activo');
        });
    });
}

// ==================== Funcionalidad de Búsqueda ====================
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
        if (e.key === 'Enter') {
            botonBusqueda.click();
        }
    });
}

// ==================== Funcionalidad del Carrito ====================
let articulosCarrito = [];
let totalCarrito = 0;

function inicializarCarrito() {
    const iconoCarrito = document.querySelector('.icono-carrito');
    const modalCarrito = document.getElementById('modalCarrito');
    const botonCerrarCarrito = document.getElementById('cerrarModalCarrito');
    const botonFinalizarCompra = document.getElementById('botonFinalizarCompra');

    if (!iconoCarrito || !modalCarrito) return;

    // Abrir modal del carrito
    iconoCarrito.addEventListener('click', () => {
        modalCarrito.classList.add('activo');
    });

    // Cerrar modal del carrito
    botonCerrarCarrito.addEventListener('click', () => {
        modalCarrito.classList.remove('activo');
    });

    // Cerrar al hacer clic fuera
    modalCarrito.addEventListener('click', (e) => {
        if (e.target === modalCarrito) {
            modalCarrito.classList.remove('activo');
        }
    });

    // Botón de finalizar compra
    botonFinalizarCompra.addEventListener('click', () => {
        if (articulosCarrito.length > 0) {
            mostrarNotificacion('Redirigiendo al pago...');
            // Simular checkout
            setTimeout(() => {
                modalCarrito.classList.remove('activo');
                mostrarNotificacion('¡Gracias por tu compra!');
            }, 1500);
        } else {
            mostrarNotificacion('Tu carrito está vacío', true);
        }
    });

    // Botones de agregar al carrito
    document.querySelectorAll('.boton-agregar-carrito').forEach((btn, indice) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tarjeta = btn.closest('.tarjeta-producto');
            const idProducto = tarjeta.dataset.producto;
            const nombreProducto = tarjeta.dataset.nombre;
            const precioProducto = parseFloat(tarjeta.dataset.precio);
            const imagenProducto = tarjeta.querySelector('.imagen-producto img').src;

            agregarAlCarrito({
                id: idProducto,
                nombre: nombreProducto,
                precio: precioProducto,
                imagen: imagenProducto
            });
        });
    });
}

function agregarAlCarrito(producto) {
    // Verificar si el producto ya existe
    const articuloExistente = articulosCarrito.find(articulo => articulo.id === producto.id);

    if (articuloExistente) {
        articuloExistente.cantidad++;
    } else {
        producto.cantidad = 1;
        articulosCarrito.push(producto);
    }

    actualizarInterfazCarrito();
    mostrarNotificacion(`"${producto.nombre}" añadido al carrito`);

    // Animar contador del carrito
    const contadorCarrito = document.querySelector('.contador-carrito');
    contadorCarrito.classList.add('rebote');
    setTimeout(() => contadorCarrito.classList.remove('rebote'), 500);
}

function eliminarDelCarrito(idProducto) {
    const indice = articulosCarrito.findIndex(articulo => articulo.id === idProducto);
    if (indice > -1) {
        const articulo = articulosCarrito[indice];
        articulosCarrito.splice(indice, 1);
        actualizarInterfazCarrito();
        mostrarNotificacion(`"${articulo.nombre}" eliminado del carrito`);
    }
}

function actualizarInterfazCarrito() {
    const contadorCarrito = document.querySelector('.contador-carrito');
    const cuerpoCarrito = document.getElementById('cuerpoModalCarrito');
    const elementoTotalCarrito = document.getElementById('totalCarrito');

    // Actualizar contador
    const totalArticulos = articulosCarrito.reduce((suma, articulo) => suma + articulo.cantidad, 0);
    contadorCarrito.textContent = totalArticulos;

    // Actualizar cuerpo del carrito
    if (articulosCarrito.length === 0) {
        cuerpoCarrito.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <p style="margin-top: 10px; font-size: 12px; color: var(--neon-yellow);">¡Añade productos para comenzar!</p>
            </div>
        `;
    } else {
        cuerpoCarrito.innerHTML = articulosCarrito.map(articulo => `
            <div class="articulo-carrito" data-id="${articulo.id}">
                <div class="imagen-articulo-carrito">
                    <img src="${articulo.imagen}" alt="${articulo.nombre}">
                </div>
                <div class="detalles-articulo-carrito">
                    <h4>${articulo.nombre}</h4>
                    <p class="precio">${articulo.precio.toFixed(2)}€ x ${articulo.cantidad}</p>
                </div>
                <button class="boton-eliminar-articulo" onclick="eliminarDelCarrito('${articulo.id}')">&times;</button>
            </div>
        `).join('');
    }

    // Actualizar total
    totalCarrito = articulosCarrito.reduce((suma, articulo) => suma + (articulo.precio * articulo.cantidad), 0);
    elementoTotalCarrito.textContent = totalCarrito.toFixed(2) + '€';
}

// ==================== Sistema de Cuenta ====================
let sesionIniciada = false;
let usuarioActual = null;

function inicializarSistemaCuenta() {
    const iconoUsuario = document.querySelector('.icono-usuario');
    const modalCuenta = document.getElementById('modalCuenta');
    const botonCerrarCuenta = document.getElementById('cerrarModalCuenta');
    const panelUsuario = document.getElementById('panelUsuario');
    const botonCerrarPanel = document.getElementById('cerrarPanel');
    const botonCerrarSesion = document.getElementById('botonCerrarSesion');
    const pestanasCuenta = document.querySelectorAll('.pestana-cuenta');
    const formularioInicioSesion = document.getElementById('formularioInicioSesion');
    const formularioRegistro = document.getElementById('formularioRegistro');

    if (!iconoUsuario || !modalCuenta) return;

    // Abrir modal de cuenta
    iconoUsuario.addEventListener('click', () => {
        if (sesionIniciada) {
            panelUsuario.classList.add('activo');
        } else {
            modalCuenta.classList.add('activo');
        }
    });

    // Cerrar modal de cuenta
    botonCerrarCuenta.addEventListener('click', () => {
        modalCuenta.classList.remove('activo');
    });

    // Cerrar panel de usuario
    botonCerrarPanel.addEventListener('click', () => {
        panelUsuario.classList.remove('activo');
    });

    // Pestañas de cuenta
    pestanasCuenta.forEach(pestana => {
        pestana.addEventListener('click', () => {
            pestanasCuenta.forEach(t => t.classList.remove('activo'));
            pestana.classList.add('activo');

            if (pestana.dataset.pestana === 'inicioSesion') {
                formularioInicioSesion.classList.remove('oculto');
                formularioRegistro.classList.add('oculto');
            } else {
                formularioInicioSesion.classList.add('oculto');
                formularioRegistro.classList.remove('oculto');
            }
        });
    });

    // Formulario de inicio de sesión
    formularioInicioSesion.addEventListener('submit', (e) => {
        e.preventDefault();
        const correo = document.getElementById('correoInicioSesion').value;
        const contrasena = document.getElementById('contrasenaInicioSesion').value;

        // Simular inicio de sesión
        if (correo && contrasena) {
            iniciarSesionUsuario({
                nombre: correo.split('@')[0],
                correo: correo
            });
            modalCuenta.classList.remove('activo');
            mostrarNotificacion('¡Bienvenido de nuevo!');
        }
    });

    // Formulario de registro
    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreRegistro').value;
        const correo = document.getElementById('correoRegistro').value;
        const contrasena = document.getElementById('contrasenaRegistro').value;
        const confirmarContrasena = document.getElementById('confirmarContrasenaRegistro').value;
        const aceptarTerminos = document.getElementById('aceptarTerminos').checked;

        if (contrasena !== confirmarContrasena) {
            mostrarNotificacion('Las contraseñas no coinciden', true);
            return;
        }

        if (!aceptarTerminos) {
            mostrarNotificacion('Debes aceptar los términos y condiciones', true);
            return;
        }

        // Simular registro
        if (nombre && correo && contrasena) {
            iniciarSesionUsuario({
                nombre: nombre,
                correo: correo
            });
            modalCuenta.classList.remove('activo');
            mostrarNotificacion('¡Cuenta creada exitosamente!');
        }
    });

    // Cerrar sesión
    botonCerrarSesion.addEventListener('click', () => {
        cerrarSesionUsuario();
    });

    // Cerrar modales al hacer clic fuera
    modalCuenta.addEventListener('click', (e) => {
        if (e.target === modalCuenta) {
            modalCuenta.classList.remove('activo');
        }
    });

    panelUsuario.addEventListener('click', (e) => {
        if (e.target === panelUsuario) {
            panelUsuario.classList.remove('activo');
        }
    });
}

function iniciarSesionUsuario(usuario) {
    sesionIniciada = true;
    usuarioActual = usuario;

    // Actualizar panel de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre;
    document.getElementById('correoUsuario').textContent = usuario.correo;

    // Cambiar icono de usuario a estado conectado
    const iconoUsuario = document.querySelector('.icono-usuario');
    iconoUsuario.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="color: var(--neon-green);">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
    `;
}

function cerrarSesionUsuario() {
    sesionIniciada = false;
    usuarioActual = null;

    // Restablecer icono de usuario
    const iconoUsuario = document.querySelector('.icono-usuario');
    iconoUsuario.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    `;

    document.getElementById('panelUsuario').classList.remove('activo');
    mostrarNotificacion('Sesión cerrada');
}

// ==================== Funcionalidad del Carrusel ====================
function inicializarCarrusel() {
    const pista = document.getElementById('pistaProductos');
    const flechaIzquierda = document.querySelector('.flecha-carrusel.izquierda');
    const flechaDerecha = document.querySelector('.flecha-carrusel.derecha');

    if(!pista || !flechaIzquierda || !flechaDerecha) return;

    const cantidadDesplazamiento = 305;

    flechaDerecha.addEventListener('click', () => {
        pista.scrollBy({
            left: cantidadDesplazamiento,
            behavior: 'smooth'
        });
    });

    flechaIzquierda.addEventListener('click', () => {
        pista.scrollBy({
            left: -cantidadDesplazamiento,
            behavior: 'smooth'
        });
    });

    // Desplazamiento automático
    let intervaloDesplazamientoAutomatico;
    const iniciarDesplazamientoAutomatico = () => {
        intervaloDesplazamientoAutomatico = setInterval(() => {
            if (pista.scrollLeft + pista.offsetWidth >= pista.scrollWidth) {
                pista.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                pista.scrollBy({ left: cantidadDesplazamiento, behavior: 'smooth' });
            }
        }, 5000);
    };

    const detenerDesplazamientoAutomatico = () => {
        clearInterval(intervaloDesplazamientoAutomatico);
    };

    pista.addEventListener('mouseenter', detenerDesplazamientoAutomatico);
    pista.addEventListener('mouseleave', iniciarDesplazamientoAutomatico);

    iniciarDesplazamientoAutomatico();
}

// ==================== Efecto de Desplazamiento del Encabezado ====================
function inicializarDesplazamientoEncabezado() {
    const encabezado = document.querySelector('.encabezado');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            encabezado.classList.add('desplazado');
        } else {
            encabezado.classList.remove('desplazado');
        }
    });
}

// ==================== Animaciones ====================
function inicializarAnimaciones() {
    // Intersection Observer para animaciones de desplazamiento
    const opcionesObservador = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('animar-entrada');
            }
        });
    }, opcionesObservador);

    // Observar secciones
    document.querySelectorAll('section').forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observador.observe(seccion);
    });

    // Agregar estilos de animación
    const estilo = document.createElement('style');
    estilo.textContent = `
        .animar-entrada {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(estilo);

    // Agregar efecto ripple a los botones
    document.querySelectorAll('.boton-cta, .boton-enviar, .boton-finalizar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const tamano = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${tamano}px;
                height: ${tamano}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            const keyframesRipple = document.createElement('style');
            keyframesRipple.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(keyframesRipple);

            setTimeout(() => {
                ripple.remove();
                keyframesRipple.remove();
            }, 600);
        });
    });

    // Efectos hover de iconos sociales
    document.querySelectorAll('.icono-social').forEach(icono => {
        icono.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });

        icono.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Animación de elementos flotantes de contacto
    document.querySelectorAll('.elemento-contacto').forEach((elemento, indice) => {
        elemento.style.animationDelay = `${indice * 0.2}s`;
    });

    // Animación de elementos de confianza
    document.querySelectorAll('.tarjeta-elemento').forEach((tarjeta, indice) => {
        tarjeta.style.animationDelay = `${indice * 0.1}s`;
    });
}

// ==================== Sistema de Notificaciones ====================
let tiempoExcedidoNotificacion;

function inicializarSistemaNotificaciones() {
    // Los estilos están en CSS
}

function mostrarNotificacion(mensaje, esError = false) {
    const toast = document.getElementById('notificacionToast');
    const elementoMensaje = toast.querySelector('.mensaje-notificacion');

    // Limpiar tiempo excedido anterior
    if (tiempoExcedidoNotificacion) {
        clearTimeout(tiempoExcedidoNotificacion);
    }

    // Establecer mensaje
    elementoMensaje.textContent = mensaje;

    // Establecer estilo de error si es necesario
    if (esError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }

    // Mostrar toast
    toast.classList.add('mostrar');

    // Ocultar después de 3 segundos
    tiempoExcedidoNotificacion = setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 3000);
}

// Hacer funciones globalmente accesibles para manejadores onclick
window.eliminarDelCarrito = eliminarDelCarrito;

// Registro en consola
console.log('¡Viral Ray E-Commerce cargado correctamente!');
