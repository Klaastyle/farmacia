// JavaScript for Farmacia Anna Domingo Delclós website

document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = localStorage.getItem('theme') || systemTheme;
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
    });

    function updateThemeIcon(theme) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    // Scroll Effect on Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightNavLink();
    });

    // Mobile Navbar Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileToggle.querySelector('.menu-icon');
    const closeIcon = mobileToggle.querySelector('.close-icon');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        menuIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close other items
            faqItems.forEach(i => i.classList.remove('active'));
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Shopping Cart Logic
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountBadges = document.querySelectorAll('.cart-badge');
    const cartTotalVal = document.getElementById('cart-total-val');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Cart Open/Close
    cartBtn.addEventListener('click', () => {
        cartDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
    });

    closeCart.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    });

    drawerOverlay.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    });

    // Add to cart event listeners (delegation)
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-cart') || e.target.closest('.btn-add-cart')) {
            const btn = e.target.classList.contains('btn-add-cart') ? e.target : e.target.closest('.btn-add-cart');
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            
            addToCart(id, name, price);
        }
    });

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCart();
        showToast(`"${name}" añadido al carrito`);
        // Highlight cart button briefly
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        
        // Update badge count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountBadges.forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });

        // Update Total
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotalVal.textContent = totalPrice.toFixed(2);
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    <p>Tu carrito está vacío</p>
                    <p style="font-size: 0.8rem; margin-top: 8px;">¡Añade productos de nuestro catálogo!</p>
                </div>
            `;
            checkoutBtn.style.display = 'none';
            return;
        }

        checkoutBtn.style.display = 'block';
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} €</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Eliminar del carrito">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `).join('');

        // Attach listeners to cart item buttons
        cartItemsContainer.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', () => adjustQty(btn.getAttribute('data-id'), -1));
        });
        cartItemsContainer.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', () => adjustQty(btn.getAttribute('data-id'), 1));
        });
        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => removeItem(btn.getAttribute('data-id')));
        });
    }

    function adjustQty(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeItem(id);
            } else {
                updateCart();
            }
        }
    }

    function removeItem(id) {
        const item = cart.find(item => item.id === id);
        const name = item ? item.name : 'Producto';
        cart = cart.filter(item => item.id !== id);
        updateCart();
        showToast(`"${name}" eliminado del carrito`);
    }

    // Initial render of cart
    updateCart();

    // Catalog Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Appointment Booking Modal Logic
    const bookBtns = document.querySelectorAll('.book-service-btn, .btn-hero-book');
    const bookingModal = document.getElementById('booking-modal');
    const closeModal = document.getElementById('close-modal');
    const serviceSelect = document.getElementById('modal-service');

    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preselectedService = btn.getAttribute('data-service');
            if (preselectedService && serviceSelect) {
                serviceSelect.value = preselectedService;
            }
            bookingModal.classList.add('open');
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            bookingModal.classList.remove('open');
        });
    }

    // Close modal clicking outside
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('open');
        }
    });

    // Handle Appointment Booking Submission
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('modal-name').value;
            const phone = document.getElementById('modal-phone').value;
            const service = document.getElementById('modal-service').value;
            const date = document.getElementById('modal-date').value;
            const time = document.getElementById('modal-time').value;

            if (!name || !phone || !service || !date || !time) {
                showToast('Por favor, rellene todos los campos', 'error');
                return;
            }

            // Simulate API request
            showToast('¡Cita solicitada! Le llamaremos en breve para confirmar.');
            bookingModal.classList.remove('open');
            appointmentForm.reset();
        });
    }

    // Checkout Modal Simulation
    checkoutBtn.addEventListener('click', () => {
        showToast('Procesando su pedido...', 'info');
        setTimeout(() => {
            showToast('¡Compra realizada con éxito! Recibirá un email de confirmación.');
            cart = [];
            updateCart();
            cartDrawer.classList.remove('open');
            drawerOverlay.classList.remove('open');
        }, 1500);
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            if (!name || !email || !message) {
                showToast('Por favor, rellene todos los campos', 'error');
                return;
            }

            showToast('¡Mensaje enviado! Nos pondremos en contacto con usted.');
            contactForm.reset();
        });
    }

    // Newsletter Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                showToast('¡Gracias por suscribirse a nuestro boletín!');
                newsletterForm.reset();
            }
        });
    }

    // Toast Notification Maker
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `;

        if (type === 'error') {
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            `;
        } else if (type === 'info') {
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            `;
        }

        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);
        
        // Trigger reflow for animation
        toast.offsetHeight; 
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
});
