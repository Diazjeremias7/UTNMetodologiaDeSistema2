// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Sistema mejorado de feedback al usuario
const Feedback = {
  // Alerta simple (auto-desaparece)
  alert: (message, type = 'success', duration = 5000) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible`;
    alertDiv.innerHTML = `
            <span>${message}</span>
            <button type="button" class="close" aria-label="Close">&times;</button>
        `;
    alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            min-width: 300px;
            animation: slideIn 0.3s ease-in-out;
        `;

    document.body.appendChild(alertDiv);

    const closeBtn = alertDiv.querySelector('.close');
    closeBtn.addEventListener('click', () => alertDiv.remove());

    setTimeout(() => alertDiv.remove(), duration);
  },

  // Banner persistente (requiere cerrar manualmente)
  banner: (message, type = 'info', dismissible = true) => {
    const bannerId = `banner-${Date.now()}`;
    const bannerDiv = document.createElement('div');
    bannerDiv.id = bannerId;
    bannerDiv.className = `banner banner-${type}`;
    bannerDiv.innerHTML = `
            <div class="banner-content">
                <p>${message}</p>
                ${dismissible ? '<button class="banner-close" onclick="document.getElementById(\'' + bannerId + '\').remove()">✕</button>' : ''}
            </div>
        `;
    bannerDiv.style.cssText = `
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            z-index: 999;
            animation: slideDown 0.3s ease-in-out;
        `;

    document.body.insertBefore(bannerDiv, document.body.firstChild);
    return bannerId;
  },

  // Modal de confirmación
  confirm: (message, title = 'Confirmación', onConfirm, onCancel) => {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal-overlay';
    modalDiv.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove(); ${onCancel ? onCancel.toString() + '()' : ''}">Cancelar</button>
                    <button class="btn btn-danger" onclick="this.closest('.modal-overlay').remove(); ${onConfirm.toString()}()">Confirmar</button>
                </div>
            </div>
        `;
    modalDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            animation: fadeIn 0.3s ease-in-out;
        `;

    document.body.appendChild(modalDiv);
    return modalDiv;
  },

  // Modal informativo
  info: (message, title = 'Información', onClose) => {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal-overlay';
    modalDiv.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); ${onClose ? onClose.toString() + '()' : ''}">Aceptar</button>
                </div>
            </div>
        `;
    modalDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            animation: fadeIn 0.3s ease-in-out;
        `;

    document.body.appendChild(modalDiv);
    return modalDiv;
  },

  // Notificación con icono
  toast: (message, type = 'success') => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const toastDiv = document.createElement('div');
    toastDiv.className = `toast toast-${type}`;
    toastDiv.innerHTML = `
            <span class="toast-icon">${icons[type] || '•'}</span>
            <span class="toast-message">${message}</span>
        `;
    toastDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            min-width: 300px;
            animation: slideUp 0.3s ease-in-out;
        `;

    document.body.appendChild(toastDiv);

    setTimeout(() => toastDiv.remove(), 5000);
  },

  // Mostrar cargando
  loading: (show = true, message = 'Cargando...') => {
    let loader = document.getElementById('feedback-loader');

    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'feedback-loader';
        loader.className = 'loader-overlay';
        loader.innerHTML = `
                    <div class="loader">
                        <div class="spinner"></div>
                        <p>${message}</p>
                    </div>
                `;
        loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                `;
        document.body.appendChild(loader);
      }
    } else {
      if (loader) loader.remove();
    }
  }
};

// Manejo de errores de fetch
const handleFetchError = (error) => {
  console.error('Error:', error);
  Feedback.alert('Error de conexión con el servidor', 'error');
};

// Export para usar en otros archivos
window.API_URL = API_URL;
window.Feedback = Feedback;
window.showAlert = (msg, type) => Feedback.alert(msg, type); // Retrocompatibilidad
window.handleFetchError = handleFetchError;