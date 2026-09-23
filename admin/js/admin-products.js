/* ============================================================
   admin-products.js - product list, add/edit/delete
   ============================================================ */

let adminProductSearch = "";

function renderAdminProductsView() {
  const mount = document.getElementById("view-mount");
  mount.innerHTML = `
    <div class="admin-panel">
      <div class="admin-panel-header">
        <h3>All Products</h3>
        <div style="display:flex;gap:10px;">
          <input type="text" id="admin-product-search" placeholder="Search by name, brand, category or ID" style="width:280px;">
        </div>
      </div>
      <table class="admin-table">
        <thead><tr><th></th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Qty</th><th>Status</th><th>Featured</th><th>Save</th></tr></thead>
        <tbody id="admin-products-tbody"></tbody>
      </table>
    </div>
  `;
  document.getElementById("admin-product-search").addEventListener("input", (e) => {
    adminProductSearch = e.target.value;
    renderAdminProductsTable();
  });
  renderAdminProductsTable();
}
window.renderAdminProductsView = renderAdminProductsView;

function renderAdminProductsTable() {
  let products = window.ProductService.getProducts();
  if (adminProductSearch.trim()) {
    const q = adminProductSearch.trim().toLowerCase();
    products = products.filter((p) =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }
  const tbody = document.getElementById("admin-products-tbody");
  tbody.innerHTML = products.map((p) => {
    const status = window.ProductService.getStockStatus(p);
    return `
      <tr>
        <td><img src="${adminImagePath(p.image)}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"></td>
        <td>${p.name}</td>
        <td>${p.brand}</td>
        <td>${window.CategoryService.getCategory(p.category)?.name || p.category}</td>
        <td><input class="admin-product-price" data-id="${p.id}" type="number" min="0" step="50" value="${p.price}" aria-label="Price for ${p.name}" style="width:110px;"></td>
        <td><input class="admin-product-quantity" data-id="${p.id}" type="number" min="0" step="1" value="${p.stockQuantity}" aria-label="Quantity for ${p.name}" style="width:70px;"></td>
        <td><select class="admin-product-status" data-id="${p.id}" aria-label="Stock status for ${p.name}">
          <option value="IN_STOCK" ${status === "IN_STOCK" ? "selected" : ""}>In Stock</option>
          <option value="LOW_STOCK" ${status === "LOW_STOCK" ? "selected" : ""}>Low Stock</option>
          <option value="OUT_OF_STOCK" ${status === "OUT_OF_STOCK" ? "selected" : ""}>Out of Stock</option>
        </select></td>
        <td>${p.featured ? "⭐" : "—"}</td>
        <td><button class="btn btn-primary btn-sm save-product-controls" data-id="${p.id}" type="button">Save</button></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="9">No products match your search.</td></tr>`;

  tbody.querySelectorAll(".save-product-controls").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.id;
    const product = window.ProductService.getProduct(id);
    const price = Number(tbody.querySelector(`.admin-product-price[data-id="${id}"]`).value);
    const quantity = Math.max(0, Number(tbody.querySelector(`.admin-product-quantity[data-id="${id}"]`).value) || 0);
    const status = tbody.querySelector(`.admin-product-status[data-id="${id}"]`).value;
    if (!product || !Number.isFinite(price) || price < 0) return;
    window.ProductService.updateProduct(id, {
      price,
      stockQuantity: status === "OUT_OF_STOCK" ? 0 : status === "LOW_STOCK" ? Math.min(quantity || 1, 5) : Math.max(quantity, 1),
      forcedOutOfStock: status === "OUT_OF_STOCK"
    });
    renderAdminProductsTable();
    showAdminToast(`${product.name} updated`);
  }));

}

function openProductForm(id) {
  const product = id ? window.ProductService.getProduct(id) : null;
  const categories = window.CategoryService.getCategories();
  const specs = product ? Object.entries(product.specifications || {}).map(([k, v]) => `${k}: ${v}`).join("\n") : "";

  openAdminModal(`
    <h3>${product ? "Edit Product" : "Add New Product"}</h3>
    <form id="product-form">
      <div class="form-row">
        <div class="form-group"><label>Product Name</label><input type="text" id="pf-name" required value="${product?.name || ""}"></div>
        <div class="form-group"><label>Brand</label><input type="text" id="pf-brand" required value="${product?.brand || ""}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Category</label>
          <select id="pf-category">${categories.map((c) => `<option value="${c.id}" ${product?.category === c.id ? "selected" : ""}>${c.name}</option>`).join("")}</select>
        </div>
        <div class="form-group"><label>Stock Quantity</label><input type="number" id="pf-quantity" min="0" value="${product?.stockQuantity ?? 0}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Price (${window.SettingsService.getSettings().currency})</label><input type="number" id="pf-price" required min="0" value="${product?.price ?? ""}"></div>
        <div class="form-group"><label>Old Price (optional)</label><input type="number" id="pf-oldprice" min="0" value="${product?.oldPrice ?? ""}"></div>
      </div>
      <div class="form-group"><label>Product Image URL</label><input type="text" id="pf-image" value="${product?.image || ""}" placeholder="https://..."></div>
      <div class="form-group"><label>Short Description</label><input type="text" id="pf-shortdesc" value="${product?.shortDescription || ""}"></div>
      <div class="form-group"><label>Full Description</label><textarea id="pf-description" rows="3">${product?.description || ""}</textarea></div>
      <div class="form-group"><label>Specifications (one per line, "Key: Value")</label><textarea id="pf-specs" rows="3">${specs}</textarea></div>
      <div class="form-group"><label>Keywords (comma separated)</label><input type="text" id="pf-keywords" value="${(product?.keywords || []).join(", ")}"></div>
      <div class="checkbox-row"><input type="checkbox" id="pf-featured" ${product?.featured ? "checked" : ""}><label for="pf-featured">Featured Product</label></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="pf-cancel">Cancel</button>
        <button type="submit" class="btn btn-primary">SAVE PRODUCT</button>
      </div>
    </form>
  `);

  document.getElementById("pf-cancel").addEventListener("click", closeAdminModal);
  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const specsText = document.getElementById("pf-specs").value.trim();
    const specifications = {};
    specsText.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) specifications[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });

    const data = {
      name: document.getElementById("pf-name").value.trim(),
      brand: document.getElementById("pf-brand").value.trim(),
      category: document.getElementById("pf-category").value,
      stockQuantity: Number(document.getElementById("pf-quantity").value) || 0,
      price: Number(document.getElementById("pf-price").value) || 0,
      oldPrice: document.getElementById("pf-oldprice").value ? Number(document.getElementById("pf-oldprice").value) : null,
      image: document.getElementById("pf-image").value.trim(),
      shortDescription: document.getElementById("pf-shortdesc").value.trim(),
      description: document.getElementById("pf-description").value.trim(),
      specifications,
      keywords: document.getElementById("pf-keywords").value.split(",").map((k) => k.trim()).filter(Boolean),
      featured: document.getElementById("pf-featured").checked
    };

    if (product) window.ProductService.updateProduct(product.id, data);
    else window.ProductService.addProduct(data);

    closeAdminModal();
    renderAdminProductsTable();
    showAdminToast(product ? "Product updated" : "Product added");
  });
}

function confirmDeleteProduct(id) {
  const product = window.ProductService.getProduct(id);
  openAdminModal(`
    <h3>Delete Product</h3>
    <p>Are you sure you want to delete <strong>${product?.name}</strong>? This cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn btn-outline" id="del-cancel">Cancel</button>
      <button class="btn btn-danger" id="del-confirm">Delete Product</button>
    </div>
  `);
  document.getElementById("del-cancel").addEventListener("click", closeAdminModal);
  document.getElementById("del-confirm").addEventListener("click", () => {
    window.ProductService.deleteProduct(id);
    closeAdminModal();
    renderAdminProductsTable();
    showAdminToast("Product deleted");
  });
}

let adminToastTimer = null;
function showAdminToast(msg) {
  let toast = document.getElementById("tose-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tose-toast";
    toast.className = "tose-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
window.showAdminToast = showAdminToast;

document.addEventListener("products:changed", () => {
  if (document.getElementById("admin-products-tbody")) renderAdminProductsTable();
});
