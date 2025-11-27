// frontend/js/login.js
// Validación de login y guardado de token en localStorage

const loginForm = document.getElementById('loginForm');
const messageEl = document.getElementById('message');

function showMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = 'form-message ' + type;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage('', '');

  const email = (document.getElementById('email').value || '').trim();
  const password = document.getElementById('password').value || '';

  if (!email || !password) return showMessage('Email y contraseña son requeridos.', 'error');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('Email inválido.', 'error');

  try {
    showMessage('Iniciando sesión...');
    const result = await window.api.loginUser({ email, password });

    if (!result || result.success === false) {
      return showMessage(result && result.error ? result.error : 'Credenciales inválidas', 'error');
    }

    // Guardar token y datos en localStorage
    if (result.token) {
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('token', result.token);  // Guardar también como 'token'
      localStorage.setItem('user', JSON.stringify(result.data || result.user || {}));
      showMessage('Inicio de sesión exitoso', 'success');
      // Redirect to reservations page or home
      setTimeout(() => (window.location.href = '../index.html'), 800);
    } else {
      showMessage('No se recibió token del servidor', 'error');
    }
  } catch (err) {
    console.error(err);
    showMessage(err instanceof Error ? err.message : 'Error de red', 'error');
  }
});
