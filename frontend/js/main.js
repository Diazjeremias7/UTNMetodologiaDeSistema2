// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Utilidades
const showAlert = (message, type = 'success') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const main = document.querySelector('main');
  main.insertBefore(alertDiv, main.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
};

// Manejo de errores de fetch
const handleFetchError = (error) => {
  console.error('Error:', error);
  showAlert('Error de conexión con el servidor', 'error');
};

// Export para usar en otros archivos
window.API_URL = API_URL;
window.showAlert = showAlert;
window.handleFetchError = handleFetchError;