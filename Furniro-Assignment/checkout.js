/* ==========================================================================
   DEFAULT CART FALLBACK
   ========================================================================== */
const defaultCart = [
    {
        id: 1,
        name: "Asgaard sofa",
        price: 250000,
        quantity: 1,
        image: "./images/asgaard-sofa.jpg"
    }
];

/* Currency Formatter */
function formatCurrency(amount) {
    return 'Rs. ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.00';
}

/* Fetch Cart Data */
function getCart() {
    const stored = localStorage.getItem('furniroCart');
    if (!stored) {
        localStorage.setItem('furniroCart', JSON.stringify(defaultCart));
        return defaultCart;
    }
    return JSON.parse(stored);
}

/* DOM CONTENT LOADED */
document.addEventListener('DOMContentLoaded', () => {

    /* Mobile Navbar Elements */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    /* Checkout & Cart Elements */
    const checkoutForm = document.getElementById('checkoutForm');
    const summaryItems = document.getElementById('summaryItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderTotal = document.getElementById('orderTotal');
    const cartCountEl = document.getElementById('cartCount');
    const emptyCartAlert = document.getElementById('emptyCartAlert');
    const successAlert = document.getElementById('successAlert');

    /* Newsletter Elements */
    const newsletterForm = document.getElementById('newsletterForm');

    /* Load initial cart */
    let cart = getCart();

    /* Update Navbar Counter */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }

    /* Render Order Summary */
    function renderOrderSummary() {
        if (!summaryItems) return;
        summaryItems.innerHTML = '';

        if (!cart || cart.length === 0) {
            if (checkoutForm) checkoutForm.style.display = 'none';
            if (emptyCartAlert) emptyCartAlert.style.display = 'block';
            return;
        }

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement('div');
            row.className = 'summary-item-row';
            row.innerHTML = `
                <span class="item-name">${item.name} <strong>&times; ${item.quantity}</strong></span>
                <span class="item-price">${formatCurrency(itemTotal)}</span>
            `;
            summaryItems.appendChild(row);
        });

        orderSubtotal.textContent = formatCurrency(subtotal);
        orderTotal.textContent = formatCurrency(subtotal);
    }

    /* Mobile Navbar Logic */
    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('active');
            mobileNav.setAttribute('aria-hidden', isExpanded);
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !hamburgerBtn.contains(e.target) && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mobileNav.classList.remove('active');
                if (searchModal) searchModal.classList.remove('active');
            }
        });
    }

    /* Search Overlay Controls */
    if (searchBtn && searchModal && closeSearchBtn) {
        searchBtn.addEventListener('click', () => searchModal.classList.add('active'));
        closeSearchBtn.addEventListener('click', () => searchModal.classList.remove('active'));
    }

    /* Radio Payment Toggle Display Text */
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const bankDesc = document.getElementById('bankDesc');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (bankDesc) {
                if (e.target.value === 'bank') {
                    bankDesc.style.display = 'block';
                } else {
                    bankDesc.style.display = 'none';
                }
            }
        });
    });

    /* ==========================================================================
       FORM VALIDATION & SUBMISSION
       ========================================================================== */
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Required Input Fields Validation
            const fields = [
                { id: 'firstName', name: 'First Name' },
                { id: 'lastName', name: 'Last Name' },
                { id: 'country', name: 'Country / Region' },
                { id: 'streetAddress', name: 'Street address' },
                { id: 'townCity', name: 'Town / City' },
                { id: 'province', name: 'Province' },
                { id: 'zipCode', name: 'ZIP code' },
                { id: 'phone', name: 'Phone' },
                { id: 'email', name: 'Email address', isEmail: true }
            ];

            fields.forEach(field => {
                const input = document.getElementById(field.id);
                const errorEl = document.getElementById(`${field.id}Error`);
                const parentGroup = input ? input.closest('.form-group') : null;

                if (input && errorEl && parentGroup) {
                    const value = input.value.trim();

                    if (!value) {
                        errorEl.textContent = `${field.name} is required.`;
                        errorEl.style.display = 'block';
                        parentGroup.classList.add('has-error');
                        isValid = false;
                    } else if (field.isEmail && !validateEmail(value)) {
                        errorEl.textContent = 'Please enter a valid email address.';
                        errorEl.style.display = 'block';
                        parentGroup.classList.add('has-error');
                        isValid = false;
                    } else {
                        errorEl.style.display = 'none';
                        parentGroup.classList.remove('has-error');
                    }
                }
            });

            if (isValid) {
                // Clear cart from storage upon successful checkout
                localStorage.removeItem('furniroCart');
                cart = [];
                updateCartCount();

                // Display success alert
                checkoutForm.style.display = 'none';
                if (successAlert) successAlert.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /* Newsletter Validation */
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const errorMsg = document.getElementById('newsletterError');
            const val = emailInput ? emailInput.value.trim() : '';

            if (!val) {
                errorMsg.textContent = 'Please enter your email.';
                errorMsg.style.display = 'block';
            } else if (!validateEmail(val)) {
                errorMsg.textContent = 'Please enter a valid email.';
                errorMsg.style.display = 'block';
            } else {
                errorMsg.style.display = 'none';
                alert('Thank you for subscribing!');
                emailInput.value = '';
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Initial Load Calls */
    updateCartCount();
    renderOrderSummary();
});