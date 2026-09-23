/* ============================================================
   orderService.js - order requests placed before WhatsApp handoff
   ============================================================ */

const ORDERS_KEY = "tose_orders";
const ORDER_SEQ_KEY = "tose_order_seq";

function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
  catch (e) { return []; }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function nextOrderId() {
  let seq = Number(localStorage.getItem(ORDER_SEQ_KEY)) || 1000;
  seq += 1;
  localStorage.setItem(ORDER_SEQ_KEY, String(seq));
  return "TOSE-" + seq;
}

const OrderService = {
  getOrders() {
    return readOrders().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  },
  getOrder(id) {
    return readOrders().find((o) => o.id === id) || null;
  },
  addOrder({ customerName, phone, location, notes, items, total }) {
    if (window.ADMIN_READ_ONLY) return null;
    const orders = readOrders();
    const order = {
      id: nextOrderId(),
      customerName: customerName || "Not provided",
      phone: phone || "Not provided",
      location: location || "Not provided",
      notes: notes || "",
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      })),
      total,
      date: new Date().toISOString(),
      status: "New"
    };
    orders.push(order);
    writeOrders(orders);
    return order;
  },
  updateOrderStatus(id, status) {
    if (window.ADMIN_READ_ONLY) return null;
    const orders = readOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    writeOrders(orders);
    return order;
  },
  deleteOrder(id) {
    if (window.ADMIN_READ_ONLY) return false;
    writeOrders(readOrders().filter((o) => o.id !== id));
  }
};

window.OrderService = OrderService;
