// Script para la página de pago

document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    inicializarFormulario();
    inicializarMetodosPago();
    inicializarBotonPago();
});

// Cargar datos del carrito
function cargarCarrito() {
    // Obtener datos del carrito desde localStorage o sesión
    let articulosCarrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    
    // Si no hay datos, redirigir al inicio
    if (articulosCarrito.length === 0) {
        // Para demo, usamos datos de ejemplo
        articulosCarrito = [
            { id: '1', nombre: 'Paneles Hexagonales LED', precio: 89.99, cantidad: 1, imagen: 'images/productos/Panel hexagonal.png' },
            { id: '2', nombre: 'Teclado RGB Gaming', precio: 149.99, cantidad: 2, imagen: 'images/productos/Teclado RGB.png' }
        ];
    }

    // Calcular totales
    const subtotal = articulosCarrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Actualizar resumen lateral
    const resumenProductos = document.getElementById('resumenProductos');
    resumenProductos.innerHTML = articulosCarrito.map(item => `
        <div class="producto-resumen">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="detalles-producto-resumen">
                <span class="nombre">${item.nombre}</span>
                <span class="cantidad">x${item.cantidad}</span>
            </div>
            <span class="precio">${(item.precio * item.cantidad).toFixed(2)}€</span>
        </div>
    `).join('');

    document.getElementById('subtotalPago').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('totalPago').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('totalPaypal').textContent = subtotal.toFixed(2) + '€';

    // Actualizar sección de resumen del pedido
    const resumenPedido = document.getElementById('resumenPedido');
    resumenPedido.innerHTML = articulosCarrito.map(item => `
        <div class="item-resumen">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="info-item-resumen">
                <h4>${item.nombre}</h4>
                <p>${item.precio.toFixed(2)}€ x ${item.cantidad}</p>
            </div>
            <span class="subtotal-item">${(item.precio * item.cantidad).toFixed(2)}€</span>
        </div>
    `).join('');
}

// Inicializar formulario
function inicializarFormulario() {
    // Formatear número de tarjeta
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    numeroTarjeta.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = formattedValue;
    });

    // Formatear fecha de expiración
    const expiracion = document.getElementById('expiracion');
    expiracion.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Solo números para CVV
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Inicializar métodos de pago
function inicializarMetodosPago() {
    const metodosPago = document.querySelectorAll('input[name="metodoPago"]');
    const formularioTarjeta = document.getElementById('formularioTarjeta');
    const formularioPaypal = document.getElementById('formularioPaypal');
    const opcionesMetodos = document.querySelectorAll('.metodo-pago-opcion');

    metodosPago.forEach((metodo, indice) => {
        metodo.addEventListener('change', function() {
            // Actualizar estilo de opciones
            opcionesMetodos.forEach((opcion, i) => {
                opcion.classList.toggle('seleccionado', i === indice);
            });

            // Mostrar/ocultar formularios
            if (this.value === 'tarjeta') {
                formularioTarjeta.classList.remove('oculto');
                formularioPaypal.classList.add('oculto');
            } else {
                formularioTarjeta.classList.add('oculto');
                formularioPaypal.classList.remove('oculto');
            }
        });
    });
}

// Inicializar botón de pago
function inicializarBotonPago() {
    const botonConfirmar = document.getElementById('botonConfirmarPago');
    
    botonConfirmar.addEventListener('click', function() {
        const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
        
        if (metodoPago === 'tarjeta') {
            validarYProcesarPagoTarjeta();
        } else {
            procesarPagoPayPal();
        }
    });
}

// Validar y procesar pago con tarjeta
function validarYProcesarPagoTarjeta() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const ciudad = document.getElementById('ciudad').value;
    const cp = document.getElementById('cp').value;
    const provincia = document.getElementById('provincia').value;
    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const nombreTarjeta = document.getElementById('nombreTarjeta').value;
    const expiracion = document.getElementById('expiracion').value;
    const cvv = document.getElementById('cvv').value;

    // Validaciones básicas
    if (!nombre || !apellidos || !email || !telefono || !direccion || !ciudad || !cp || !provincia) {
        mostrarNotificacion('Por favor, completa todos los campos de envío', true);
        return;
    }

    if (!numeroTarjeta || numeroTarjeta.replace(/\s/g, '').length < 16) {
        mostrarNotificacion('Por favor, introduce un número de tarjeta válido', true);
        return;
    }

    if (!nombreTarjeta) {
        mostrarNotificacion('Por favor, introduce el nombre en la tarjeta', true);
        return;
    }

    if (!expiracion || expiracion.length < 5) {
        mostrarNotificacion('Por favor, introduce una fecha de vencimiento válida', true);
        return;
    }

    if (!cvv || cvv.length < 3) {
        mostrarNotificacion('Por favor, introduce un CVV válido', true);
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarNotificacion('Por favor, introduce un correo electrónico válido', true);
        return;
    }

    // Simular procesamiento
    procesarPago();
}

// Procesar pago PayPal
function procesarPagoPayPal() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    if (!nombre || !email) {
        mostrarNotificacion('Por favor, completa tu nombre y correo electrónico', true);
        return;
    }

    // Simular redirección a PayPal
    mostrarNotificacion('Redirigiendo a PayPal...');
    setTimeout(() => {
        procesarPago();
    }, 1500);
}

// Procesar pago (simulado)
function procesarPago() {
    const botonConfirmar = document.getElementById('botonConfirmarPago');
    botonConfirmar.disabled = true;
    botonConfirmar.textContent = 'PROCESANDO...';

    // Simular procesamiento de 2 segundos
    setTimeout(() => {
        // Generar número de pedido
        const numeroPedido = 'VR-' + Math.floor(10000 + Math.random() * 90000);
        document.getElementById('numeroPedido').textContent = numeroPedido;

        // Mostrar modal de éxito
        document.getElementById('modalExito').classList.add('activo');

        // Limpiar carrito
        sessionStorage.removeItem('carrito');
        
        // Actualizar contador del carrito si existe
        const contadorCarrito = document.querySelector('.contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = '0';
        }
    }, 2000);
}

// Mostrar notificación
function mostrarNotificacion(mensaje, esError = false) {
    const toast = document.getElementById('notificacionToast');
    const elementoMensaje = toast.querySelector('.mensaje-notificacion');
    
    elementoMensaje.textContent = mensaje;
    
    if (esError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }
    
    toast.classList.add('mostrar');
    
    setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 3000);
}

console.log('Página de pago cargada correctamente');
