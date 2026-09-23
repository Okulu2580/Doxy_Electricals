/* Catalog UI for category, subcategory and product browsing. */

function doxyCatalogPrice(amount) {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}

function doxyCategoryDescription(id) {
  return {
    "electrical-cables": "Copper, armoured and flexible cables for Nigerian wiring jobs.",
    "switches-sockets": "Everyday wiring accessories for homes, shops and project sites.",
    "circuit-breakers": "Protection devices for safer residential and industrial circuits.",
    lighting: "Efficient lighting for interiors, compounds and commercial sites.",
    "distribution-boards": "Consumer units, three-phase boards and enclosures.",
    "electrical-conduits": "Reliable cable routing for walls, decking and surface runs.",
    "wiring-accessories": "The small essentials that make installations neat and dependable.",
    "electrical-tools": "Practical hand tools, testers and power tools for installers."
  }[id] || "Electrical supplies for your next project.";
}

function renderDoxyCatalogCards() {
  const mount = document.getElementById("catalog-category-grid");
  if (!mount) return;
  const count = window.DoxyCatalogService.getProducts().length;
  const countMount = document.getElementById("catalog-count");
  if (countMount) countMount.textContent = `${count} listed products`;
  mount.innerHTML = window.DOXY_CATALOG.map((category) => `
    <article class="category-card catalog-category-card">
      <div class="category-icon">${category.icon}</div>
      <h3>${category.name}</h3>
      <p>${doxyCategoryDescription(category.id)}</p>
      <div class="category-subcategory-preview">${category.subcategories.length} subcategories</div>
      <button class="btn btn-outline btn-sm catalog-view-button" type="button" data-category-id="${category.id}">View Products</button>
    </article>
  `).join("");
}

function renderDoxyProduct(product) {
  const productRecord = window.ProductService.getProduct(product.id);
  const liveProduct = productRecord || product;
  const status = productRecord ? window.ProductService.getStockStatus(productRecord) : (product.inStock ? "IN_STOCK" : "OUT_OF_STOCK");
  const inStock = status !== "OUT_OF_STOCK";
  const fallbackImage = typeof FALLBACK_IMAGE !== "undefined" ? FALLBACK_IMAGE : "";
  const image = liveProduct.image || product.image || fallbackImage;
  return `
    <article class="catalog-product-card">
      <div class="catalog-product-image">
        <img src="${image}" alt="${liveProduct.name}" onerror="this.onerror=null;this.src='${fallbackImage}'">
      </div>
      <div class="catalog-product-copy">
        <span class="catalog-product-brand">${liveProduct.brand} · ${liveProduct.unit || product.unit}</span>
        <h4>${liveProduct.name}</h4>
        <strong>${doxyCatalogPrice(liveProduct.price)}</strong>
      </div>
      <div class="catalog-product-footer">
        <span class="availability-badge ${inStock ? "is-in-stock" : "is-out-of-stock"}">${inStock ? "In Stock" : "Out of Stock"}</span>
        <button class="btn btn-primary btn-sm catalog-add-button" type="button" data-product-id="${product.id}" ${inStock ? "" : "disabled"}>${inStock ? "Add to Cart" : "Unavailable"}</button>
      </div>
    </article>
  `;
}

function renderDoxySubcategoryPanel(categoryId) {
  const category = window.DOXY_CATALOG.find((item) => item.id === categoryId);
  const panel = document.getElementById("subcategory-panel");
  if (!category || !panel) return;
  panel.hidden = false;
  panel.dataset.categoryId = categoryId;
  panel.innerHTML = `
    <div class="catalog-panel-heading">
      <div><span class="eyebrow">${category.name}</span><h3>Choose a subcategory</h3></div>
      <button class="icon-btn catalog-close-button" type="button" aria-label="Close products panel">×</button>
    </div>
    <div class="subcategory-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${category.subcategories.map((subcategory, index) => `
        <button class="subcategory-button ${index === 0 ? "active" : ""}" type="button" data-subcategory-index="${index}">
          <span class="subcategory-copy"><strong>${subcategory.name}</strong><small>${subcategory.products.length ? `${subcategory.products.length} listed products` : "Products coming soon"}</small></span>
          <em>${subcategory.products.length}</em>
        </button>
      `).join("")}
    </div>
    <div id="catalog-products" class="catalog-products"></div>
  `;

  const selectSubcategory = (index) => {
    panel.querySelectorAll(".subcategory-button").forEach((button) => button.classList.toggle("active", button.dataset.subcategoryIndex === String(index)));
    const products = category.subcategories[index].products;
    panel.querySelector("#catalog-products").innerHTML = products.length
      ? `<div class="catalog-product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${products.map(renderDoxyProduct).join("")}</div>`
      : `<p class="empty-state">This subcategory is ready for inventory and will be available soon.</p>`;
  };

  panel.querySelectorAll(".subcategory-button").forEach((button) => button.addEventListener("click", () => selectSubcategory(button.dataset.subcategoryIndex)));
  panel.querySelector(".catalog-close-button").addEventListener("click", () => { panel.hidden = true; });
  selectSubcategory(0);
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function addToCart(id) {
  const product = window.ProductService.getProduct(id);
  if (!product || window.ProductService.getStockStatus(product) === "OUT_OF_STOCK") return false;
  window.CartService.addItem(id, 1);
  if (typeof showToast === "function") showToast(`${product.name} added to cart`);
  return true;
}

window.addToCart = addToCart;

document.addEventListener("DOMContentLoaded", () => {
  window.DoxyCatalogService.syncProducts();
  renderDoxyCatalogCards();
  const root = document.getElementById("categories");
  if (!root) return;
  root.addEventListener("click", (event) => {
    const categoryButton = event.target.closest(".catalog-view-button");
    if (categoryButton) renderDoxySubcategoryPanel(categoryButton.dataset.categoryId);
    const addButton = event.target.closest(".catalog-add-button");
    if (addButton) addToCart(addButton.dataset.productId);
  });
});

document.addEventListener("products:changed", () => {
  renderDoxyCatalogCards();
  const openPanel = document.getElementById("subcategory-panel");
  if (openPanel && !openPanel.hidden) {
    const activeCategory = openPanel.dataset.categoryId;
    if (activeCategory) renderDoxySubcategoryPanel(activeCategory);
  }
});
