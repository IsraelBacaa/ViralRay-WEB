// ==================== BÚSQUEDA EN HEADER ====================
const productosData = [
    { id: '1', nombre: 'Paneles Hexagonales LED', precio: 89.99, imagen: 'images/productos/Panel hexagonal.png', descripcion: 'Diseña tu espacio con nuestros paneles hexagonales LED. Perfectos para crear efectos de luz únicos en tu setup gaming o habitación.', caracteristicas: 'Iluminación RGB 16M colores|Control mediante app móvil|Soporte asistente de voz|Mounting adhesivo incluido|Diseño modular conectable' },
    { id: '2', nombre: 'Teclado Mecánico RGB', precio: 149.99, imagen: 'images/productos/Teclado RGB.png', descripcion: 'Teclado mecánico premium con iluminación RGB personalizable. Switches azul para una experiencia táctil excepcional.', caracteristicas: 'Switches mecánicos azul|Iluminación RGB por tecla|N-Key rollover anti-ghosting|Cable USB-C desmontable|Reposabrazos aluminio antideslizante' },
    { id: '3', nombre: 'Auriculares Gaming Pro', precio: 79.99, imagen: 'images/productos/Cascos.png', descripcion: 'Auriculares gaming con sonido envolvente 7.1, micrófono retráctil e iluminación LED.', caracteristicas: 'Sonido surround 7.1|Micrófono con cancelación de ruido|Iluminación LED RGB|Compatibles PC, PS4, Xbox|Cojines memory foam' },
    { id: '4', nombre: 'Lámpara LED de Diseño', precio: 59.99, imagen: 'Lámpara_de_diseño.png', descripcion: 'Lámpara de diseño minimalista con luz LED regulable. Perfecta para escritorios y espacios de trabajo.', caracteristicas: '3 modos temperatura color|Brillo ajustable 10-100%|Pantalla LED con hora|Base estable antideslizante|Consumo 12W' },
    { id: '5', nombre: 'Pack Completo Gaming', precio: 249.99, imagen: 'images/portada-2.png', descripcion: 'Pack completo para tu setup gaming: teclado, ratón, alfombrilla y auriculares con iluminación RGB sincronizada.', caracteristicas: 'Teclado mecánico RGB|Ratón 12000 DPI|Auriculares 7.1|Alfombrilla XL 90x40cm|Cable USB centralizado' },
    { id: '6', nombre: 'Rótulo LED 3D', precio: 129.99, imagen: 'images/portada-3.png', descripcion: 'Rótulo LED 3D personalizado con la frase que tú elijas. Ilumina tu mundo con estilo.', caracteristicas: 'Led de neón flexible|16 millones de colores|Mando a distancia incluido|Tamaño personalizable|Fácil instalación' },
    { id: '7', nombre: 'Panel RGB 60cm', precio: 69.99, imagen: 'images/portada-4.png', descripcion: 'Panel LED de grandes dimensiones para crear ambientes únicos. Control remoto incluido.', caracteristicas: '60cm de longitud|Control remoto 44 teclas|16 escenas predefinidas|Compatibilidad Alexa|Sincronización con música' }
];

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('inputBusquedaHeader');
    const resultados = document.getElementById('resultadosBusquedaHeader');
    const btnLimpiar = document.getElementById('btnLimpiarBusqueda');

    if (!input) return;

    input.addEventListener('input', function () {
        const q = this.value.trim().toLowerCase();
        btnLimpiar.style.display = q ? 'flex' : 'none';
        if (!q) { resultados.classList.remove('visible'); return; }

        const encontrados = productosData.filter(p => p.nombre.toLowerCase().includes(q));
        if (encontrados.length === 0) {
            resultados.innerHTML = '<div class="sin-resultados-busqueda">No se encontraron productos</div>';
        } else {
            resultados.innerHTML = encontrados.map(p => `
                <div class="resultado-busqueda-item" onclick="abrirProductoDesde('${p.id}')">
                    <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='images/productos/Panel hexagonal.png'">
                    <div class="resultado-busqueda-info">
                        <div class="resultado-busqueda-nombre">${p.nombre}</div>
                        <div class="resultado-busqueda-precio">${p.precio.toFixed(2)}€</div>
                    </div>
                </div>
            `).join('');
        }
        resultados.classList.add('visible');
    });

    btnLimpiar.addEventListener('click', function () {
        input.value = '';
        btnLimpiar.style.display = 'none';
        resultados.classList.remove('visible');
        input.focus();
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.barra-busqueda-header')) {
            resultados.classList.remove('visible');
        }
    });
});

function abrirProductoDesde(id) {
    const p = productosData.find(x => x.id === id);
    if (!p) return;
    document.getElementById('resultadosBusquedaHeader').classList.remove('visible');
    document.getElementById('inputBusquedaHeader').value = '';
    document.getElementById('btnLimpiarBusqueda').style.display = 'none';
    abrirPaginaProducto(p.imagen, p.nombre, p.precio, p.descripcion, p.caracteristicas);
}

// ==================== PÁGINA DE DETALLE DE PRODUCTO ====================
let cantidadPaginaActual = 1;
let productoActualPagina = null;

function abrirPaginaProducto(imagen, nombre, precio, descripcion, caracteristicas) {
    const pagina = document.getElementById('paginaProductoDetalle');
    document.getElementById('imgHeroDetalle').src = imagen;
    document.getElementById('imgHeroDetalle').alt = nombre;
    document.getElementById('nombrePaginaDetalle').textContent = nombre;
    document.getElementById('precioPaginaDetalle').textContent = parseFloat(precio).toFixed(2) + '€';
    document.getElementById('descripcionPaginaDetalle').textContent = descripcion;
    document.getElementById('breadcrumbNombre').textContent = nombre.toUpperCase();
    cantidadPaginaActual = 1;
    document.getElementById('cantidadPagina').textContent = '1';

    const lista = document.getElementById('caracteristicasPaginaDetalle');
    const items = (caracteristicas || '').split('|').filter(Boolean);
    lista.innerHTML = items.map(c => `<li>${c}</li>`).join('');

    productoActualPagina = { imagen, nombre, precio: parseFloat(precio), descripcion, caracteristicas };

    pagina.classList.add('activa');
    document.body.style.overflow = 'hidden';
    pagina.scrollTop = 0;

    // Botones de acción
    document.getElementById('btnCarritoPagina').onclick = function () {
        if (typeof agregarAlCarrito === 'function') {
            for (let i = 0; i < cantidadPaginaActual; i++) {
                agregarAlCarrito({ nombre, precio: parseFloat(precio), imagen });
            }
            if (typeof mostrarNotificacion === 'function') mostrarNotificacion('¡Añadido al carrito!');
        }
    };
    document.getElementById('btnComprarPagina').onclick = function () {
        // Save only this product to sessionStorage and go to checkout
        const productoCheckout = [{
            id: Date.now().toString(),
            nombre: nombre,
            precio: parseFloat(precio),
            cantidad: cantidadPaginaActual,
            imagen: imagen
        }];
        sessionStorage.setItem('carrito', JSON.stringify(productoCheckout));
        window.location.href = 'pago.html';
    };
}

function cerrarPaginaProducto() {
    const pagina = document.getElementById('paginaProductoDetalle');
    pagina.classList.remove('activa');
    document.body.style.overflow = '';
}

function cambiarCantidadPagina(delta) {
    cantidadPaginaActual = Math.max(1, cantidadPaginaActual + delta);
    document.getElementById('cantidadPagina').textContent = cantidadPaginaActual;
}

// Override abrirDetalleProducto to open the full page instead
function abrirDetalleProducto(card) {
    const imagen = card.querySelector('img') ? card.querySelector('img').src : '';
    const nombre = card.dataset.nombre;
    const precio = card.dataset.precio;
    const descripcion = card.dataset.descripcion;
    const caracteristicas = card.dataset.caracteristicas;
    abrirPaginaProducto(imagen, nombre, precio, descripcion, caracteristicas);
}
