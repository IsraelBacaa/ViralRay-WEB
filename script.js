// Viral Ray E-Commerce - Complete JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initGalleryHoverEffect();
    initMobileMenu();
    initSearch();
    initCart();
    initAccountSystem();
    initCarousel();
    initHeaderScroll();
    initAnimations();
    initNotificationSystem();
});

// ==================== Dynamic Gallery Hover & Scroll Effect ====================
function initGalleryHoverEffect() {
    const gallery = document.getElementById('heroGallery');
    if (!gallery) return;

    const items = gallery.querySelectorAll('.gallery-item');
    const videoItem = gallery.querySelector('.video-item');

    // Scroll-based effect for video
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            const galleryRect = gallery.getBoundingClientRect();
            const galleryCenter = galleryRect.top + galleryRect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            
            // If gallery is visible and user scrolls
            if (galleryRect.top < window.innerHeight && galleryRect.bottom > 0) {
                gallery.classList.add('video-focused');
            } else {
                gallery.classList.remove('video-focused');
            }
            
            scrollTimeout = null;
        }, 20);
    });

    // Hover-based effect (mouse takes priority over scroll)
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Remove scroll-based effect when hovering
            gallery.classList.remove('video-focused');
            
            const isVideo = this.classList.contains('video-item');

            items.forEach(i => {
                if (i === this) {
                    i.classList.add('active');
                    i.classList.remove('dimmed');
                    if (isVideo) {
                        i.style.transform = 'scale(1.5)';
                    } else {
                        i.style.transform = 'scale(1.15)';
                    }
                } else {
                    i.classList.remove('active');
                    i.classList.add('dimmed');
                    if (i.classList.contains('video-item')) {
                        i.style.transform = 'scale(0.7)';
                    } else {
                        i.style.transform = 'scale(0.95)';
                    }
                }
            });
        });

        item.addEventListener('mouseleave', function() {
            items.forEach(i => {
                i.classList.remove('active', 'dimmed');
                i.style.transform = '';
            });
        });
    });
}

// ==================== Mobile Menu ====================
function initMobileMenu() {
    const menuHamburger = document.querySelector('.menu-hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuHamburger || !navMenu) return;

    menuHamburger.addEventListener('click', () => {
        menuHamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuHamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==================== Search Functionality ====================
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            showToast(`Buscando: "${query}"`);
        } else {
            showToast('Por favor ingresa un término de búsqueda', true);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}

// ==================== Cart Functionality ====================
let cartItems = [];
let cartTotal = 0;

function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.getElementById('closeCartModal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartIcon || !cartModal) return;

    // Open cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    // Close cart modal
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Close when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            showToast('Redirigiendo al pago...');
            // Simulate checkout
            setTimeout(() => {
                cartModal.classList.remove('active');
                showToast('¡Gracias por tu compra!');
            }, 1500);
        } else {
            showToast('Tu carrito está vacío', true);
        }
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const productId = card.dataset.product;
            const productName = card.dataset.name;
            const productPrice = parseFloat(card.dataset.price);
            const productImage = card.querySelector('.product-image img').src;

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
        });
    });
}

function addToCart(product) {
    // Check if product already exists
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }

    updateCartUI();
    showToast(`"${product.name}" añadido al carrito`);

    // Animate cart count
    const cartCount = document.querySelector('.cart-count');
    cartCount.classList.add('bounce');
    setTimeout(() => cartCount.classList.remove('bounce'), 500);
}

function removeFromCart(productId) {
    const index = cartItems.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cartItems[index];
        cartItems.splice(index, 1);
        updateCartUI();
        showToast(`"${item.name}" eliminado del carrito`);
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartBody = document.getElementById('cartModalBody');
    const cartTotalEl = document.getElementById('cartTotal');

    // Update count
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart body
    if (cartItems.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <p>Tu carrito está vacío</p>
                <p style="margin-top: 10px; font-size: 12px; color: var(--neon-yellow);">¡Añade productos para comenzar!</p>
            </div>
        `;
    } else {
        cartBody.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">${item.price.toFixed(2)}€ x ${item.quantity}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
        `).join('');
    }

    // Update total
    cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = cartTotal.toFixed(2) + '€';
}

// ==================== Account System ====================
let isLoggedIn = false;
let currentUser = null;

function initAccountSystem() {
    const userIcon = document.querySelector('.user-icon');
    const accountModal = document.getElementById('accountModal');
    const closeAccountBtn = document.getElementById('closeAccountModal');
    const userDashboard = document.getElementById('userDashboard');
    const closeDashboardBtn = document.getElementById('closeDashboard');
    const logoutBtn = document.getElementById('logoutBtn');
    const accountTabs = document.querySelectorAll('.account-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (!userIcon || !accountModal) return;

    // Open account modal
    userIcon.addEventListener('click', () => {
        if (isLoggedIn) {
            userDashboard.classList.add('active');
        } else {
            accountModal.classList.add('active');
        }
    });

    // Close account modal
    closeAccountBtn.addEventListener('click', () => {
        accountModal.classList.remove('active');
    });

    // Close dashboard
    closeDashboardBtn.addEventListener('click', () => {
        userDashboard.classList.remove('active');
    });

    // Account tabs
    accountTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            accountTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });

    // Login form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simulate login
        if (email && password) {
            loginUser({
                name: email.split('@')[0],
                email: email
            });
            accountModal.classList.remove('active');
            showToast('¡Bienvenido de nuevo!');
        }
    });

    // Register form
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden', true);
            return;
        }

        if (!acceptTerms) {
            showToast('Debes aceptar los términos y condiciones', true);
            return;
        }

        // Simulate registration
        if (name && email && password) {
            loginUser({
                name: name,
                email: email
            });
            accountModal.classList.remove('active');
            showToast('¡Cuenta creada exitosamente!');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        logoutUser();
    });

    // Close modals when clicking outside
    accountModal.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            accountModal.classList.remove('active');
        }
    });

    userDashboard.addEventListener('click', (e) => {
        if (e.target === userDashboard) {
            userDashboard.classList.remove('active');
        }
    });
}

function loginUser(user) {
    isLoggedIn = true;
    currentUser = user;

    // Update dashboard
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;

    // Change user icon to logged state
    const userIcon = document.querySelector('.user-icon');
    userIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="color: var(--neon-green);">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
    `;
}

function logoutUser() {
    isLoggedIn = false;
    currentUser = null;

    // Reset user icon
    const userIcon = document.querySelector('.user-icon');
    userIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    `;

    document.getElementById('userDashboard').classList.remove('active');
    showToast('Sesión cerrada');
}

// ==================== Carousel Functionality ====================
function initCarousel() {
    const track = document.getElementById('productsTrack');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');

    if (!track || !leftArrow || !rightArrow) return;

    const scrollAmount = 305;

    rightArrow.addEventListener('click', () => {
        track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    leftArrow.addEventListener('click', () => {
        track.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Auto-scroll
    let autoScrollInterval;
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (track.scrollLeft + track.offsetWidth >= track.scrollWidth) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 5000);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);

    startAutoScroll();
}

// ==================== Header Scroll Effect ====================
function initHeaderScroll() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ==================== Animations ====================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Add ripple effect to buttons
    document.querySelectorAll('.cta-button, .submit-btn, .checkout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            const rippleKeyframes = document.createElement('style');
            rippleKeyframes.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleKeyframes);

            setTimeout(() => {
                ripple.remove();
                rippleKeyframes.remove();
            }, 600);
        });
    });

    // Social icon hover effects
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Contact floating items animation
    document.querySelectorAll('.contact-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Trust elements animation
    document.querySelectorAll('.element-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ==================== Notification System ====================
let notificationTimeout;

function initNotificationSystem() {
    // Styles are in CSS
}

function showToast(message, isError = false) {
    const toast = document.getElementById('notificationToast');
    const messageEl = toast.querySelector('.notification-message');

    // Clear previous timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    // Set message
    messageEl.textContent = message;

    // Set error style if needed
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }

    // Show toast
    toast.classList.add('show');

    // Hide after 3 seconds
    notificationTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions globally accessible for onclick handlers
window.removeFromCart = removeFromCart;

// Console log
console.log('Viral Ray E-Commerce loaded successfully!');
