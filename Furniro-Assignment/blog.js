document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Mobile Hamburger Menu Behavior
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    function toggleMenu() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.setAttribute('aria-hidden', isExpanded);
      navLinks.classList.toggle('active');
    }

    function closeMenu() {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-hidden', 'true');
      navLinks.classList.remove('active');
    }

    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // 2. Search / Filter Blog Posts
  const searchInput = document.getElementById('searchInput');
  const blogPosts = document.querySelectorAll('.post-card');
  const noPostsMessage = document.getElementById('noPostsMessage');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      blogPosts.forEach(post => {
        const title = post.getAttribute('data-title').toLowerCase();
        if (title.includes(query)) {
          post.style.display = 'flex';
          visibleCount++;
        } else {
          post.style.display = 'none';
        }
      });

      if (noPostsMessage) {
        if (visibleCount === 0) {
          noPostsMessage.style.display = 'block';
        } else {
          noPostsMessage.style.display = 'none';
        }
      }
    });
  }

  // 3. Simple Pagination Switch
  const pageButtons = document.querySelectorAll('.page-btn');

  pageButtons.forEach(button => {
    button.addEventListener('click', function () {
      pageButtons.forEach(btn => btn.classList.remove('active'));
      if (!this.classList.contains('next-btn')) {
        this.classList.add('active');
      }
    });
  });

  // 4. Newsletter Validation
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMessage = document.getElementById('newsletterMessage');

  if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailValue = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      newsletterMessage.className = 'newsletter-msg';

      if (emailValue === '') {
        newsletterMessage.textContent = 'Please enter your email.';
        newsletterMessage.classList.add('error');
      } else if (!emailRegex.test(emailValue)) {
        newsletterMessage.textContent = 'Please enter a valid email.';
        newsletterMessage.classList.add('error');
      } else {
        newsletterMessage.textContent = 'Thank you for subscribing!';
        newsletterMessage.classList.add('success');
        newsletterEmail.value = '';
      }
    });
  }

});