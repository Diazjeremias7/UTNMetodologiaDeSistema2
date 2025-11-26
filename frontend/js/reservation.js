// Cargar reservas (todas o por usuario si está logueado)
async function loadReservations() {
    try {
        let result;
        const user = api.getCurrentUser && api.getCurrentUser();
        if (user && user.id) {
            result = await api.getUserReservations(user.id);
        } else {
            result = await api.getReservations();
        }

        // Adaptar a formato { success, data }
        if (Array.isArray(result)) {
            displayReservations(result);
        } else if (result.success) {
            displayReservations(result.data);
        } else {
            showAlert('Error al cargar reservas', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// Mostrar reservas
function displayReservations(reservations) {
    const container = document.getElementById('reservations-list');

    if (reservations.length === 0) {
        container.innerHTML = '<p>No hay reservas</p>';
        return;
    }

    container.innerHTML = reservations.map(res => `
    <div class="reservation-card">
      <h3>Reserva #${res.id}</h3>
      <p>Fecha: ${res.date}</p>
      <p>Horario: ${res.time_slot}</p>
      <p>Precio: $${res.total_price}</p>
      <p>Servicios: ${res.services || 'Ninguno'}</p>
      <p>Estado: ${res.status}</p>
      ${res.status === 'active' ? `
        <button onclick="cancelReservation(${res.id})" class="btn btn-danger">
          Cancelar
        </button>
      ` : ''}
    </div>
  `).join('');
}

// Cancelar reserva
async function cancelReservation(id) {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    try {
        const result = await api.cancelReservation(id);

        if (result.success) {
            showAlert('Reserva cancelada', 'success');
            loadReservations();
        } else {
            showAlert('Error al cancelar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// Crear nueva reserva
async function createReservation(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const services = [];

    if (formData.get('lighting')) services.push('Iluminación');
    if (formData.get('referee')) services.push('Árbitro');
    if (formData.get('balls')) services.push('Pelotas');

    // Obtener usuario logueado
    const user = api.getCurrentUser && api.getCurrentUser();
    if (!user || !user.id) {
        showAlert('Debes iniciar sesión para reservar', 'error');
        return;
    }

    const data = {
        userId: user.id,
        date: formData.get('date'),
        timeSlot: formData.get('timeSlot'),
        services: services,
    };

    try {
        const result = await api.createReservation(data);

        // Adaptar a formato { success, data }
        if (result.success || result.id) {
            showAlert('Reserva creada exitosamente', 'success');
            event.target.reset();
            window.location.href = 'reservas.html';
        } else {
            showAlert(result.error || 'Error al crear reserva', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}
// Consultar disponibilidad
async function checkAvailability(date) {
    try {
        const response = await fetch(`${api.API_URL || 'http://localhost:3000/api'}/availability?date=${encodeURIComponent(date)}`);
        if (!response.ok) throw new Error('Error al consultar disponibilidad');
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    setTimeout(() => alert.remove(), 3000);
}