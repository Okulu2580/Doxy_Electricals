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
      <a class="btn btn-outline btn-sm catalog-view-button" href="category.html?category=${category.id}" data-category-id="${category.id}">View Products</a>
    </article>
  `).join("");
}

function showDoxyCategoryIndex() {
  const heading = document.querySelector(".catalog-heading");
  const grid = document.getElementById("catalog-category-grid");
  const panel = document.getElementById("subcategory-panel");
  if (heading) heading.hidden = false;
  if (grid) grid.hidden = false;
  if (panel) {
    panel.hidden = true;
    panel.innerHTML = "";
    panel.removeAttribute("data-category-id");
  }
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
  const heading = document.querySelector(".catalog-heading");
  const grid = document.getElementById("catalog-category-grid");
  if (heading) heading.hidden = true;
  if (grid) grid.hidden = true;
  panel.hidden = false;
  panel.dataset.categoryId = categoryId;
  panel.innerHTML = `
    <div class="catalog-panel-heading">
      <div><span class="eyebrow">${category.name}</span><h3>Choose a subcategory</h3></div>
      <button class="btn btn-outline btn-sm catalog-back-button" type="button">Back to categories</button>
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
  panel.querySelector(".catalog-back-button").addEventListener("click", () => {
    if (history.state && history.state.categoryId) history.back();
    else if (document.body.dataset.categoryPage === "true") window.location.href = "index.html#categories";
    else {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      showDoxyCategoryIndex();
    }
  });
  selectSubcategory(0);
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openDoxyCategory(categoryId, updateHistory = true) {
  const category = window.DOXY_CATALOG.find((item) => item.id === categoryId);
  if (!category) return;
  if (updateHistory) history.pushState({ categoryId }, "", `#category=${categoryId}`);
  renderDoxySubcategoryPanel(categoryId);
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
  const initialCategory = new URLSearchParams(window.location.search).get("category")
    || new URLSearchParams(window.location.hash.replace(/^#/, "")).get("category");
  if (!root) {
    if (initialCategory) renderDoxySubcategoryPanel(initialCategory);
    return;
  }
  root.addEventListener("click", (event) => {
    const categoryButton = event.target.closest(".catalog-view-button");
    if (categoryButton) openDoxyCategory(categoryButton.dataset.categoryId);
    const addButton = event.target.closest(".catalog-add-button");
    if (addButton) addToCart(addButton.dataset.productId);
  });
  window.addEventListener("popstate", () => {
    const categoryId = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("category");
    if (categoryId) renderDoxySubcategoryPanel(categoryId);
    else showDoxyCategoryIndex();
  });
  const pageCategory = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("category");
  if (pageCategory) renderDoxySubcategoryPanel(pageCategory);
});

document.addEventListener("products:changed", () => {
  renderDoxyCatalogCards();
  const openPanel = document.getElementById("subcategory-panel");
  if (openPanel && !openPanel.hidden) {
    const activeCategory = openPanel.dataset.categoryId;
    if (activeCategory) renderDoxySubcategoryPanel(activeCategory);
  }
});
