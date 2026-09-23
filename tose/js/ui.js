/* ============================================================
   ui.js - shared header/footer/product-card rendering + helpers
   Used by every public page.
   ============================================================ */

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e6e8eb'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23888' text-anchor='middle' dominant-baseline='middle'%3EDoxy Electricals%3C/text%3E%3C/svg%3E";

function money(n) { return window.WhatsApp.formatPrice(n); }

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const settings = window.SettingsService.getSettings();
  mount.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand">
        <span class="brand-mark">⚡</span>
        <span class="brand-name">${settings.businessName}</span>
      </a>
      <nav class="main-nav" id="main-nav">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="shop.html#categories">Categories</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div class="header-actions">
        <form class="header-search" action="shop.html" method="get">
          <input type="search" name="q" placeholder="Search products..." aria-label="Search products">
          <button type="submit" aria-label="Search">🔍</button>
        </form>
        <button class="icon-btn" id="whatsapp-header-btn" title="Chat on WhatsApp">💬</button>
        <a class="icon-btn cart-btn" href="cart.html" title="View cart">
          🛒 <span class="cart-count" id="cart-count">0</span>
        </a>
        <button class="icon-btn hamburger" id="hamburger-btn" aria-label="Menu">☰</button>
      </div>
    </div>
  `;
  document.getElementById("whatsapp-header-btn").addEventListener("click", () => window.WhatsApp.generalEnquiry());
  document.getElementById("hamburger-btn").addEventListener("click", () => {
    document.getElementById("main-nav").classList.toggle("open");
  });
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = window.CartService.getTotalItems();
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const settings = window.SettingsService.getSettings();
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <div class="footer-inner">
      <div class="footer-col">
        <h3>${settings.businessName}</h3>
        <p>"${settings.storeTagline}"</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="shop.html#categories">Categories</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <a href="shop.html?category=cables">Cables</a>
        <a href="shop.html?category=lighting">Lighting</a>
        <a href="shop.html?category=switches-sockets">Switches & Sockets</a>
        <a href="shop.html?category=circuit-breakers">Circuit Breakers</a>
        <a href="shop.html?category=wiring-accessories">Accessories</a>
      </div>
      <div class="footer-col">
        <h4>Customer Support</h4>
        <a href="#" id="footer-whatsapp">WhatsApp: ${settings.businessPhone}</a>
        <a href="tel:${settings.businessPhone.replace(/\s+/g, "")}">Phone: ${settings.businessPhone}</a>
        <a href="mailto:${settings.email}">Email: ${settings.email}</a>
      </div>
    </div>
    <div class="footer-bottom">© ${year} ${settings.businessName}. All rights reserved.</div>
  `;
  const fw = document.getElementById("footer-whatsapp");
  if (fw) fw.addEventListener("click", (e) => { e.preventDefault(); window.WhatsApp.generalEnquiry(); });
}

function stockBadge(product) {
  const status = window.ProductService.getStockStatus(product);
  const cls = { IN_STOCK: "badge-instock", LOW_STOCK: "badge-lowstock", OUT_OF_STOCK: "badge-outstock" }[status];
  return `<span class="stock-badge ${cls}">${window.ProductService.stockStatusLabel(status)}</span>`;
}

function productCardHTML(product) {
  const status = window.ProductService.getStockStatus(product);
  const outOfStock = status === "OUT_OF_STOCK";
  const oldPriceHTML = product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : "";
  return `
    <div class="product-card" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="product-card-image">
        <img src="${product.image || FALLBACK_IMAGE}" alt="${product.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
        ${stockBadge(product)}
      </a>
      <div class="product-card-body">
        <div class="product-brand">${product.brand}</div>
        <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-price-row">
          <span class="price">${money(product.price)}</span>
          ${oldPriceHTML}
        </div>
        <div class="product-card-actions">
          ${outOfStock
            ? `<button class="btn btn-outline btn-sm ask-availability" data-id="${product.id}">Ask About Availability</button>`
            : `<button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">Add to Cart</button>`
          }
          <button class="btn btn-whatsapp btn-sm ask-whatsapp" data-id="${product.id}" title="Ask on WhatsApp">💬</button>
        </div>
      </div>
    </div>
  `;
}

function bindProductCardEvents(root) {
  (root || document).querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.CartService.addItem(btn.dataset.id, 1);
      showToast("Added to cart");
      updateCartCount();
    });
  });
  (root || document).querySelectorAll(".ask-availability").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = window.ProductService.getProduct(btn.dataset.id);
      if (product) window.WhatsApp.askAboutProduct(product, true);
    });
  });
  (root || document).querySelectorAll(".ask-whatsapp").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = window.ProductService.getProduct(btn.dataset.id);
      if (product) window.WhatsApp.askAboutProduct(product, false);
    });
  });
}

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById("tose-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tose-toast";
    toast.className = "tose-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}

document.addEventListener("cart:changed", updateCartCount);

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
