

const Auth = (() => {
  const TOKEN_KEY = 'authToken';
  const USER_KEY = 'user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function isLoggedIn() {
    return !!getToken();
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/index.html';
  }

  function updateNavbar(root = document) {
    const loggedInEls = Array.from(root.querySelectorAll('.auth-logged-in'));
    const loggedOutEls = Array.from(root.querySelectorAll('.auth-logged-out'));

    if (isLoggedIn()) {
      loggedInEls.forEach(e => e.style.display = 'inline-block');
      loggedOutEls.forEach(e => e.style.display = 'none');

      const nameEl = root.querySelector('#navUsername');
      const user = getUser();
      if (nameEl) nameEl.textContent = user ? `Hola, ${user.name}` : 'Mi Cuenta';

    } else {
      loggedInEls.forEach(e => e.style.display = 'none');
      loggedOutEls.forEach(e => e.style.display = 'inline-block');
    }
  }

  function init(root = document) {
    updateNavbar(root);

    const logoutBtn = root.querySelector('#logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
  }

  return { getToken, getUser, isLoggedIn, logout, updateNavbar, init };
})();

window.Auth = Auth;

document.addEventListener('DOMContentLoaded', () => Auth.init());
