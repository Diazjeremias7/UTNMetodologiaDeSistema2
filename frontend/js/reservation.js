// Cargar reservas
async function loadReservations() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const emptyState = document.getElementById('emptyState');
    const container = document.getElementById('reservations-list');

    // Mostrar indicador de carga
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    if (container) container.innerHTML = '';

    try {
        const result = await api.getReservations();

        // Ocultar indicador de carga
        if (loadingIndicator) loadingIndicator.style.display = 'none';

        if (result.success) {
            displayReservations(result.data);
        } else {
            showAlert('Error al cargar reservas', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        showAlert('Error de conexión con el servidor', 'error');
    }
}

// Mostrar reservas
function displayReservations(reservations) {
    const container = document.getElementById('reservations-list');
    const emptyState = document.getElementById('emptyState');

    if (!reservations || reservations.length === 0) {
        if (container) container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = reservations.map(res => `
    <div class="reservation-card">
      <h3>⚽ Reserva #${res.id}</h3>
      <p><strong>📅 Fecha:</strong> ${formatDate(res.date)}</p>
      <p><strong>🕐 Horario:</strong> ${res.time_slot}</p>
      <p><strong>💰 Precio:</strong> $${formatPrice(res.total_price)}</p>
      <p><strong>⚡ Servicios:</strong> ${res.services || 'Ninguno'}</p>
      <p><strong>📊 Estado:</strong> <span class="status-badge status-${res.status}">${translateStatus(res.status)}</span></p>
      ${res.status === 'active' ? `
        <button onclick="cancelReservation(${res.id})" class="btn btn-danger">
          Cancelar Reserva
        </button>
      ` : ''}
    </div>
  `).join('');
}

// Formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Formatear precio
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Traducir estado
function translateStatus(status) {
    const statusMap = {
        'active': 'Activa',
        'cancelled': 'Cancelada',
        'completed': 'Completada'
    };
    return statusMap[status] || status;
}

// Cancelar reserva
async function cancelReservation(id) {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    try {
        const result = await api.cancelReservation(id);

        if (loadingIndicator) loadingIndicator.style.display = 'none';

        if (result.success) {
            showAlert('✓ Reserva cancelada exitosamente', 'success');
            loadReservations();
        } else {
            showAlert('✗ Error al cancelar la reserva', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        showAlert('✗ Error de conexión con el servidor', 'error');
    }
}

// Crear nueva reserva
async function createReservation(event) {
    event.preventDefault();

    const loadingIndicator = document.getElementById('loadingIndicator');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    if (submitButton) submitButton.disabled = true;

    const formData = new FormData(event.target);
    const services = [];

    if (formData.get('lighting')) services.push('Iluminación');
    if (formData.get('referee')) services.push('Árbitro');
    if (formData.get('balls')) services.push('Pelotas');

    const data = {
        userId: parseInt(formData.get('userId')),
        date: formData.get('date'),
        timeSlot: formData.get('timeSlot'),
        services: services,
    };

    try {
        const result = await api.createReservation(data);

        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (submitButton) submitButton.disabled = false;

        if (result.success) {
            showAlert('✓ Reserva creada exitosamente', 'success');
            event.target.reset();
            setTimeout(() => {
                window.location.href = 'reserva.html';
            }, 1500);
        } else {
            showAlert('✗ ' + (result.error || 'Error al crear reserva'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (submitButton) submitButton.disabled = false;
        showAlert('✗ Error de conexión con el servidor', 'error');
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alert, main.firstChild);
    } else {
        document.body.insertBefore(alert, document.body.firstChild);
    }
    
    setTimeout(() => alert.remove(), 5000);
}