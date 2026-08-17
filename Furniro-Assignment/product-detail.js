document.addEventListener('DOMContentLoaded', () => {
  /* ================= LOCAL STORAGE CART INIT ================= */
  let cartCount = parseInt(localStorage.getItem('furniro_cart_count')) || 0;
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
  }

  /* ================= TOAST NOTIFICATION HELPER ================= */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ================= NAVBAR MOBILE TOGGLE ================= */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Close menu when clicking navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });

  /* ================= PRODUCT THUMBNAIL SWITCHER ================= */
  const mainImg = document.getElementById('main-product-img');
  const thumbBtns = document.querySelectorAll('.thumb-btn');

  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const newSrc = btn.getAttribute('data-img');
      if (mainImg && newSrc) {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  /* ================= SIZE SELECTION ================= */
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  /* ================= COLOR SELECTION ================= */
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  /* ================= QUANTITY SELECTOR ================= */
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyVal = document.getElementById('qty-val');
  let currentQty = 1;

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.textContent = currentQty;
      }
    });

    qtyPlus.addEventListener('click', () => {
      currentQty++;
      qtyVal.textContent = currentQty;
    });
  }

  /* ================= ADD TO CART ================= */
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      cartCount += currentQty;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      localStorage.setItem('furniro_cart_count', cartCount);
      showToast(`${currentQty} x Asgaard sofa added to cart!`);
    });
  }

  // Related Products Add To Cart
  const cardCartBtns = document.querySelectorAll('.add-to-cart-btn');
  cardCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      localStorage.setItem('furniro_cart_count', cartCount);
      showToast('Item added to cart!');
    });
  });

  /* ================= COMPARE BUTTON ================= */
  const compareBtn = document.getElementById('compare-btn');
  let isCompared = false;

  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      isCompared = !isCompared;
      if (isCompared) {
        showToast('Asgaard sofa added to comparison list!');
        compareBtn.textContent = '✓ Compared';
      } else {
        showToast('Asgaard sofa removed from comparison list!');
        compareBtn.textContent = '+ Compare';
      }
    });
  }

  /* ================= DESCRIPTION TABS ================= */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = btn.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ================= RELATED PRODUCTS INTERACTIONS ================= */
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('liked')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        showToast('Added to your wishlist!');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        showToast('Removed from your wishlist!');
      }
    });
  });

  const shareBtns = document.querySelectorAll('.share-btn');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Furniro Furniture',
            text: 'Check out this furniture item on Furniro!',
            url: window.location.href,
          });
        } catch (err) {
          console.log('Share canceled:', err);
        }
      } else {
        showToast('Product link copied to clipboard!');
      }
    });
  });

  /* ================= SHOW MORE BUTTON ================= */
  const showMoreBtn = document.getElementById('show-more-btn');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      showToast('No additional related products available.');
    });
  }

  /* ================= NEWSLETTER FORM ================= */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      if (input && input.value.trim() !== '') {
        showToast('Thank you for subscribing to our newsletter!');
        input.value = '';
      }
    });
  }
});