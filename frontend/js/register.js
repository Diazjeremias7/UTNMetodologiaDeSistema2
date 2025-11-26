// frontend/js/register.js
// Validación simple en el cliente y envío a /api/users/register

const form = document.getElementById('registerForm');
const messageEl = document.getElementById('message');

function showMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = 'form-message ' + type;
}

function validateEmail(email) {
  // simple regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage('', '');

  const name = (document.getElementById('name').value || '').trim();
  const email = (document.getElementById('email').value || '').trim();
  const password = document.getElementById('password').value || '';

  if (name.length < 2) return showMessage('El nombre debe tener al menos 2 caracteres.', 'error');
  if (!validateEmail(email)) return showMessage('Email inválido.', 'error');
  if (password.length < 6) return showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');

  try {
    showMessage('Registrando usuario...');

    const result = await window.api.registerUser({ name, email, password });
    // fallback: our API library calls POST /api/users by default; back-end now supports /api/users/register

    // If API returned an error structure, show it
    if (!result || result.success === false) {
      const errMsg = result && result.error ? result.error : 'Error desconocido al crear usuario';
      return showMessage(errMsg, 'error');
    }

    showMessage('Registro exitoso. Ya podés iniciar sesión.', 'success');
    form.reset();
  } catch (err) {
    console.error(err);
    showMessage(err instanceof Error ? err.message : 'Error de red', 'error');
  }
});
