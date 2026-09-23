/* ============================================================
   settingsService.js - store settings + website settings
   This is the SINGLE SOURCE for the WhatsApp number, business
   phone, and homepage copy. Change it here (or in the Admin
   Dashboard -> Store/Website Settings) and it updates everywhere.
   ============================================================ */

const SETTINGS_KEY = "tose_settings";

const DEFAULT_SETTINGS = {
  // ---- Store Settings ----
  businessName: "Doxy Electricals",
  businessPhone: "+234 811 648 7668",
  whatsappNumber: "2348116487668", // digits only, country code first, no + or spaces
  email: "info@doxyelectricals.com",
  address: "Enter your business address here",
  businessHours: "Mon - Sat: 8:00 AM - 6:00 PM",
  deliveryInfo: "Delivery fee will be confirmed based on your location.",
  currency: "₦",
  defaultWhatsappMessage: "Hello Doxy Electricals, I would like to place an order.",

  // ---- Website Settings ----
  homepageHeadline: "Quality Electrical Materials, All in One Place",
  homepageDescription: "Shop trusted electrical materials for homes, offices, commercial buildings and construction projects.",
  storeTagline: "Quality Electrical Materials You Can Trust",
  aboutUsDescription: "Doxy Electricals supplies quality electrical materials for homes, businesses, offices, electrical contractors, construction projects and commercial buildings.",
  socialLinks: { facebook: "", instagram: "", twitter: "" }
};

function readSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return Object.assign({}, DEFAULT_SETTINGS);
  }
  try {
    const settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(raw));
    if (settings.email === "info@toseelectricals.com") settings.email = DEFAULT_SETTINGS.email;
    if (settings.businessName === "TOSE Electricals") settings.businessName = DEFAULT_SETTINGS.businessName;
    if (settings.defaultWhatsappMessage === "Hello TOSE Electricals, I would like to place an order.") {
      settings.defaultWhatsappMessage = DEFAULT_SETTINGS.defaultWhatsappMessage;
    }
    if (settings.aboutUsDescription === "TOSE Electricals supplies quality electrical materials for homes, businesses, offices, electrical contractors, construction projects and commercial buildings.") {
      settings.aboutUsDescription = DEFAULT_SETTINGS.aboutUsDescription;
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  } catch (e) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return Object.assign({}, DEFAULT_SETTINGS);
  }
}

function writeSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

const SettingsService = {
  getSettings() { return readSettings(); },
  updateSettings(updates) {
    if (window.ADMIN_READ_ONLY) return readSettings();
    const settings = Object.assign({}, readSettings(), updates);
    writeSettings(settings);
    return settings;
  },
  resetToDefaults() {
    if (window.ADMIN_READ_ONLY) return readSettings();
    writeSettings(DEFAULT_SETTINGS);
    return Object.assign({}, DEFAULT_SETTINGS);
  }
};

window.SettingsService = SettingsService;
