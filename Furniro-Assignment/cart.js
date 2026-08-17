document.addEventListener('DOMContentLoaded', function () {

    // 1. Mobile Hamburger Menu Toggle
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileNav = document.getElementById('mobileNav');

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', function () {
            var isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('active');
            mobileNav.setAttribute('aria-hidden', isExpanded);
        });

        // Close mobile menu when links are clicked
        var mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                mobileNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // Product Base Price Constant (Rs. 250,000.00)
    var UNIT_PRICE = 250000;

    // Cart Elements
    var itemQuantityInput = document.getElementById('itemQuantity');
    var itemSubtotalEl = document.getElementById('itemSubtotal');
    var summarySubtotalEl = document.getElementById('summarySubtotal');
    var summaryTotalEl = document.getElementById('summaryTotal');
    var deleteBtn = document.getElementById('deleteBtn');
    var cartRow = document.getElementById('cartRow');
    var emptyCartMsg = document.getElementById('emptyCartMsg');

    // Helper function to format numbers as currency (Rs. X,XXX.XX)
    function formatCurrency(amount) {
        return 'Rs. ' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // 2. Quantity Change Functionality
    if (itemQuantityInput) {
        itemQuantityInput.addEventListener('input', function () {
            var qty = parseInt(itemQuantityInput.value, 10);

            // Handle invalid/negative quantities
            if (isNaN(qty) || qty < 1) {
                qty = 1;
            }

            var newSubtotal = qty * UNIT_PRICE;
            var formattedPrice = formatCurrency(newSubtotal);

            // Update DOM text
            itemSubtotalEl.textContent = formattedPrice;
            summarySubtotalEl.textContent = formattedPrice;
            summaryTotalEl.textContent = formattedPrice;
        });
    }

    // 3. Delete Product Functionality
    if (deleteBtn && cartRow) {
        deleteBtn.addEventListener('click', function () {
            // Hide product row
            cartRow.style.display = 'none';

            // Show empty cart message
            if (emptyCartMsg) {
                emptyCartMsg.style.display = 'block';
            }

            // Reset totals to Rs. 0.00
            var zeroPrice = 'Rs. 0.00';
            summarySubtotalEl.textContent = zeroPrice;
            summaryTotalEl.textContent = zeroPrice;
        });
    }

    // 4. Newsletter Form Validation Functionality
    var newsletterForm = document.getElementById('newsletterForm');
    var newsletterEmail = document.getElementById('newsletterEmail');
    var newsletterError = document.getElementById('newsletterError');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var emailVal = newsletterEmail ? newsletterEmail.value.trim() : '';

            if (!emailVal) {
                showNewsletterMsg('Please enter your email.', 'error');
            } else if (!isValidEmail(emailVal)) {
                showNewsletterMsg('Please enter a valid email.', 'error');
            } else {
                showNewsletterMsg('Thank you for subscribing!', 'success');
                newsletterEmail.value = '';
            }
        });
    }

    function showNewsletterMsg(msg, type) {
        if (newsletterError) {
            newsletterError.textContent = msg;
            newsletterError.className = 'error-msg ' + type;
            newsletterError.style.display = 'block';
        }
    }

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

});