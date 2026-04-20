// Viral Ray E-Commerce - Funcionalidad Completa de JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los componentes
    inicializarEfectoGaleria();
    inicializarMenuMovil();
    inicializarBusqueda();
    inicializarCarrito();
    inicializarSistemaCuenta();
    inicializarDesplazamientoEncabezado();
    inicializarNavegacionActiva();
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
    const menuHamburguesa = document.querySelector('.menu-desplegable');
    const menuNavegacion = document.querySelector('.menu-navegacion');
    const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');

    if (!menuHamburguesa || !menuNavegacion) return;

    menuHamburguesa.addEventListener('click', () => {
        menuHamburguesa.classList.toggle('activo');
        menuNavegacion.classList.toggle('activo');
    });

    // Marcar como activo al hacer clic en un enlace
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            // Remover clase activo de todos los enlaces
            enlacesNavegacion.forEach(enlace => {
                enlace.classList.remove('activo');
            });
            
            // Agregar clase activo al enlace clickeado
            this.classList.add('activo');
            
            // Cerrar menú móvil si está abierto
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
    const botonFinalizarCompra = document.getElementById('botonPagar');

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

    // Botón de finalizar compra - ahora redirige a pago.html
    botonFinalizarCompra.addEventListener('click', () => {
        if (articulosCarrito.length > 0) {
            // Guardar carrito en sessionStorage
            sessionStorage.setItem('carrito', JSON.stringify(articulosCarrito));
            // Redirigir a la página de pago
            window.location.href = 'pago.html';
        } else {
            mostrarNotificacion('Tu carrito está vacío', true);
        }
    });

    // Botones de agregar al carrito (eliminados - ahora se usan desde onclick en HTML)
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
                <p style="margin-top: 10px; font-size: 12px; color: #FF6600;">¡Añade productos para comenzar!</p>
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
                    <div class="cantidad-container">
                        <button class="boton-cantidad menos" onclick="cambiarCantidad('${articulo.id}', -1)">−</button>
                        <span class="cantidad-valor">${articulo.cantidad}</span>
                        <button class="boton-cantidad mas" onclick="cambiarCantidad('${articulo.id}', 1)">+</button>
                    </div>
                    <p class="precio">${(articulo.precio * articulo.cantidad).toFixed(2)}€</p>
                </div>
                <button class="boton-eliminar-articulo" onclick="eliminarDelCarrito('${articulo.id}')">&times;</button>
            </div>
        `).join('');
    }

    // Actualizar total
    totalCarrito = articulosCarrito.reduce((suma, articulo) => suma + (articulo.precio * articulo.cantidad), 0);
    elementoTotalCarrito.textContent = totalCarrito.toFixed(2) + '€';
}

// Función para cambiar la cantidad de un artículo
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

// ==================== Sistema de Cuenta ====================
let sesionIniciada = false;
let usuarioActual = null;

// Cargar sesión desde localStorage al iniciar
function cargarSesion() {
    const sesionGuardada = localStorage.getItem('viralRayUsuario');
    if (sesionGuardada) {
        const datos = JSON.parse(sesionGuardada);
        sesionIniciada = true;
        usuarioActual = datos;

        // Actualizar icono
        actualizarIconoUsuario(true, datos);

        // Actualizar panel de usuario si existe
        const nombreUsuario = document.getElementById('nombreUsuario');
        const correoUsuario = document.getElementById('correoUsuario');
        if (nombreUsuario) nombreUsuario.textContent = datos.nombre;
        if (correoUsuario) correoUsuario.textContent = datos.correo;

        return true;
    }
    return false;
}

// Guardar sesión en localStorage
function guardarSesion() {
    localStorage.setItem('viralRayUsuario', JSON.stringify(usuarioActual));
}

// Eliminar sesión de localStorage
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
    const pestanasCuenta = document.querySelectorAll('.pestana-cuenta');
    const formularioInicioSesion = document.getElementById('formularioInicioSesion');
    const formularioRegistro = document.getElementById('formularioRegistro');

    if (!iconoUsuario || !modalCuenta) return;

    // Cargar sesión guardada
    cargarSesion();

    // Abrir modal de cuenta desde icono de usuario
    iconoUsuario.addEventListener('click', () => {
        if (sesionIniciada) {
            panelUsuario.classList.add('activo');
        } else {
            modalCuenta.classList.add('activo');
        }
    });

    // Abrir modal de cuenta desde enlaces del footer
    const enlacesCuenta = document.querySelectorAll('.enlace-cuenta');
    enlacesCuenta.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            if (sesionIniciada) {
                // Si ya hay sesión, abrir panel de usuario
                panelUsuario.classList.add('activo');
            } else {
                // Si no hay sesión, abrir modal de inicio de sesión
                modalCuenta.classList.add('activo');
            }
        });
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

    // Guardar sesión en localStorage
    guardarSesion();

    // Actualizar panel de usuario
    if (document.getElementById('nombreUsuario')) {
        document.getElementById('nombreUsuario').textContent = usuario.nombre;
    }
    if (document.getElementById('correoUsuario')) {
        document.getElementById('correoUsuario').textContent = usuario.correo;
    }

    // Cambiar icono de usuario a estado conectado
    actualizarIconoUsuario(true, usuario);
}

function cerrarSesionUsuario() {
    sesionIniciada = false;
    usuarioActual = null;

    // Eliminar sesión de localStorage
    eliminarSesion();

    // Restablecer icono de usuario
    actualizarIconoUsuario(false);

    // Cerrar panel de usuario si existe
    const panelUsuario = document.getElementById('panelUsuario');
    if (panelUsuario) {
        panelUsuario.classList.remove('activo');
    }

    mostrarNotificacion('Sesión cerrada');
}

// Actualizar icono de usuario según estado de sesión
function actualizarIconoUsuario(sesionActiva, usuario = null) {
    const iconoUsuario = document.querySelector('.icono-usuario');
    if (!iconoUsuario) return;

    if (sesionActiva && usuario) {
        iconoUsuario.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="color: var(--neon-green);">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
    } else {
        iconoUsuario.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        `;
    }
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

// ==================== Navegación Activa según Sección Visible ====================
function inicializarNavegacionActiva() {
    const secciones = document.querySelectorAll('section[id]');
    const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');

    const opcionesObservador = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const idSeccion = entrada.target.getAttribute('id');
                
                // Remover clase activo de todos los enlaces
                enlacesNavegacion.forEach(enlace => {
                    enlace.classList.remove('activo');
                });
                
                // Agregar clase activo al enlace correspondiente
                const enlaceActivo = document.querySelector(`.enlace-navegacion[href="#${idSeccion}"]`);
                if (enlaceActivo) {
                    enlaceActivo.classList.add('activo');
                }
            }
        });
    }, opcionesObservador);

    secciones.forEach(seccion => {
        observador.observe(seccion);
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
window.moverCarrusel = moverCarrusel;
window.agregarAlCarritoDesdeBoton = agregarAlCarritoDesdeBoton;
window.mostrarNotificacion = mostrarNotificacion;
window.cambiarCantidad = cambiarCantidad;

// Función global para agregar al carrito desde botón HTML
function agregarAlCarritoDesdeBoton(boton) {
    const tarjeta = boton.closest('.tarjeta-producto');
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
}

// Función global para mover el carrusel
function moverCarrusel(direccion) {
    const pista = document.getElementById('pistaProductos');
    if (!pista) return;
    
    const tarjeta = pista.querySelector('.tarjeta-producto');
    if (!tarjeta) return;
    
    const anchoTarjeta = tarjeta.offsetWidth + 25; // ancho + gap
    pista.scrollBy({
        left: anchoTarjeta * direccion,
        behavior: 'smooth'
    });
}

// Registro en consola
console.log('¡Viral Ray E-Commerce cargado correctamente!');
