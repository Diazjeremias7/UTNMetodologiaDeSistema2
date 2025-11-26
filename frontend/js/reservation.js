// Cargar reservas
async function loadReservations() {
    try {
        const result = await api.getReservations();

        if (result.success) {
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

    const data = {
        userId: parseInt(formData.get('userId')),
        date: formData.get('date'),
        timeSlot: formData.get('timeSlot'),
        services: services,
    };

    try {
        const result = await api.createReservation(data);

        if (result.success) {
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

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    setTimeout(() => alert.remove(), 3000);
}