/* ============================================================
   admin-inventory.js - stock table with quick quantity edits
   ============================================================ */

function renderAdminInventoryView() {
  const mount = document.getElementById("view-mount");
  mount.innerHTML = `
    <div class="admin-panel">
      <div class="admin-panel-header"><h3>Inventory</h3></div>
      <table class="admin-table">
        <thead><tr><th>Image</th><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Quantity</th><th>Status</th></tr></thead>
        <tbody id="admin-inventory-tbody"></tbody>
      </table>
    </div>
  `;
  renderAdminInventoryTable();
}

document.addEventListener("products:changed", () => {
  if (document.getElementById("admin-inventory-tbody")) renderAdminInventoryTable();
});
window.renderAdminInventoryView = renderAdminInventoryView;

function renderAdminInventoryTable() {
  const products = window.ProductService.getProducts();
  const tbody = document.getElementById("admin-inventory-tbody");
  tbody.innerHTML = products.map((p) => {
    const status = window.ProductService.getStockStatus(p);
    return `
      <tr>
        <td><img src="${adminImagePath(p.image)}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"></td>
        <td>${p.name}</td>
        <td>${p.brand}</td>
        <td>${window.CategoryService.getCategory(p.category)?.name || p.category}</td>
        <td>${adminMoney(p.price)}</td>
        <td>${p.stockQuantity}</td>
        <td>${window.ProductService.stockStatusLabel(status)}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="7">No products yet.</td></tr>`;

}
