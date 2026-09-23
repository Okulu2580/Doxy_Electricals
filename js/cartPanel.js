/* ============================================================
   cartPanel.js - floating cart drawer and WhatsApp order flow
   ============================================================ */

function renderCartDrawer() {
  const mount = document.getElementById("cart-drawer-items");
  const total = document.getElementById("cart-drawer-total");
  const empty = document.getElementById("cart-drawer-empty");
  const orderButton = document.getElementById("cart-whatsapp-order");
  if (!mount || !total || !empty || !orderButton) return;

  const items = window.CartService.getCartItems();
  empty.hidden = items.length > 0;
  mount.innerHTML = items.map((item) => `
    <article class="drawer-cart-row">
      <div class="drawer-cart-copy">
        <strong>${item.product.name}</strong>
        <span>${window.WhatsApp.formatPrice(item.product.price)} each</span>
      </div>
      <div class="drawer-cart-controls">
        <div class="drawer-quantity" aria-label="Quantity for ${item.product.name}">
          <button type="button" data-action="decrease" data-product-id="${item.product.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-product-id="${item.product.id}" aria-label="Increase quantity">+</button>
        </div>
        <strong>${window.WhatsApp.formatPrice(item.product.price * item.quantity)}</strong>
        <button class="drawer-delete" type="button" data-action="delete" data-product-id="${item.product.id}" aria-label="Remove ${item.product.name}">🗑</button>
      </div>
    </article>
  `).join("");
  total.textContent = window.WhatsApp.formatPrice(window.CartService.getSubtotal());
  orderButton.disabled = items.length === 0;
}

function ensureCartDrawerMarkup() {
  if (!document.querySelector(".floating-cart")) {
    document.body.insertAdjacentHTML("beforeend", `
      <button class="floating-cart cart-btn" type="button" aria-label="View cart" title="View cart">
        <span class="floating-cart-icon" aria-hidden="true">🛒</span>
        <span class="floating-cart-label">Cart</span>
        <span class="cart-count floating-cart-count" id="floating-cart-count">0</span>
      </button>
    `);
  }
  if (document.getElementById("cart-drawer")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="cart-drawer" id="cart-drawer" aria-hidden="true">
      <div class="cart-drawer-backdrop" id="cart-drawer-backdrop"></div>
      <div class="cart-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <div class="cart-drawer-header">
          <div><span class="eyebrow">Your selection</span><h2 id="cart-drawer-title">Shopping cart</h2></div>
          <button class="icon-btn drawer-close" id="cart-drawer-close" type="button" aria-label="Close cart">×</button>
        </div>
        <div class="cart-drawer-content">
          <p class="cart-drawer-empty" id="cart-drawer-empty">Your cart is empty. Add products from the catalog to begin.</p>
          <div id="cart-drawer-items"></div>
        </div>
        <div class="cart-drawer-summary">
          <div class="summary-row total"><span>Grand Total</span><strong id="cart-drawer-total">₦0</strong></div>
          <button class="btn btn-whatsapp btn-block" id="cart-whatsapp-order" type="button">Order via WhatsApp</button>
        </div>
      </div>
    </aside>
  `);
}

function setCartDrawerOpen(isOpen) {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer) return;
  drawer.classList.toggle("is-open", isOpen);
  drawer.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("drawer-open", isOpen);
}

function buildWhatsAppOrderMessage() {
  const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;
  const items = window.CartService.getCartItems();
  const lines = items.map((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    return `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x ${formatNaira(item.product.price)} = *${formatNaira(lineTotal)}*`;
  });
  const total = window.CartService.getSubtotal();
  return `⚡ *New Order from Doxy Electricals*\n---------------------------------\n${lines.join("\n")}\n---------------------------------\n*Grand Total: ${formatNaira(total)}*`;
}

function completeWhatsAppOrder() {
  const items = window.CartService.getCartItems();
  if (!items.length) return;
  const number = window.WhatsApp.getNumber();
  const url = `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppOrderMessage())}`;
  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
  ensureCartDrawerMarkup();
  renderCartDrawer();
  document.addEventListener("click", (event) => {
    const headerCart = event.target.closest(".cart-btn");
    if (!headerCart) return;
    event.preventDefault();
    setCartDrawerOpen(true);
  });

  document.getElementById("cart-drawer-close")?.addEventListener("click", () => setCartDrawerOpen(false));
  document.getElementById("cart-drawer-backdrop")?.addEventListener("click", () => setCartDrawerOpen(false));
  document.getElementById("cart-whatsapp-order")?.addEventListener("click", completeWhatsAppOrder);
  document.getElementById("cart-drawer-items")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    if (button.dataset.action === "increase") window.CartService.increaseQuantity(button.dataset.productId);
    if (button.dataset.action === "decrease") window.CartService.decreaseQuantity(button.dataset.productId);
    if (button.dataset.action === "delete") window.CartService.removeItem(button.dataset.productId);
  });
});

document.addEventListener("cart:changed", renderCartDrawer);
document.addEventListener("products:changed", renderCartDrawer);
