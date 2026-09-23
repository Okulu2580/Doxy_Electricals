/* ============================================================
   cart.js - cart page logic
   ============================================================ */

function renderCartPage() {
  const items = window.CartService.getCartItems();
  const itemsMount = document.getElementById("cart-items-mount");
  const summaryMount = document.getElementById("cart-summary-mount");

  if (!items.length) {
    itemsMount.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🛒</div>
        <p>Your cart is empty.</p>
        <a class="btn btn-primary" href="shop.html" style="margin-top:14px;">Continue Shopping</a>
      </div>`;
    summaryMount.innerHTML = "";
    return;
  }

  itemsMount.innerHTML = items.map((item) => `
    <div class="cart-item" data-id="${item.product.id}">
      <img src="${item.product.image || FALLBACK_IMAGE}" alt="${item.product.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
      <div>
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-price">${money(item.product.price)} each</div>
        <div class="qty-control" style="margin-top:8px;">
          <button class="cart-dec" data-id="${item.product.id}" type="button">−</button>
          <input type="number" value="${item.quantity}" min="1" class="cart-qty-input" data-id="${item.product.id}">
          <button class="cart-inc" data-id="${item.product.id}" type="button">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <strong>${money(item.product.price * item.quantity)}</strong>
        <button class="remove-link" data-id="${item.product.id}">Remove</button>
      </div>
    </div>
  `).join("");

  const subtotal = window.CartService.getSubtotal();
  const settings = window.SettingsService.getSettings();
  summaryMount.innerHTML = `
    <h3 style="margin-top:0;">Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="summary-note">${settings.deliveryInfo}</div>
    <div class="summary-row total"><span>Total</span><span>${money(subtotal)}</span></div>
    <a class="btn btn-outline btn-block" href="shop.html" style="margin-bottom:10px;">CONTINUE SHOPPING</a>
    <button class="btn btn-whatsapp btn-block" id="order-whatsapp-btn">ORDER VIA WHATSAPP</button>
  `;

  itemsMount.querySelectorAll(".cart-inc").forEach((b) => b.addEventListener("click", () => {
    window.CartService.increaseQuantity(b.dataset.id); renderCartPage();
  }));
  itemsMount.querySelectorAll(".cart-dec").forEach((b) => b.addEventListener("click", () => {
    window.CartService.decreaseQuantity(b.dataset.id); renderCartPage();
  }));
  itemsMount.querySelectorAll(".cart-qty-input").forEach((inp) => inp.addEventListener("change", () => {
    window.CartService.setQuantity(inp.dataset.id, inp.value); renderCartPage();
  }));
  itemsMount.querySelectorAll(".remove-link").forEach((b) => b.addEventListener("click", () => {
    window.CartService.removeItem(b.dataset.id); renderCartPage();
  }));

  document.getElementById("order-whatsapp-btn").addEventListener("click", () => {
    document.getElementById("order-info-modal").classList.add("open");
  });
}

function completeWhatsAppOrder(customerInfo) {
  const items = window.CartService.getCartItems();
  if (!items.length) return;
  const subtotal = window.CartService.getSubtotal();

  let orderId = null;
  if (customerInfo && (customerInfo.customerName || customerInfo.phone || customerInfo.location || customerInfo.notes)) {
    const order = window.OrderService.addOrder({
      customerName: customerInfo.customerName,
      phone: customerInfo.phone,
      location: customerInfo.location,
      notes: customerInfo.notes,
      items, total: subtotal
    });
    orderId = order.id;
  }

  window.WhatsApp.orderCart(items, Object.assign({}, customerInfo, { orderId }));
  document.getElementById("order-info-modal").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();

  document.getElementById("oi-skip").addEventListener("click", () => completeWhatsAppOrder(null));
  document.getElementById("oi-continue").addEventListener("click", () => {
    completeWhatsAppOrder({
      customerName: document.getElementById("oi-name").value.trim(),
      phone: document.getElementById("oi-phone").value.trim(),
      location: document.getElementById("oi-location").value.trim(),
      notes: document.getElementById("oi-notes").value.trim()
    });
  });
});

document.addEventListener("products:changed", renderCartPage);
