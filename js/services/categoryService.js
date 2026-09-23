/* ============================================================
   categoryService.js - category CRUD via localStorage
   ============================================================ */

const CATEGORIES_KEY = "tose_categories";

const DEFAULT_CATEGORIES = [
  { id: "cables", name: "Electrical Cables", description: "Copper and insulated cables for every wiring job.", icon: "🔌" },
  { id: "switches-sockets", name: "Switches & Sockets", description: "Wall switches, sockets and changeover switches.", icon: "🔘" },
  { id: "circuit-breakers", name: "Circuit Breakers", description: "MCBs and circuit protection devices.", icon: "🛡️" },
  { id: "lighting", name: "Lighting", description: "LED bulbs, flood lights and fittings.", icon: "💡" },
  { id: "distribution-boards", name: "Distribution Boards", description: "Boards for organising and protecting circuits.", icon: "📦" },
  { id: "conduits", name: "Electrical Conduits", description: "PVC conduit pipes for cable routing.", icon: "🧵" },
  { id: "wiring-accessories", name: "Wiring Accessories", description: "Junction boxes, tape, clips and more.", icon: "🧰" },
  { id: "electrical-tools", name: "Electrical Tools", description: "Tools for installation and maintenance.", icon: "🛠️" }
];

function readCategories() {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  if (!raw) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES.slice();
  }
  try { return JSON.parse(raw); }
  catch (e) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES.slice();
  }
}

function writeCategories(list) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CategoryService = {
  getCategories() { return readCategories(); },
  getCategory(id) { return readCategories().find((c) => c.id === id) || null; },
  addCategory(data) {
    if (window.ADMIN_READ_ONLY) return null;
    const list = readCategories();
    const id = slugify(data.name) || ("cat" + Date.now());
    const category = { id, name: data.name, description: data.description || "", icon: data.icon || "⚡" };
    list.push(category);
    writeCategories(list);
    return category;
  },
  updateCategory(id, updates) {
    if (window.ADMIN_READ_ONLY) return null;
    const list = readCategories();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], updates, { id });
    writeCategories(list);
    return list[idx];
  },
  deleteCategory(id) {
    if (window.ADMIN_READ_ONLY) return false;
    writeCategories(readCategories().filter((c) => c.id !== id));
  },
  productCount(id) {
    return window.ProductService.getProducts().filter((p) => p.category === id).length;
  }
};

window.CategoryService = CategoryService;
