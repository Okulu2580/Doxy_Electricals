/* ============================================================
   productService.js
   Central place for ALL product data operations.
   Today it reads/writes localStorage. Later, swap the inside of
   these functions for Supabase/Firebase calls and nothing else
   in the app has to change.
   ============================================================ */

const PRODUCTS_KEY = "tose_products";
const COLEMAN_15MM_IMAGE = "./assets/images/Coleman-1-5mm-Copper-Cable.jpg";
const LOCAL_PRODUCT_IMAGES = {
  p001: COLEMAN_15MM_IMAGE,
  p002: "./assets/images/Coleman-2-5mm-Copper-Cable.jpg",
  p007: "./assets/images/Schneider-8-Way-Distribution-Board.jpg",
  p010: "./assets/images/LED-Bulb-12W-Screw-Type.jpg",
  p013: "./assets/images/20mm-High-Impact-PVC-Conduit-Pipe(White).jpg",
  p017: "./assets/images/Schneider-1-Gang-2-Way-Switch.jpg"
};

const DEFAULT_PRODUCTS = [
  {
    id: "p001", name: "Coleman 1.5mm Cable", brand: "Coleman", category: "cables",
    price: 12000, oldPrice: null,
    shortDescription: "1.5mm copper cable for light wiring circuits.",
    description: "High-quality copper electrical cable designed for residential, commercial and industrial electrical installations.",
    image: COLEMAN_15MM_IMAGE,
    additionalImages: [],
    stockQuantity: 40, forcedOutOfStock: false, featured: true,
    specifications: { "Cable Size": "1.5mm", "Conductor": "Copper", "Application": "Electrical Wiring", "Type": "Insulated Cable" },
    keywords: ["cable", "coleman", "wire", "1.5mm"], dateAdded: "2026-01-05"
  },
  {
    id: "p002", name: "Coleman 2.5mm Cable", brand: "Coleman", category: "cables",
    price: 18500, oldPrice: 20000,
    shortDescription: "2.5mm copper cable for sockets and general wiring.",
    description: "High-quality copper electrical cable designed for residential, commercial and industrial electrical installations.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    additionalImages: [],
    stockQuantity: 25, forcedOutOfStock: false, featured: true,
    specifications: { "Cable Size": "2.5mm", "Conductor": "Copper", "Application": "Electrical Wiring", "Type": "Insulated Cable" },
    keywords: ["cable", "coleman", "wire", "2.5mm"], dateAdded: "2026-01-05"
  },
  {
    id: "p003", name: "Coleman 4mm Cable", brand: "Coleman", category: "cables",
    price: 27500, oldPrice: null,
    shortDescription: "4mm copper cable for heavier circuits.",
    description: "Durable 4mm copper cable suited to higher-load circuits in homes and small commercial spaces.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    additionalImages: [], stockQuantity: 4, forcedOutOfStock: false, featured: false,
    specifications: { "Cable Size": "4mm", "Conductor": "Copper", "Application": "Electrical Wiring", "Type": "Insulated Cable" },
    keywords: ["cable", "coleman", "wire", "4mm"], dateAdded: "2026-01-10"
  },
  {
    id: "p004", name: "Coleman 6mm Cable", brand: "Coleman", category: "cables",
    price: 39500, oldPrice: null,
    shortDescription: "6mm copper cable for main feed circuits.",
    description: "Heavy-duty 6mm copper cable for main distribution and high-current runs.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    additionalImages: [], stockQuantity: 0, forcedOutOfStock: false, featured: false,
    specifications: { "Cable Size": "6mm", "Conductor": "Copper", "Application": "Electrical Wiring", "Type": "Insulated Cable" },
    keywords: ["cable", "coleman", "wire", "6mm"], dateAdded: "2026-01-10"
  },
  {
    id: "p005", name: "Schneider 20A Circuit Breaker", brand: "Schneider", category: "circuit-breakers",
    price: 8000, oldPrice: null,
    shortDescription: "20A single-pole circuit breaker.",
    description: "Schneider Electric circuit breaker rated for 20A, suitable for lighting and small appliance circuits.",
    image: "https://images.unsplash.com/photo-1621961458348-f013d219b50c?w=600&q=80",
    additionalImages: [], stockQuantity: 15, forcedOutOfStock: false, featured: true,
    specifications: { "Rating": "20A", "Poles": "Single", "Brand": "Schneider" },
    keywords: ["circuit breaker", "schneider", "20a", "mcb"], dateAdded: "2026-01-08"
  },
  {
    id: "p006", name: "Schneider 32A Circuit Breaker", brand: "Schneider", category: "circuit-breakers",
    price: 9500, oldPrice: null,
    shortDescription: "32A single-pole circuit breaker.",
    description: "Schneider Electric circuit breaker rated for 32A, suitable for higher-load circuits.",
    image: "https://images.unsplash.com/photo-1621961458348-f013d219b50c?w=600&q=80",
    additionalImages: [], stockQuantity: 3, forcedOutOfStock: false, featured: false,
    specifications: { "Rating": "32A", "Poles": "Single", "Brand": "Schneider" },
    keywords: ["circuit breaker", "schneider", "32a", "mcb"], dateAdded: "2026-01-08"
  },
  {
    id: "p007", name: "Schneider Distribution Board", brand: "Schneider", category: "distribution-boards",
    price: 45000, oldPrice: 52000,
    shortDescription: "12-way distribution board.",
    description: "Schneider Electric distribution board for organising and protecting multiple circuits in one enclosure.",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80",
    additionalImages: [], stockQuantity: 8, forcedOutOfStock: false, featured: true,
    specifications: { "Ways": "12", "Brand": "Schneider", "Mounting": "Surface" },
    keywords: ["distribution board", "schneider", "db box"], dateAdded: "2026-01-12"
  },
  {
    id: "p008", name: "13A Double Socket", brand: "Generic", category: "switches-sockets",
    price: 3500, oldPrice: null,
    shortDescription: "Standard 13A double wall socket.",
    description: "Durable 13A double socket outlet for general household and office use.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80",
    additionalImages: [], stockQuantity: 60, forcedOutOfStock: false, featured: false,
    specifications: { "Rating": "13A", "Type": "Double Socket" },
    keywords: ["socket", "double socket", "13a", "wall socket"], dateAdded: "2026-01-15"
  },
  {
    id: "p009", name: "13A Single Socket", brand: "Generic", category: "switches-sockets",
    price: 2200, oldPrice: null,
    shortDescription: "Standard 13A single wall socket.",
    description: "Reliable 13A single socket outlet for general household and office use.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80",
    additionalImages: [], stockQuantity: 55, forcedOutOfStock: false, featured: false,
    specifications: { "Rating": "13A", "Type": "Single Socket" },
    keywords: ["socket", "single socket", "13a", "wall socket"], dateAdded: "2026-01-15"
  },
  {
    id: "p010", name: "LED Bulb 12W", brand: "Generic", category: "lighting",
    price: 2800, oldPrice: 3200,
    shortDescription: "Energy-saving 12W LED bulb.",
    description: "Long-life 12W LED bulb offering bright, energy-efficient lighting for any room.",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80",
    additionalImages: [], stockQuantity: 100, forcedOutOfStock: false, featured: true,
    specifications: { "Wattage": "12W", "Base": "E27", "Type": "LED" },
    keywords: ["led", "bulb", "light", "12w"], dateAdded: "2026-01-06"
  },
  {
    id: "p011", name: "LED Bulb 18W", brand: "Generic", category: "lighting",
    price: 3600, oldPrice: null,
    shortDescription: "Energy-saving 18W LED bulb.",
    description: "Bright 18W LED bulb suitable for larger rooms and higher-ceiling spaces.",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80",
    additionalImages: [], stockQuantity: 2, forcedOutOfStock: false, featured: false,
    specifications: { "Wattage": "18W", "Base": "E27", "Type": "LED" },
    keywords: ["led", "bulb", "light", "18w"], dateAdded: "2026-01-06"
  },
  {
    id: "p012", name: "LED Flood Light", brand: "Generic", category: "lighting",
    price: 12500, oldPrice: null,
    shortDescription: "Outdoor LED flood light, 50W.",
    description: "Weatherproof 50W LED flood light for outdoor security and area lighting.",
    image: "https://images.unsplash.com/photo-1544133782-7c9827aa7a94?w=600&q=80",
    additionalImages: [], stockQuantity: 0, forcedOutOfStock: false, featured: false,
    specifications: { "Wattage": "50W", "Rating": "IP65", "Type": "LED Flood Light" },
    keywords: ["led", "flood light", "outdoor light"], dateAdded: "2026-01-18"
  },
  {
    id: "p013", name: "PVC Conduit Pipe", brand: "Generic", category: "conduits",
    price: 1800, oldPrice: null,
    shortDescription: "20mm PVC conduit pipe, per length.",
    description: "Standard 20mm PVC conduit pipe for protecting and routing electrical cables.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
    additionalImages: [], stockQuantity: 200, forcedOutOfStock: false, featured: false,
    specifications: { "Size": "20mm", "Material": "PVC" },
    keywords: ["conduit", "pvc pipe", "cable pipe"], dateAdded: "2026-01-09"
  },
  {
    id: "p014", name: "Junction Box", brand: "Generic", category: "wiring-accessories",
    price: 1200, oldPrice: null,
    shortDescription: "Standard PVC junction box.",
    description: "Durable junction box for safely housing and joining electrical wire connections.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
    additionalImages: [], stockQuantity: 45, forcedOutOfStock: false, featured: false,
    specifications: { "Material": "PVC", "Type": "Junction Box" },
    keywords: ["junction box", "wiring accessory"], dateAdded: "2026-01-09"
  },
  {
    id: "p015", name: "Electrical Tape", brand: "Generic", category: "wiring-accessories",
    price: 500, oldPrice: null,
    shortDescription: "PVC insulation tape, black.",
    description: "General-purpose PVC insulation tape for electrical wiring jobs.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
    additionalImages: [], stockQuantity: 300, forcedOutOfStock: false, featured: false,
    specifications: { "Color": "Black", "Material": "PVC" },
    keywords: ["tape", "insulation tape", "electrical tape"], dateAdded: "2026-01-09"
  },
  {
    id: "p016", name: "Changeover Switch", brand: "Generic", category: "switches-sockets",
    price: 15000, oldPrice: null,
    shortDescription: "63A manual changeover switch.",
    description: "Manual changeover switch for safely switching between mains power and a generator supply.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80",
    additionalImages: [], stockQuantity: 10, forcedOutOfStock: false, featured: true,
    specifications: { "Rating": "63A", "Type": "Manual Changeover" },
    keywords: ["changeover switch", "generator switch"], dateAdded: "2026-01-14"
  },
  {
    id: "p017", name: "Wall Switch", brand: "Generic", category: "switches-sockets",
    price: 1500, oldPrice: null,
    shortDescription: "1-gang wall light switch.",
    description: "Standard 1-gang wall switch for controlling room lighting.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80",
    additionalImages: [], stockQuantity: 70, forcedOutOfStock: false, featured: false,
    specifications: { "Gang": "1", "Type": "Wall Switch" },
    keywords: ["wall switch", "light switch"], dateAdded: "2026-01-11"
  },
  {
    id: "p018", name: "Extension Socket", brand: "Generic", category: "switches-sockets",
    price: 4500, oldPrice: null,
    shortDescription: "4-way extension socket with surge protection.",
    description: "4-way extension socket board with a switch and basic surge protection.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80",
    additionalImages: [], stockQuantity: 30, forcedOutOfStock: false, featured: false,
    specifications: { "Ways": "4", "Surge Protected": "Yes" },
    keywords: ["extension", "extension socket", "power strip"], dateAdded: "2026-01-11"
  },
  {
    id: "p019", name: "Cable Clips", brand: "Generic", category: "wiring-accessories",
    price: 800, oldPrice: null,
    shortDescription: "Pack of cable clips for surface wiring.",
    description: "Pack of plastic cable clips for neatly securing surface-mounted cables.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
    additionalImages: [], stockQuantity: 150, forcedOutOfStock: false, featured: false,
    specifications: { "Pack Size": "50 pcs", "Material": "Plastic" },
    keywords: ["cable clips", "wiring accessory"], dateAdded: "2026-01-09"
  },
  {
    id: "p020", name: "Circuit Protection Accessories Kit", brand: "Schneider", category: "circuit-breakers",
    price: 6200, oldPrice: null,
    shortDescription: "Assorted circuit protection accessories.",
    description: "Kit of assorted accessories used alongside circuit breakers for complete circuit protection.",
    image: "https://images.unsplash.com/photo-1621961458348-f013d219b50c?w=600&q=80",
    additionalImages: [], stockQuantity: 5, forcedOutOfStock: false, featured: false,
    specifications: { "Brand": "Schneider", "Type": "Accessory Kit" },
    keywords: ["circuit protection", "accessories", "schneider"], dateAdded: "2026-01-20"
  }
];

function readProducts() {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS.slice();
  }
  try {
    const products = JSON.parse(raw);
    let changed = false;
    products.forEach((product) => {
      const localImage = LOCAL_PRODUCT_IMAGES[product.id];
      if (localImage && product.image !== localImage) {
        product.image = localImage;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
    return products;
  } catch (e) {
    console.error("Corrupt product data, resetting to defaults.", e);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS.slice();
  }
}

function writeProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  document.dispatchEvent(new CustomEvent("products:changed"));
}

function adminProductWriteAllowed() {
  return !window.ADMIN_READ_ONLY || window.ADMIN_CAN_MANAGE_INVENTORY;
}

function getStockStatus(product) {
  if (!product) return "OUT_OF_STOCK";
  const qty = Number(product.stockQuantity) || 0;
  if (product.forcedOutOfStock || qty <= 0) return "OUT_OF_STOCK";
  if (qty <= 5) return "LOW_STOCK";
  return "IN_STOCK";
}

function stockStatusLabel(status) {
  return { IN_STOCK: "In Stock", LOW_STOCK: "Low Stock", OUT_OF_STOCK: "Out of Stock" }[status] || status;
}

const ProductService = {
  getProducts() {
    return readProducts();
  },
  getProduct(id) {
    return readProducts().find((p) => p.id === id) || null;
  },
  addProduct(data) {
    if (window.ADMIN_READ_ONLY) return null;
    const products = readProducts();
    const id = "p" + String(Date.now()).slice(-8);
    const product = Object.assign({
      id,
      additionalImages: [],
      stockQuantity: 0,
      forcedOutOfStock: false,
      featured: false,
      specifications: {},
      keywords: [],
      oldPrice: null,
      dateAdded: new Date().toISOString().slice(0, 10)
    }, data, { id });
    products.push(product);
    writeProducts(products);
    return product;
  },
  updateProduct(id, updates) {
    if (!adminProductWriteAllowed()) return null;
    const products = readProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const allowedUpdates = window.ADMIN_READ_ONLY
      ? {
        price: Number.isFinite(Number(updates.price)) ? Number(updates.price) : products[idx].price,
        stockQuantity: updates.stockQuantity == null ? products[idx].stockQuantity : Math.max(0, Number(updates.stockQuantity) || 0),
        forcedOutOfStock: updates.forcedOutOfStock == null ? products[idx].forcedOutOfStock : !!updates.forcedOutOfStock
      }
      : updates;
    products[idx] = Object.assign({}, products[idx], allowedUpdates, { id });
    writeProducts(products);
    return products[idx];
  },
  deleteProduct(id) {
    if (window.ADMIN_READ_ONLY) return false;
    const products = readProducts().filter((p) => p.id !== id);
    writeProducts(products);
  },
  updateStock(id, stockQuantity) {
    if (!adminProductWriteAllowed()) return null;
    return this.updateProduct(id, { stockQuantity: Number(stockQuantity) || 0 });
  },
  setOutOfStock(id, forced) {
    if (!adminProductWriteAllowed()) return null;
    return this.updateProduct(id, { forcedOutOfStock: !!forced });
  },
  getStockStatus,
  stockStatusLabel,
  search(query, list) {
    const products = list || readProducts();
    if (!query || !query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const haystack = [
        p.name, p.brand, p.category, p.description, p.shortDescription,
        ...(p.keywords || [])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  },
  filterAndSort(options) {
    options = options || {};
    let list = readProducts();
    if (options.query) list = this.search(options.query, list);
    if (options.category) list = list.filter((p) => p.category === options.category);
    if (options.brand) list = list.filter((p) => p.brand === options.brand);
    if (options.availability) {
      list = list.filter((p) => getStockStatus(p) === options.availability);
    }
    if (options.minPrice != null) list = list.filter((p) => p.price >= options.minPrice);
    if (options.maxPrice != null) list = list.filter((p) => p.price <= options.maxPrice);

    switch (options.sort) {
      case "newest":
        list = list.slice().sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""));
        break;
      case "price-low":
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case "featured":
      default:
        list = list.slice().sort((a, b) => (b.featured === true) - (a.featured === true));
        break;
    }
    return list;
  },
  getFeatured() {
    return readProducts().filter((p) => p.featured);
  },
  getBrands() {
    return Array.from(new Set(readProducts().map((p) => p.brand))).sort();
  },
  resetToDefaults() {
    if (window.ADMIN_READ_ONLY) return;
    writeProducts(DEFAULT_PRODUCTS);
  }
};

window.ProductService = ProductService;

window.addEventListener("storage", (event) => {
  if (event.key === PRODUCTS_KEY) document.dispatchEvent(new CustomEvent("products:changed"));
});
