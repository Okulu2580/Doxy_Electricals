/* admin-settings.js - read-only store and website settings views */

function settingsRows(rows) {
  return rows.map(([label, value]) => `<div class="form-group"><label>${label}</label><div class="admin-readonly-value">${value || "Not set"}</div></div>`).join("");
}

function renderAdminStoreSettingsView() {
  const s = window.SettingsService.getSettings();
  document.getElementById("view-mount").innerHTML = `<div class="admin-panel"><div class="admin-panel-header"><h3>Store Settings</h3><span class="admin-readonly-note">Read-only</span></div>${settingsRows([
    ["Business Name", s.businessName], ["Business Phone", s.businessPhone], ["WhatsApp Number", s.whatsappNumber], ["Email Address", s.email],
    ["Business Address", s.address], ["Business Hours", s.businessHours], ["Currency Symbol", s.currency], ["Delivery Information", s.deliveryInfo], ["Default WhatsApp Message", s.defaultWhatsappMessage]
  ])}</div>`;
}
window.renderAdminStoreSettingsView = renderAdminStoreSettingsView;

function renderAdminWebsiteSettingsView() {
  const s = window.SettingsService.getSettings();
  document.getElementById("view-mount").innerHTML = `<div class="admin-panel"><div class="admin-panel-header"><h3>Website Settings</h3><span class="admin-readonly-note">Read-only</span></div>${settingsRows([
    ["Homepage Headline", s.homepageHeadline], ["Homepage Description", s.homepageDescription], ["Store Tagline", s.storeTagline],
    ["About Us Description", s.aboutUsDescription], ["Facebook URL", s.socialLinks?.facebook], ["Instagram URL", s.socialLinks?.instagram], ["Twitter/X URL", s.socialLinks?.twitter]
  ])}</div>`;
}
window.renderAdminWebsiteSettingsView = renderAdminWebsiteSettingsView;
