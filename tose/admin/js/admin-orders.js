/* ============================================================
   admin-orders.js - order requests captured before WhatsApp handoff
   ============================================================ */

const ORDER_STATUSES = ["New", "Contacted", "Confirmed", "Processing", "Completed", "Cancelled"];

function renderAdminOrdersView() {
  const mount = document.getElementById("view-mount");
  mount.innerHTML = `
    <div class="admin-panel">
      <div class="admin-panel-header"><h3>Order Requests</h3></div>
      <table class="admin-table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Total</th><th>Location</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="admin-orders-tbody"></tbody>
      </table>
    </div>
  `;
  renderAdminOrdersTable();
}
window.renderAdminOrdersView = renderAdminOrdersView;

function renderAdminOrdersTable() {
  const orders = window.OrderService.getOrders();
  const tbody = document.getElementById("admin-orders-tbody");
  tbody.innerHTML = orders.map((o) => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.phone}</td>
      <td>${adminMoney(o.total)}</td>
      <td>${o.location}</td>
      <td>${new Date(o.date).toLocaleDateString()}</td>
      <td><span class="status-pill status-${o.status}">${o.status}</span></td>
      <td>
        <div class="row-actions">
          <button data-id="${o.id}" class="view-order-btn">View</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="8">No order requests yet. Orders appear here when a customer fills in their details before ordering on WhatsApp.</td></tr>`;

  tbody.querySelectorAll(".view-order-btn").forEach((b) => b.addEventListener("click", () => openOrderDetail(b.dataset.id)));
}

function openOrderDetail(id) {
  const order = window.OrderService.getOrder(id);
  if (!order) return;
  const itemsHTML = order.items.map((i) => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${adminMoney(i.price)}</td><td>${adminMoney(i.price * i.quantity)}</td></tr>`).join("");
  openAdminModal(`
    <h3>Order ${order.id}</h3>
    <p><strong>Customer:</strong> ${order.customerName} &nbsp;|&nbsp; <strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Location:</strong> ${order.location}</p>
    ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ""}
    <table class="admin-table" style="margin-top:10px;">
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
      <tbody>${itemsHTML}</tbody>
    </table>
    <p style="text-align:right;font-weight:800;margin-top:10px;">Total: ${adminMoney(order.total)}</p>
    <div class="modal-actions">
      <button class="btn btn-outline" id="order-close">Close</button>
    </div>
  `);
  document.getElementById("order-close").addEventListener("click", closeAdminModal);
}
