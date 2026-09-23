/* ============================================================
   home.js - homepage rendering logic
   ============================================================ */

function renderHomeCopy() {
  const settings = window.SettingsService.getSettings();
  const headline = document.getElementById("hero-headline");
  const desc = document.getElementById("hero-description");
  if (headline) headline.textContent = settings.homepageHeadline;
  if (desc) desc.textContent = settings.homepageDescription;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomeCopy();
  const heroBtn = document.getElementById("hero-whatsapp-btn");
  if (heroBtn) heroBtn.addEventListener("click", () => window.WhatsApp.generalEnquiry());
});
