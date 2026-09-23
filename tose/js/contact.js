/* ============================================================
   contact.js - contact page logic
   ============================================================ */

function renderContactInfo() {
  const settings = window.SettingsService.getSettings();
  document.getElementById("contact-info").innerHTML = `
    <h3 style="margin-top:0;">${settings.businessName}</h3>
    <p><strong>Phone:</strong> ${settings.businessPhone}</p>
    <p><strong>WhatsApp:</strong> ${settings.businessPhone}</p>
    <p><strong>Email:</strong> ${settings.email}</p>
    <p><strong>Address:</strong> ${settings.address}</p>
    <p><strong>Hours:</strong> ${settings.businessHours}</p>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-whatsapp" id="contact-whatsapp-btn">Chat on WhatsApp</button>
      <a class="btn btn-outline" href="tel:${settings.businessPhone.replace(/\s+/g, "")}">Call Us</a>
    </div>
  `;
  document.getElementById("contact-whatsapp-btn").addEventListener("click", () => window.WhatsApp.generalEnquiry());
}

document.addEventListener("DOMContentLoaded", () => {
  renderContactInfo();
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const phone = document.getElementById("c-phone").value.trim();
    const msg = document.getElementById("c-message").value.trim();
    const settings = window.SettingsService.getSettings();
    const message = `Hello ${settings.businessName}, my name is ${name} (${phone}).\n\n${msg}`;
    document.getElementById("contact-success").style.display = "block";
    window.WhatsApp.openWithMessage(message);
    e.target.reset();
  });
});
