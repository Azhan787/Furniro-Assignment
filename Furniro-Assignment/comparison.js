document.addEventListener('DOMContentLoaded', () => {

    /* Mobile Navbar Elements */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');

    /* Add To Cart Buttons & Messages */
    const btnCartProduct1 = document.getElementById('btnCartProduct1');
    const btnCartProduct2 = document.getElementById('btnCartProduct2');
    const msgProduct1 = document.getElementById('msgProduct1');
    const msgProduct2 = document.getElementById('msgProduct2');

    /* Dropdown Selection */
    const productSelect = document.getElementById('productSelect');

    /* Newsletter Form */
    const newsletterForm = document.getElementById('newsletterForm');
    const cartCountEl = document.getElementById('cartCount');

    /* Mobile Navbar Behavior */
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
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /* Add To Cart Button Behavior */
    if (btnCartProduct1 && msgProduct1) {
        btnCartProduct1.addEventListener('click', () => {
            msgProduct1.textContent = 'Asgaard Sofa added to cart!';
            incrementCartCount();
            setTimeout(() => {
                msgProduct1.textContent = '';
            }, 3000);
        });
    }

    if (btnCartProduct2 && msgProduct2) {
        btnCartProduct2.addEventListener('click', () => {
            msgProduct2.textContent = 'Outdoor Sofa Set added to cart!';
            incrementCartCount();
            setTimeout(() => {
                msgProduct2.textContent = '';
            }, 3000);
        });
    }

    /* Simple Cart Counter Incrementation */
    function incrementCartCount() {
        if (cartCountEl) {
            let current = parseInt(cartCountEl.textContent, 10) || 0;
            cartCountEl.textContent = current + 1;
        }
    }

    /* Simple Select Behavior */
    if (productSelect) {
        productSelect.addEventListener('change', (e) => {
            const selectedVal = e.target.options[e.target.selectedIndex].text;
            if (selectedVal) {
                alert('Selected product: ' + selectedVal);
            }
        });
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
});