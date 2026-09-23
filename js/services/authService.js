/* ============================================================
   authService.js
   ------------------------------------------------------------
   *** DEMO / DEVELOPMENT AUTHENTICATION ONLY ***
   This checks a hardcoded username/password in the browser and
   stores a flag in localStorage. This is NOT secure and must be
   replaced with a real backend (Supabase Auth, Firebase Auth,
   etc.) before this site goes live to real customers.
   No real password or secret should ever be shipped this way.
   ============================================================ */

const AUTH_KEY = "tose_admin_session";

// Demo credentials - CHANGE before any real deployment, and note
// that even "changing" them here does not make this secure.
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

const AuthService = {
  login(username, password) {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ loggedIn: true, user: username, at: Date.now() }));
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
  isLoggedIn() {
    try {
      const session = JSON.parse(localStorage.getItem(AUTH_KEY));
      return !!(session && session.loggedIn);
    } catch (e) {
      return false;
    }
  },
  getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(AUTH_KEY));
      return session ? session.user : null;
    } catch (e) {
      return null;
    }
  }
};

window.AuthService = AuthService;
