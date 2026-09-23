/* Catalog adapter: keeps the nested catalog compatible with ProductService. */

function flattenDoxyCatalog() {
  return window.DOXY_CATALOG.flatMap((category) => category.subcategories.flatMap((subcategory) => subcategory.products.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    category: category.id,
    subcategory: subcategory.id,
    unit: product.unit,
    stockQuantity: product.inStock ? 10 : 0,
    forcedOutOfStock: !product.inStock,
    oldPrice: null,
    shortDescription: `${product.unit} of ${product.name}.`,
    description: `${product.name} supplied by Doxy Electricals.`,
    image: product.image || "",
    additionalImages: [],
    featured: false,
    specifications: { Unit: product.unit, Subcategory: subcategory.name },
    keywords: [category.name, subcategory.name, product.brand, product.name].join(" ").toLowerCase().split(" "),
    dateAdded: "2026-09-22"
  }))));
}

function syncDoxyCatalogProducts() {
  const existing = window.ProductService.getProducts();
  const existingIds = new Set(existing.map((product) => product.id));
  const catalogProducts = flattenDoxyCatalog();
  const additions = catalogProducts.filter((product) => !existingIds.has(product.id));
  let changed = additions.length > 0;
  const updatedExisting = existing.map((product) => {
    const catalogProduct = catalogProducts.find((entry) => entry.id === product.id);
    if (catalogProduct?.image && product.image !== catalogProduct.image) {
      changed = true;
      return Object.assign({}, product, { image: catalogProduct.image });
    }
    return product;
  });
  if (changed) localStorage.setItem("tose_products", JSON.stringify(updatedExisting.concat(additions)));
}

window.DoxyCatalogService = {
  getCatalog: () => window.DOXY_CATALOG,
  getProducts: flattenDoxyCatalog,
  syncProducts: syncDoxyCatalogProducts
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.ProductService) syncDoxyCatalogProducts();
});
