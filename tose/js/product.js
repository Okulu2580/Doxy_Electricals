/* ============================================================
   product.js - product detail page logic
   ============================================================ */

function renderProductDetail() {
  const id = qs("id");
  const mount = document.getElementById("product-detail-mount");
  const product = id ? window.ProductService.getProduct(id) : null;

  if (!product) {
    mount.innerHTML = `
      <div class="empty-state">
        <div class="emoji">⚠️</div>
        <p>Sorry, we couldn't find that product. It may have been removed.</p>
        <a class="btn btn-primary" href="shop.html" style="margin-top:14px;">Back to Shop</a>
      </div>`;
    return;
  }

  document.title = `${product.name} | Doxy Electricals`;
  document.getElementById("page-description").setAttribute("content", product.shortDescription || product.description || "");
  document.getElementById("breadcrumb-name").textContent = product.name;

  const status = window.ProductService.getStockStatus(product);
  const outOfStock = status === "OUT_OF_STOCK";
  const images = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  if (!images.length) images.push(FALLBACK_IMAGE);

  const specsRows = Object.entries(product.specifications || {})
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");

  mount.innerHTML = `
    <div class="product-detail">
      <div class="pd-gallery">
        <img class="main-image" id="main-image" src="${images[0]}" alt="${product.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
        ${images.length > 1 ? `<div class="pd-thumbs">${images.map((img) => `<img src="${img}" onclick="document.getElementById('main-image').src=this.src">`).join("")}</div>` : ""}
      </div>
      <div class="pd-info">
        ${stockBadge(product)}
        <h1>${product.name}</h1>
        <div class="pd-meta">Brand: <strong>${product.brand}</strong> &nbsp;|&nbsp; Category: <strong>${window.CategoryService.getCategory(product.category)?.name || product.category}</strong></div>
        <div class="pd-price-row">
          <span class="price">${money(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}
        </div>
        <p>${product.description || product.shortDescription || ""}</p>

        ${outOfStock ? "" : `
        <div class="pd-qty-row">
          <div class="qty-control">
            <button id="qty-minus" type="button">−</button>
            <input type="number" id="qty-input" value="1" min="1">
            <button id="qty-plus" type="button">+</button>
          </div>
        </div>`}

        <div class="pd-actions">
          ${outOfStock
            ? `<button class="btn btn-outline" id="ask-availability-btn">Ask About Availability</button>`
            : `<button class="btn btn-primary" id="add-to-cart-btn">Add to Cart</button>
               <button class="btn btn-dark" id="buy-whatsapp-btn">Order on WhatsApp</button>`
          }
          <button class="btn btn-whatsapp" id="ask-whatsapp-btn">Ask on WhatsApp</button>
        </div>

        ${specsRows ? `<div class="pd-specs"><h3>Specifications</h3><table>${specsRows}</table></div>` : ""}
      </div>
    </div>
  `;

  if (!outOfStock) {
    document.getElementById("qty-minus").addEventListener("click", () => {
      const input = document.getElementById("qty-input");
      input.value = Math.max(1, Number(input.value) - 1);
    });
    document.getElementById("qty-plus").addEventListener("click", () => {
      const input = document.getElementById("qty-input");
      input.value = Number(input.value) + 1;
    });
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const qty = Number(document.getElementById("qty-input").value) || 1;
      window.CartService.addItem(product.id, qty);
      showToast("Added to cart");
    });
    document.getElementById("buy-whatsapp-btn").addEventListener("click", () => {
      const qty = Number(document.getElementById("qty-input").value) || 1;
      window.WhatsApp.orderCart([{ product, quantity: qty }]);
    });
  } else {
    document.getElementById("ask-availability-btn").addEventListener("click", () => {
      window.WhatsApp.askAboutProduct(product, true);
    });
  }

  document.getElementById("ask-whatsapp-btn").addEventListener("click", () => {
    window.WhatsApp.askAboutProduct(product, false);
  });

  renderRelated(product);
}

function renderRelated(product) {
  const mount = document.getElementById("related-grid");
  const related = window.ProductService.getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  mount.innerHTML = related.length
    ? related.map(productCardHTML).join("")
    : `<p style="color:var(--grey-mid);">No related products yet.</p>`;
  bindProductCardEvents(mount);
}

document.addEventListener("DOMContentLoaded", renderProductDetail);
document.addEventListener("products:changed", renderProductDetail);
