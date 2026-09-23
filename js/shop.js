/* ============================================================
   shop.js - shop page: search, filtering, sorting
   ============================================================ */

const shopState = {
  query: "",
  category: "",
  brands: [],
  availability: [],
  minPrice: null,
  maxPrice: null,
  sort: "featured"
};

function initShopFromURL() {
  shopState.query = qs("q") || "";
  shopState.category = qs("category") || "";
}

function renderShopFilters() {
  const catMount = document.getElementById("filter-categories");
  const categories = window.CategoryService.getCategories();
  catMount.innerHTML = `<label><input type="radio" name="category" value="" ${shopState.category === "" ? "checked" : ""}> All Categories</label>` +
    categories.map((c) => `<label><input type="radio" name="category" value="${c.id}" ${shopState.category === c.id ? "checked" : ""}> ${c.name}</label>`).join("");

  const brandMount = document.getElementById("filter-brands");
  const brands = window.ProductService.getBrands();
  brandMount.innerHTML = brands.map((b) => `<label><input type="checkbox" name="brand" value="${b}"> ${b}</label>`).join("");

  catMount.addEventListener("change", (e) => {
    shopState.category = e.target.value;
    renderShopResults();
  });
  brandMount.addEventListener("change", () => {
    shopState.brands = Array.from(brandMount.querySelectorAll("input:checked")).map((i) => i.value);
    renderShopResults();
  });
  document.getElementById("filter-availability").addEventListener("change", (e) => {
    const boxes = document.querySelectorAll('#filter-availability input:checked');
    shopState.availability = Array.from(boxes).map((i) => i.value);
    renderShopResults();
  });
  document.getElementById("min-price").addEventListener("input", (e) => {
    shopState.minPrice = e.target.value ? Number(e.target.value) : null;
    renderShopResults();
  });
  document.getElementById("max-price").addEventListener("input", (e) => {
    shopState.maxPrice = e.target.value ? Number(e.target.value) : null;
    renderShopResults();
  });
  document.getElementById("sort-select").addEventListener("change", (e) => {
    shopState.sort = e.target.value;
    renderShopResults();
  });
  document.getElementById("clear-filters").addEventListener("click", () => {
    shopState.category = ""; shopState.brands = []; shopState.availability = [];
    shopState.minPrice = null; shopState.maxPrice = null; shopState.query = "";
    renderShopFilters();
    renderShopResults();
  });
}

function renderShopResults() {
  let list = window.ProductService.filterAndSort({
    query: shopState.query,
    category: shopState.category || undefined,
    sort: shopState.sort
  });

  if (shopState.brands.length) {
    list = list.filter((p) => shopState.brands.includes(p.brand));
  }
  if (shopState.availability.length) {
    list = list.filter((p) => shopState.availability.includes(window.ProductService.getStockStatus(p)));
  }
  if (shopState.minPrice != null) list = list.filter((p) => p.price >= shopState.minPrice);
  if (shopState.maxPrice != null) list = list.filter((p) => p.price <= shopState.maxPrice);

  const grid = document.getElementById("shop-grid");
  const empty = document.getElementById("empty-state");
  const emptyMsg = document.getElementById("empty-message");
  const count = document.getElementById("result-count");

  count.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;

  if (!list.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    emptyMsg.textContent = shopState.query
      ? "No products found. Try another search."
      : "No products match your filters.";
    return;
  }
  empty.style.display = "none";
  grid.innerHTML = list.map(productCardHTML).join("");
  bindProductCardEvents(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  initShopFromURL();
  renderShopFilters();
  renderShopResults();
});

document.addEventListener("products:changed", () => {
  renderShopResults();
});
