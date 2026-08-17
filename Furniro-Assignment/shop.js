document.addEventListener('DOMContentLoaded', () => {

    /* Navbar Elements */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const cartCountEl = document.getElementById('cartCount');

    /* Cart Toast & Add To Cart Buttons */
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartToast = document.getElementById('cartToast');

    /* Pagination Buttons */
    const pageButtons = document.querySelectorAll('.page-btn');

    /* Newsletter Form */
    const newsletterForm = document.getElementById('newsletterForm');

    /* Mobile Hamburger Menu Functionality */
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

    /* Add To Cart Functionality */
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update cart counter icon
            if (cartCountEl) {
                let count = parseInt(cartCountEl.textContent, 10) || 0;
                cartCountEl.textContent = count + 1;
            }

            // Show Toast Notification
            if (cartToast) {
                cartToast.classList.add('show');
                setTimeout(() => {
                    cartToast.classList.remove('show');
                }, 2500);
            }
        });
    });

    /* Simple Pagination State Switching */
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pageButtons.forEach(b => b.classList.remove('active'));
            if (!btn.classList.contains('page-btn-next')) {
                btn.classList.add('active');
            } else {
                // If "Next" is clicked, set page 2 active as example
                const secondPageBtn = pageButtons[1];
                if (secondPageBtn) secondPageBtn.classList.add('active');
            }
        });
    });

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