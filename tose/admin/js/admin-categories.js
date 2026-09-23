/* ============================================================
   admin-categories.js - category CRUD
   ============================================================ */

function renderAdminCategoriesView() {
  const mount = document.getElementById("view-mount");
  mount.innerHTML = `
    <div class="admin-panel">
      <div class="admin-panel-header">
        <h3>Categories</h3>
      </div>
      <table class="admin-table">
        <thead><tr><th>Icon</th><th>Name</th><th>Description</th><th># Products</th></tr></thead>
        <tbody id="admin-categories-tbody"></tbody>
      </table>
    </div>
  `;
  renderAdminCategoriesTable();
}
window.renderAdminCategoriesView = renderAdminCategoriesView;

function renderAdminCategoriesTable() {
  const categories = window.CategoryService.getCategories();
  const tbody = document.getElementById("admin-categories-tbody");
  tbody.innerHTML = categories.map((c) => `
    <tr>
      <td style="font-size:20px;">${c.icon || "⚡"}</td>
      <td>${c.name}</td>
      <td>${c.description || ""}</td>
      <td>${window.CategoryService.productCount(c.id)}</td>
    </tr>
  `).join("") || `<tr><td colspan="5">No categories yet.</td></tr>`;

}

function openCategoryForm(id) {
  const category = id ? window.CategoryService.getCategory(id) : null;
  openAdminModal(`
    <h3>${category ? "Edit Category" : "Add Category"}</h3>
    <form id="category-form">
      <div class="form-group"><label>Category Name</label><input type="text" id="cf-name" required value="${category?.name || ""}"></div>
      <div class="form-group"><label>Description</label><input type="text" id="cf-description" value="${category?.description || ""}"></div>
      <div class="form-group"><label>Icon (emoji)</label><input type="text" id="cf-icon" value="${category?.icon || "⚡"}" maxlength="4"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="cf-cancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Category</button>
      </div>
    </form>
  `);
  document.getElementById("cf-cancel").addEventListener("click", closeAdminModal);
  document.getElementById("category-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("cf-name").value.trim(),
      description: document.getElementById("cf-description").value.trim(),
      icon: document.getElementById("cf-icon").value.trim() || "⚡"
    };
    if (category) window.CategoryService.updateCategory(category.id, data);
    else window.CategoryService.addCategory(data);
    closeAdminModal();
    renderAdminCategoriesTable();
    showAdminToast(category ? "Category updated" : "Category added");
  });
}

function confirmDeleteCategory(id) {
  const category = window.CategoryService.getCategory(id);
  const count = window.CategoryService.productCount(id);
  openAdminModal(`
    <h3>Delete Category</h3>
    <p>Are you sure you want to delete <strong>${category?.name}</strong>?
    ${count ? `${count} product(s) currently use this category and will keep this category label until reassigned.` : ""}</p>
    <div class="modal-actions">
      <button class="btn btn-outline" id="del-cancel">Cancel</button>
      <button class="btn btn-danger" id="del-confirm">Delete Category</button>
    </div>
  `);
  document.getElementById("del-cancel").addEventListener("click", closeAdminModal);
  document.getElementById("del-confirm").addEventListener("click", () => {
    window.CategoryService.deleteCategory(id);
    closeAdminModal();
    renderAdminCategoriesTable();
    showAdminToast("Category deleted");
  });
}
