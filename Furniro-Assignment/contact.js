document.addEventListener('DOMContentLoaded', () => {

    /* Mobile Navbar Elements */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    /* Forms */
    const contactForm = document.getElementById('contactForm');
    const contactSuccessAlert = document.getElementById('contactSuccessAlert');
    const newsletterForm = document.getElementById('newsletterForm');
    const cartCountEl = document.getElementById('cartCount');

    /* Update Cart Counter from LocalStorage */
    function updateCartCount() {
        const storedCart = localStorage.getItem('furniroCart');
        if (storedCart && cartCountEl) {
            try {
                const cart = JSON.parse(storedCart);
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCountEl.textContent = totalItems;
            } catch (e) {
                cartCountEl.textContent = '0';
            }
        }
    }

    /* Mobile Navbar Controls */
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

    /* Search Modal Controls */
    if (searchBtn && searchModal && closeSearchBtn) {
        searchBtn.addEventListener('click', () => searchModal.classList.add('active'));
        closeSearchBtn.addEventListener('click', () => searchModal.classList.remove('active'));
    }

    /* Contact Form Validation & Submission */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            const nameInput = document.getElementById('userName');
            const emailInput = document.getElementById('userEmail');
            const messageInput = document.getElementById('message');

            const nameError = document.getElementById('userNameError');
            const emailError = document.getElementById('userEmailError');
            const messageError = document.getElementById('messageError');

            // Validate Name
            if (!nameInput.value.trim()) {
                showError(nameInput, nameError, 'Your name is required.');
                isValid = false;
            } else {
                clearError(nameInput, nameError);
            }

            // Validate Email
            if (!emailInput.value.trim()) {
                showError(emailInput, emailError, 'Email address is required.');
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                showError(emailInput, emailError, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError(emailInput, emailError);
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                showError(messageInput, messageError, 'Message is required.');
                isValid = false;
            } else {
                clearError(messageInput, messageError);
            }

            // If form valid
            if (isValid) {
                contactForm.reset();
                if (contactSuccessAlert) {
                    contactSuccessAlert.style.display = 'block';
                    setTimeout(() => {
                        contactSuccessAlert.style.display = 'none';
                    }, 5000);
                }
            }
        });
    }

    /* Helper Error Functions */
    function showError(input, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        if (input) {
            const group = input.closest('.form-group');
            if (group) group.classList.add('has-error');
        }
    }

    function clearError(input, errorElement) {
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        if (input) {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
        }
    }

    /* Newsletter Form Validation */
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newsletterEmail = document.getElementById('newsletterEmail');
            const newsletterError = document.getElementById('newsletterError');
            const val = newsletterEmail ? newsletterEmail.value.trim() : '';

            if (!val) {
                if (newsletterError) {
                    newsletterError.textContent = 'Please enter your email.';
                    newsletterError.style.display = 'block';
                }
            } else if (!validateEmail(val)) {
                if (newsletterError) {
                    newsletterError.textContent = 'Please enter a valid email.';
                    newsletterError.style.display = 'block';
                }
            } else {
                if (newsletterError) newsletterError.style.display = 'none';
                alert('Thank you for subscribing!');
                newsletterEmail.value = '';
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Execute Initialization Functions */
    updateCartCount();
});