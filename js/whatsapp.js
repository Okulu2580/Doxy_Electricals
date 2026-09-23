/* ============================================================
   whatsapp.js
   Every WhatsApp button in the whole site goes through this file.
   The phone number always comes from SettingsService, so changing
   it once in Store Settings updates every button on the site.
   ============================================================ */

const WhatsApp = {
  getNumber() {
    const settings = window.SettingsService.getSettings();
    return (settings.whatsappNumber || "").replace(/[^0-9]/g, "");
  },

  openWithMessage(message) {
    const number = this.getNumber();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encoded}`;
    window.open(url, "_blank", "noopener");
  },

  formatPrice(amount) {
    const settings = window.SettingsService.getSettings();
    return settings.currency + Number(amount || 0).toLocaleString("en-NG");
  },

  // Ask about a single product (stock enquiry or general interest)
  askAboutProduct(product, isAvailabilityCheck) {
    const settings = window.SettingsService.getSettings();
    let message;
    if (isAvailabilityCheck) {
      message = `Hello ${settings.businessName}, when will the ${product.name} be available?`;
    } else {
      message = `Hello ${settings.businessName}. I am interested in the ${product.name} currently listed at ${this.formatPrice(product.price)}. Is it available?`;
    }
    this.openWithMessage(message);
  },

  // Order the full cart
  orderCart(cartItems, customerInfo) {
    const settings = window.SettingsService.getSettings();
    let total = 0;
    const lines = cartItems.map((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      total += lineTotal;
      return `${index + 1}. ${item.product.name}\nQuantity: ${item.quantity}\nPrice: ${this.formatPrice(item.product.price)}`;
    });

    let message = `Hello ${settings.businessName},\n\nI would like to place an order.\n\nMy order:\n\n${lines.join("\n\n")}\n\nTOTAL: ${this.formatPrice(total)}`;

    if (customerInfo) {
      if (customerInfo.orderId) message += `\n\nOrder Ref: ${customerInfo.orderId}`;
      if (customerInfo.customerName) message += `\nName: ${customerInfo.customerName}`;
      if (customerInfo.phone) message += `\nPhone: ${customerInfo.phone}`;
      if (customerInfo.location) message += `\nDelivery Location: ${customerInfo.location}`;
      if (customerInfo.notes) message += `\nNotes: ${customerInfo.notes}`;
    }

    message += `\n\nPlease confirm product availability, delivery charge and payment instructions.\n\nThank you.`;
    this.openWithMessage(message);
    return total;
  },

  generalEnquiry() {
    const settings = window.SettingsService.getSettings();
    this.openWithMessage(`Hello ${settings.businessName}, I have a question about your products.`);
  }
};

window.WhatsApp = WhatsApp;
