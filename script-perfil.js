// Viral Ray - Funcionalidad de Perfil/Cuenta

document.addEventListener('DOMContentLoaded', function() {
    inicializarSistemaCuenta();
    inicializarFormularios();
    inicializarNavegacionSecciones();
});

// ==================== Sistema de Cuenta ====================
let usuarioActual = null;

function inicializarSistemaCuenta() {
    // Verificar si hay sesión guardada
    const sesionGuardada = localStorage.getItem('viralRayUsuario');
    if (sesionGuardada) {
        usuarioActual = JSON.parse(sesionGuardada);
        mostrarPanelUsuario();
    }

    // Botón crear cuenta
    const btnCrearCuenta = document.getElementById('btnCrearCuenta');
    if (btnCrearCuenta) {
        btnCrearCuenta.addEventListener('click', () => {
            mostrarSeccion('seccionRegistro');
        });
    }

    // Botón volver al login
    const btnVolverLogin = document.getElementById('btnVolverLogin');
    if (btnVolverLogin) {
        btnVolverLogin.addEventListener('click', () => {
            mostrarSeccion('seccionIniciarSesion');
        });
    }

    // Botón volver al login desde recuperación
    const btnVolverLoginRecuperar = document.getElementById('btnVolverLoginRecuperar');
    if (btnVolverLoginRecuperar) {
        btnVolverLoginRecuperar.addEventListener('click', () => {
            mostrarSeccion('seccionIniciarSesion');
        });
    }

    // Enlace olvidó contraseña
    const btnOlvidoContrasena = document.getElementById('btnOlvidoContrasena');
    if (btnOlvidoContrasena) {
        btnOlvidoContrasena.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarSeccion('seccionRecuperar');
        });
    }

    // Botón cerrar sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }

    // Botón cerrar panel
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Botón Google Login
    const btnGoogleLogin = document.getElementById('btnGoogleLogin');
    if (btnGoogleLogin) {
        btnGoogleLogin.addEventListener('click', () => {
            mostrarNotificacion('Redirigiendo a Google...');
            // Simulación de login con Google
            setTimeout(() => {
                iniciarSesionDemo();
            }, 1000);
        });
    }
}

// ==================== Formularios ====================
function inicializarFormularios() {
    // Formulario de Login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('emailLogin').value;
            const password = document.getElementById('passwordLogin').value;

            if (email && password) {
                // Verificar reCAPTCHA
                const recaptchaResponse = grecaptcha.getResponse();
                if (recaptchaResponse.length === 0) {
                    mostrarNotificacion('Por favor completa el reCAPTCHA', true);
                    return;
                }

                // Simular inicio de sesión exitoso
                usuarioActual = {
                    nombre: 'Usuario Viral Ray',
                    email: email
                };
                localStorage.setItem('viralRayUsuario', JSON.stringify(usuarioActual));
                mostrarPanelUsuario();
                mostrarNotificacion('¡Bienvenido de vuelta!');
            } else {
                mostrarNotificacion('Por favor completa todos los campos', true);
            }
        });
    }

    // Formulario de Registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombreRegistro').value;
            const email = document.getElementById('emailRegistro').value;
            const password = document.getElementById('passwordRegistro').value;
            const confirmarPassword = document.getElementById('confirmarPassword').value;
            const aceptaTerminos = document.getElementById('checkTerminos').checked;

            if (!nombre || !email || !password || !confirmarPassword) {
                mostrarNotificacion('Por favor completa todos los campos', true);
                return;
            }

            if (password !== confirmarPassword) {
                mostrarNotificacion('Las contraseñas no coinciden', true);
                return;
            }

            if (!aceptaTerminos) {
                mostrarNotificacion('Debes aceptar los términos y condiciones', true);
                return;
            }

            // Crear cuenta
            usuarioActual = {
                nombre: nombre,
                email: email
            };
            localStorage.setItem('viralRayUsuario', JSON.stringify(usuarioActual));
            mostrarPanelUsuario();
            mostrarNotificacion('¡Cuenta creada exitosamente!');
        });
    }

    // Formulario de Recuperación
    const formRecuperar = document.getElementById('formRecuperar');
    if (formRecuperar) {
        formRecuperar.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('emailRecuperar').value;

            if (email) {
                mostrarNotificacion('Enlace enviado a tu correo');
                setTimeout(() => {
                    mostrarSeccion('seccionIniciarSesion');
                }, 2000);
            } else {
                mostrarNotificacion('Por favor ingresa tu correo', true);
            }
        });
    }

    // Formulario de Datos Personales
    const formDatosPersonales = document.getElementById('formDatosPersonales');
    if (formDatosPersonales) {
        formDatosPersonales.addEventListener('submit', (e) => {
            e.preventDefault();
            mostrarNotificacion('Datos actualizados correctamente');
        });
    }

    // Formulario de Dirección
    const formDireccion = document.getElementById('formDireccion');
    if (formDireccion) {
        formDireccion.addEventListener('submit', (e) => {
            e.preventDefault();
            mostrarNotificacion('Dirección guardada');
            formDireccion.classList.add('oculto');
        });
    }

    // Botón agregar dirección
    const btnAgregarDireccion = document.getElementById('btnAgregarDireccion');
    if (btnAgregarDireccion) {
        btnAgregarDireccion.addEventListener('click', () => {
            document.querySelector('.direccion-vacia').style.display = 'none';
            document.getElementById('formDireccion').classList.remove('oculto');
        });
    }

    // Botón cancelar dirección
    const btnCancelarDireccion = document.getElementById('btnCancelarDireccion');
    if (btnCancelarDireccion) {
        btnCancelarDireccion.addEventListener('click', () => {
            document.getElementById('formDireccion').classList.add('oculto');
            document.querySelector('.direccion-vacia').style.display = 'flex';
        });
    }
}

// ==================== Navegación de Secciones ====================
function inicializarNavegacionSecciones() {
    const opcionesMenu = document.querySelectorAll('.opcion-menu');
    
    opcionesMenu.forEach(opcion => {
        opcion.addEventListener('click', () => {
            const seccion = opcion.dataset.opcion;
            
            // Actualizar clase activa en el menú
            opcionesMenu.forEach(o => o.classList.remove('activa'));
            opcion.classList.add('activa');

            // Mostrar sección correspondiente
            switch(seccion) {
                case 'pedidos':
                    mostrarSubseccion('seccionPedidos');
                    break;
                case 'datos':
                    mostrarSubseccion('seccionMisDatos');
                    break;
                case 'direcciones':
                    mostrarSubseccion('seccionDirecciones');
                    break;
                case 'deseos':
                    mostrarSubseccion('seccionDeseos');
                    break;
            }
        });
    });
}

// ==================== Funciones Auxiliares ====================
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones principales
    const secciones = ['seccionIniciarSesion', 'seccionRegistro', 'seccionRecuperar', 'panelUsuario'];
    secciones.forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.classList.add('oculto');
        }
    });

    // Ocultar secciones de datos
    const seccionesDatos = ['seccionPedidos', 'seccionMisDatos', 'seccionDirecciones', 'seccionDeseos'];
    seccionesDatos.forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.classList.add('oculto');
        }
    });

    // Mostrar la sección seleccionada
    const seccionAMostrar = document.getElementById(seccionId);
    if (seccionAMostrar) {
        seccionAMostrar.classList.remove('oculto');
    }
}

function mostrarSubseccion(seccionId) {
    // Ocultar todas las secciones de datos
    const seccionesDatos = ['seccionPedidos', 'seccionMisDatos', 'seccionDirecciones', 'seccionDeseos'];
    seccionesDatos.forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.classList.add('oculto');
        }
    });

    // Ocultar el panel de usuario principal
    const panelUsuario = document.getElementById('panelUsuario');
    if (panelUsuario) {
        panelUsuario.classList.add('oculto');
    }

    // Mostrar la sección de datos seleccionada
    const seccionAMostrar = document.getElementById(seccionId);
    if (seccionAMostrar) {
        seccionAMostrar.classList.remove('oculto');
    }
}

function mostrarPanelUsuario() {
    // Ocultar formularios de login/registro
    const secciones = ['seccionIniciarSesion', 'seccionRegistro', 'seccionRecuperar'];
    secciones.forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.classList.add('oculto');
        }
    });

    // Mostrar panel de usuario
    const panelUsuario = document.getElementById('panelUsuario');
    if (panelUsuario) {
        panelUsuario.classList.remove('oculto');
        
        // Actualizar datos del usuario
        if (usuarioActual) {
            document.getElementById('nombreMostrar').textContent = usuarioActual.nombre;
            document.getElementById('emailMostrar').textContent = usuarioActual.email;
        }
    }
}

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('viralRayUsuario');
    mostrarSeccion('seccionIniciarSesion');
    mostrarNotificacion('Sesión cerrada');
}

function iniciarSesionDemo() {
    usuarioActual = {
        nombre: 'Usuario Demo',
        email: 'demo@viralray.es'
    };
    localStorage.setItem('viralRayUsuario', JSON.stringify(usuarioActual));
    mostrarPanelUsuario();
    mostrarNotificacion('¡Bienvenido!');
}

// ==================== Sistema de Notificaciones Toast ====================
function mostrarNotificacion(mensaje, esError = false) {
    const toast = document.getElementById('notificacionToast');
    const mensajeToast = toast.querySelector('.mensaje-notificacion');
    
    mensajeToast.textContent = mensaje;
    toast.classList.remove('error');
    
    if (esError) {
        toast.classList.add('error');
    }
    
    toast.classList.add('mostrar');
    
    setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 3000);
}

// Resolver el problema de reCAPTCHA no definido
function esperarRecaptcha() {
    return new Promise((resolve) => {
        if (typeof grecaptcha !== 'undefined') {
            resolve();
        } else {
            // Si no carga, permitir el flujo sin reCAPTCHA
            setTimeout(() => {
                resolve();
            }, 2000);
        }
    });
}