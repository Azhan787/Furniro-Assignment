document.addEventListener('DOMContentLoaded', function () {

  // starting cart items (used only if localStorage is empty)
  var defaultCart = [
    { id: 'asgaard-sofa', title: 'Asgaard sofa', price: 250000, quantity: 1, image: './images/pro3.png' },
    { id: 'lolito', title: 'Lolito', price: 7000000, quantity: 1, image: './images/cart3.png' }
  ];

  var savedCart = localStorage.getItem('furniro_cart');
  var cart = savedCart ? JSON.parse(savedCart) : defaultCart;

  // elements
  var cartDrawer = document.getElementById('cart-drawer');
  var cartOverlay = document.getElementById('cart-overlay');
  var cartIconBtn = document.getElementById('cart-icon-btn');
  var cartCloseBtn = document.getElementById('cart-close-btn');
  var cartBody = document.getElementById('cart-body');
  var cartSubtotalVal = document.getElementById('cart-subtotal-val');
  var cartCountBadge = document.getElementById('cart-count');
  var cartFooter = document.getElementById('cart-footer');

  function showToast(message) {
    var container = document.getElementById('toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  function formatCurrency(amount) {
    return 'Rs. ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function saveCart() {
    localStorage.setItem('furniro_cart', JSON.stringify(cart));
    renderCart();
  }

  function getSubtotal() {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    return total;
  }

  function getItemCount() {
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
      count += cart[i].quantity;
    }
    return count;
  }

  function renderCart() {
    if (cartCountBadge) {
      cartCountBadge.textContent = getItemCount();
    }

    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML =
        '<div class="empty-cart-view">' +
        '<i class="fa-solid fa-cart-flatbed"></i>' +
        '<p>Your cart is empty.</p>' +
        '<a href="shop.html" class="btn-continue-shop">Continue Shopping</a>' +
        '</div>';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartFooter) cartFooter.style.display = 'flex';

    var html = '';
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      html += '<div class="cart-item" data-id="' + item.id + '">' +
        '<div class="cart-item-img"><img src="' + item.image + '" alt="' + item.title + '" onerror="this.src=\'./images/pro3.png\'"></div>' +
        '<div class="cart-item-details">' +
        '<h4 class="cart-item-title">' + item.title + '</h4>' +
        '<div class="cart-item-calculation">' +
        '<span class="cart-item-qty">' + item.quantity + '</span>' +
        '<span class="cart-item-times">X</span>' +
        '<span class="cart-item-price">' + formatCurrency(item.price) + '</span>' +
        '</div>' +
        '<div class="cart-item-stepper">' +
        '<button class="btn-qty-minus" data-id="' + item.id + '">-</button>' +
        '<span>' + item.quantity + '</span>' +
        '<button class="btn-qty-plus" data-id="' + item.id + '">+</button>' +
        '</div>' +
        '</div>' +
        '<button class="cart-item-remove" data-id="' + item.id + '"><i class="fa-solid fa-circle-xmark"></i></button>' +
        '</div>';
    }
    cartBody.innerHTML = html;

    if (cartSubtotalVal) {
      cartSubtotalVal.textContent = formatCurrency(getSubtotal());
    }

    attachCartItemEvents();
  }

  function findItem(id) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) return cart[i];
    }
    return null;
  }

  function removeItem(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
  }

  function attachCartItemEvents() {
    document.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var item = findItem(id);
        removeItem(id);
        saveCart();
        if (item) showToast(item.title + ' removed from cart.');
      });
    });

    document.querySelectorAll('.btn-qty-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = findItem(btn.getAttribute('data-id'));
        if (item) {
          item.quantity++;
          saveCart();
        }
      });
    });

    document.querySelectorAll('.btn-qty-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var item = findItem(id);
        if (!item) return;

        if (item.quantity > 1) {
          item.quantity--;
        } else {
          removeItem(id);
          showToast(item.title + ' removed from cart.');
        }
        saveCart();
      });
    });
  }

  // open / close cart drawer
  window.openCart = function () {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
  };

  window.closeCart = function () {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
  };

  if (cartIconBtn) cartIconBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('active')) {
      closeCart();
    }
  });

  // add to cart - product detail page
  var addToCartBtn = document.getElementById('add-to-cart-btn');
  var qtyVal = document.getElementById('qty-val');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      var selectedQty = qtyVal ? parseInt(qtyVal.textContent) || 1 : 1;
      var existingItem = findItem('asgaard-sofa');

      if (existingItem) {
        existingItem.quantity += selectedQty;
      } else {
        cart.push({ id: 'asgaard-sofa', title: 'Asgaard sofa', price: 250000, quantity: selectedQty, image: './images/pro3.png' });
      }

      saveCart();
      showToast(selectedQty + ' x Asgaard sofa added to cart!');
      openCart();
    });
  }

  // add to cart - related product cards
  document.querySelectorAll('.card-add-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var id = btn.getAttribute('data-id');
      var title = btn.getAttribute('data-title');
      var price = parseFloat(btn.getAttribute('data-price'));
      var img = btn.getAttribute('data-img');

      var existingItem = findItem(id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ id: id, title: title, price: price, quantity: 1, image: img });
      }

      saveCart();
      showToast(title + ' added to cart!');
      openCart();
    });
  });

  // quantity stepper on product detail page
  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus = document.getElementById('qty-plus');
  var detailQty = 1;

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', function () {
      if (detailQty > 1) {
        detailQty--;
        qtyVal.textContent = detailQty;
      }
    });

    qtyPlus.addEventListener('click', function () {
      detailQty++;
      qtyVal.textContent = detailQty;
    });
  }

  // mobile navbar toggle
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    var isOpen = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('active');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu && navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });

  // product image gallery
  var mainImg = document.getElementById('main-product-img');
  var thumbBtns = document.querySelectorAll('.thumb-btn');

  thumbBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      thumbBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var newSrc = btn.getAttribute('data-img');
      if (mainImg && newSrc) {
        mainImg.src = newSrc;
      }
    });
  });

  // description / info / reviews tabs
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var targetPanel = document.getElementById(btn.getAttribute('aria-controls'));
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  renderCart();
});