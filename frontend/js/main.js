// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  setMinDate();
});

// Mobile menu toggle
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });
  }
}

// Establecer fecha mínima en formularios de fecha
function setMinDate() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
}

// Utilidades
const showAlert = (message, type = 'success') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alertDiv, main.firstChild);
  } else {
    document.body.insertBefore(alertDiv, document.body.firstChild);
  }
  
  setTimeout(() => alertDiv.remove(), 5000);
};

// Manejo de errores de fetch
const handleFetchError = (error) => {
  console.error('Error:', error);
  showAlert('Error de conexión con el servidor', 'error');
};

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Export para usar en otros archivos
window.API_URL = API_URL;
window.showAlert = showAlert;
window.handleFetchError = handleFetchError;