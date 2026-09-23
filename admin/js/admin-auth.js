/* ============================================================
   admin-auth.js - login screen wiring
   See js/services/authService.js for the (demo-only) auth logic.
   ============================================================ */

function showLoginScreen() {
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-shell").style.display = "none";
}

function showDashboardShell() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-shell").style.display = "flex";
}

function initAdminAuth() {
  if (window.AuthService.isLoggedIn()) {
    showDashboardShell();
  } else {
    showLoginScreen();
  }

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const ok = window.AuthService.login(username, password);
    if (ok) {
      document.getElementById("login-error").style.display = "none";
      showDashboardShell();
      if (window.initAdminApp) window.initAdminApp();
    } else {
      document.getElementById("login-error").style.display = "block";
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    window.AuthService.logout();
    showLoginScreen();
  });
}
