/* ============================================================
   cartService.js - shopping cart, persisted in localStorage
   Cart shape: [{ productId, quantity }]
   ============================================================ */

const CART_KEY = "doxy_cart";

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent("cart:changed"));
}

const CartService = {
  getCartRaw() { return readCart(); },
  getCartItems() {
    const cart = readCart();
    return cart
      .map((entry) => {
        const product = window.ProductService.getProduct(entry.productId);
        if (!product) return null;
        return { product, quantity: entry.quantity };
      })
      .filter(Boolean);
  },
  addItem(productId, quantity) {
    quantity = Math.max(1, Number(quantity) || 1);
    const cart = readCart();
    const existing = cart.find((c) => c.productId === productId);
    if (existing) existing.quantity += quantity;
    else cart.push({ productId, quantity });
    writeCart(cart);
  },
  removeItem(productId) {
    writeCart(readCart().filter((c) => c.productId !== productId));
  },
  setQuantity(productId, quantity) {
    quantity = Number(quantity) || 0;
    let cart = readCart();
    if (quantity <= 0) {
      cart = cart.filter((c) => c.productId !== productId);
    } else {
      const existing = cart.find((c) => c.productId === productId);
      if (existing) existing.quantity = quantity;
      else cart.push({ productId, quantity });
    }
    writeCart(cart);
  },
  increaseQuantity(productId) {
    const cart = readCart();
    const existing = cart.find((c) => c.productId === productId);
    if (existing) { existing.quantity += 1; writeCart(cart); }
  },
  decreaseQuantity(productId) {
    const cart = readCart();
    const existing = cart.find((c) => c.productId === productId);
    if (existing) {
      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        writeCart(cart.filter((c) => c.productId !== productId));
      } else {
        writeCart(cart);
      }
    }
  },
  clearCart() { writeCart([]); },
  getTotalItems() {
    return readCart().reduce((sum, c) => sum + c.quantity, 0);
  },
  getSubtotal() {
    return this.getCartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
};

window.CartService = CartService;
