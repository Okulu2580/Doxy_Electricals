/* ============================================================
   admin-app.js - dashboard shell: navigation, stats, modal helpers
   ============================================================ */

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e6e8eb'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23888' text-anchor='middle' dominant-baseline='middle'%3EDoxy Electricals%3C/text%3E%3C/svg%3E";
function adminImagePath(path) { return path && path.startsWith("./assets/") ? `../${path.slice(2)}` : (path || FALLBACK_IMAGE); }

const VIEW_TITLES = {
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  inventory: "Inventory",
  orders: "Orders",
  "store-settings": "Store Settings",
  "website-settings": "Website Settings"
};

function adminMoney(n) { return window.WhatsApp.formatPrice(n); }

function openAdminModal(html) {
  document.getElementById("admin-modal-box").innerHTML = html;
  document.getElementById("admin-modal").classList.add("open");
}
function closeAdminModal() {
  document.getElementById("admin-modal").classList.remove("open");
  document.getElementById("admin-modal-box").innerHTML = "";
}
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;

function renderDashboardView() {
  const products = window.ProductService.getProducts();
  const categories = window.CategoryService.getCategories();
  const statusCounts = { IN_STOCK: 0, LOW_STOCK: 0, OUT_OF_STOCK: 0 };
  products.forEach((p) => statusCounts[window.ProductService.getStockStatus(p)]++);
  const featuredCount = products.filter((p) => p.featured).length;
  const recent = products.slice().sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || "")).slice(0, 5);

  document.getElementById("view-mount").innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-value">${products.length}</div><div class="stat-label">Total Products</div></div>
      <div class="stat-card"><div class="stat-value">${statusCounts.IN_STOCK}</div><div class="stat-label">In Stock</div></div>
      <div class="stat-card"><div class="stat-value">${statusCounts.LOW_STOCK}</div><div class="stat-label">Low Stock</div></div>
      <div class="stat-card"><div class="stat-value">${statusCounts.OUT_OF_STOCK}</div><div class="stat-label">Out of Stock</div></div>
      <div class="stat-card"><div class="stat-value">${featuredCount}</div><div class="stat-label">Featured Products</div></div>
      <div class="stat-card"><div class="stat-value">${categories.length}</div><div class="stat-label">Total Categories</div></div>
      <div class="stat-card"><div class="stat-value">${window.OrderService.getOrders().length}</div><div class="stat-label">Order Requests</div></div>
      <div class="stat-card"><div class="stat-value">${window.OrderService.getOrders().filter(o=>o.status==="New").length}</div><div class="stat-label">New Orders</div></div>
    </div>
    <div class="admin-panel">
      <div class="admin-panel-header"><h3>Recently Added Products</h3></div>
      <table class="admin-table">
        <thead><tr><th></th><th>Name</th><th>Brand</th><th>Price</th><th>Status</th></tr></thead>
        <tbody>
          ${recent.map((p) => `
            <tr>
              <td><img src="${adminImagePath(p.image)}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"></td>
              <td>${p.name}</td>
              <td>${p.brand}</td>
              <td>${adminMoney(p.price)}</td>
              <td>${window.ProductService.stockStatusLabel(window.ProductService.getStockStatus(p))}</td>
            </tr>`).join("") || `<tr><td colspan="5">No products yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

const VIEW_RENDERERS = {
  dashboard: renderDashboardView,
  products: () => window.renderAdminProductsView(),
  categories: () => window.renderAdminCategoriesView(),
  inventory: () => window.renderAdminInventoryView(),
  orders: () => window.renderAdminOrdersView(),
  "store-settings": () => window.renderAdminStoreSettingsView(),
  "website-settings": () => window.renderAdminWebsiteSettingsView()
};

function switchView(view) {
  document.querySelectorAll("#admin-nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  document.getElementById("view-title").textContent = VIEW_TITLES[view] || view;
  closeAdminModal();
  (VIEW_RENDERERS[view] || renderDashboardView)();
  document.getElementById("admin-sidebar").classList.remove("open");
}

function initAdminApp() {
  document.querySelectorAll("#admin-nav button").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    document.getElementById("admin-sidebar").classList.toggle("open");
  });
  document.getElementById("admin-modal").addEventListener("click", (e) => {
    if (e.target.id === "admin-modal") closeAdminModal();
  });
  switchView("dashboard");
}
window.initAdminApp = initAdminApp;

document.addEventListener("DOMContentLoaded", () => {
  initAdminAuth();
  if (window.AuthService.isLoggedIn()) initAdminApp();
});

document.addEventListener("products:changed", () => {
  const activeView = document.querySelector("#admin-nav button.active")?.dataset.view;
  if (activeView === "dashboard") renderDashboardView();
});
