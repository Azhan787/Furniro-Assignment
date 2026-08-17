document.addEventListener('DOMContentLoaded', () => {
  /* ================= NAVBAR MOBILE TOGGLE ================= */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('active');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) toggleMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });

  /* ================= CART COUNTER ================= */
  let cartCount = 0;
  const cartCountEl = document.getElementById('cart-count');

  function bindAddToCart(btn) {
    btn.addEventListener('click', () => {
      cartCount++;
      cartCountEl.textContent = cartCount;
    });
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(bindAddToCart);

  /* ================= LIKE & SHARE BUTTONS ================= */
  document.querySelectorAll('.like-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    });
  });

  document.querySelectorAll('.share-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Furniro Furniture',
            text: 'Check out this awesome furniture item!',
            url: window.location.href,
          });
        } catch (err) {
          console.log('Share cancelled:', err);
        }
      } else {
        alert('Web Share API is not supported in this browser.');
      }
    });
  });

  /* ================= SHOW MORE PRODUCTS ================= */
  const showMoreBtn = document.getElementById('show-more-btn');
  const productsGrid = document.getElementById('products-grid');

  showMoreBtn.addEventListener('click', () => {
    const cards = Array.from(productsGrid.children).slice(0, 4);
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      const cloneCartBtn = clone.querySelector('.add-to-cart-btn');
      if (cloneCartBtn) bindAddToCart(cloneCartBtn);
      const cloneLikeBtn = clone.querySelector('.like-btn');
      if (cloneLikeBtn) {
        cloneLikeBtn.addEventListener('click', () => {
          cloneLikeBtn.classList.toggle('liked');
          const icon = cloneLikeBtn.querySelector('i');
          icon.classList.toggle('fa-regular');
          icon.classList.toggle('fa-solid');
        });
      }
      productsGrid.appendChild(clone);
    });
    showMoreBtn.style.display = 'none';
  });

  /* ================= ROOM INSPIRATION CAROUSEL ================= */
  const slider = document.getElementById('rooms-slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dots = document.querySelectorAll('.dot');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoSlideInterval;

  function updateSlider() {
    const slideWidth = slider.parentElement.clientWidth;
    slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    slides.forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      currentSlide = parseInt(e.target.dataset.slide, 10);
      updateSlider();
    });
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  window.addEventListener('resize', updateSlider);

  startAutoSlide();
  updateSlider();

  /* ================= NEWSLETTER FORM VALIDATION ================= */
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput.value.trim() !== '') {
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    }
  });
});