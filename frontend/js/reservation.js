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

    container.innerHTML = reservations.map(res => {
        const services = Array.isArray(res.services) 
            ? res.services.join(', ') 
            : (typeof res.services === 'string' ? res.services : 'Ninguno');
        
        return `
        <div class="reservation-card">
          <h3>Reserva #${res.id}</h3>
          <p>Fecha: ${res.date}</p>
          <p>Horario: ${res.time_slot}</p>
          <p>Precio: $${res.total_price?.toLocaleString() || res.total_price}</p>
          <p>Servicios: ${services}</p>
          <p>Estado: ${res.status}</p>
          ${res.status === 'active' ? `
            <button onclick="cancelReservation(${res.id})" class="btn btn-danger">
              Cancelar
            </button>
          ` : ''}
        </div>
        `;
    }).join('');
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

// Crear nueva reserva con validaciones
async function createReservation(event) {
    event.preventDefault();
    console.log('createReservation llamado');

    const formData = new FormData(event.target);
    const services = [];

    if (formData.get('lighting') === 'on') services.push('Iluminación');
    if (formData.get('referee') === 'on') services.push('Árbitro');
    if (formData.get('balls') === 'on') services.push('Pelotas');

    // Validaciones de campos
    const date = formData.get('date');
    const timeSlot = formData.get('timeSlot');

    console.log('Datos del formulario:', { date, timeSlot, services });

    if (!date) {
        showAlert('Debes seleccionar una fecha', 'error');
        return;
    }
    if (!timeSlot) {
        showAlert('Debes seleccionar un horario', 'error');
        return;
    }

    // Obtener usuario logueado
    const user = api.getCurrentUser && api.getCurrentUser();
    console.log('Usuario actual:', user);
    
    if (!user || !user.id) {
        showAlert('Debes iniciar sesión para reservar', 'error');
        window.location.href = 'login.html';
        return;
    }

    const data = {
        userId: user.id,
        date: date,
        timeSlot: timeSlot,
        services: services,
    };

    console.log('Datos a enviar:', data);

    try {
        const result = await api.createReservation(data);
        console.log('Resultado de la API:', result);

        // Adaptar a formato { success, data }
        if (result && (result.success || result.id)) {
            showAlert('Reserva creada exitosamente', 'success');
            event.target.reset();
            // Redirige a la página de listado existente
            setTimeout(() => window.location.href = 'reserva.html', 1000);
        } else {
            const msg = (result && (result.error || result.message)) || 'Error al crear reserva';
            showAlert(msg, 'error');
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

// Actualizar precio dinámicamente
function updatePrice() {
    const basePrice = 10000;
    const prices = {
        lighting: 2000,
        referee: 5000,
        balls: 1000
    };
    
    let total = basePrice;
    const selectedServices = [];
    
    if (document.getElementById('lighting')?.checked) {
        total += prices.lighting;
        selectedServices.push('Iluminación (+$2,000)');
    }
    if (document.getElementById('referee')?.checked) {
        total += prices.referee;
        selectedServices.push('Árbitro (+$5,000)');
    }
    if (document.getElementById('balls')?.checked) {
        total += prices.balls;
        selectedServices.push('Pelotas (+$1,000)');
    }
    
    document.getElementById('totalPrice').textContent = total.toLocaleString();
    
    const servicesDiv = document.getElementById('selectedServices');
    if (selectedServices.length > 0) {
        servicesDiv.innerHTML = '<strong>Servicios seleccionados:</strong><br>' + selectedServices.join('<br>');
    } else {
        servicesDiv.innerHTML = '<strong>Servicios seleccionados:</strong> Ninguno';
    }
}

// Verificar disponibilidad para una fecha
async function checkAvailabilityForDate() {
    const dateInput = document.getElementById('availabilityDate');
    const date = dateInput.value;
    
    if (!date) return;
    
    try {
        const response = await fetch(`http://localhost:3000/api/reservations/availability?date=${date}`);
        const data = await response.json();
        
        if (data.success) {
            displayAvailabilitySlots(data.data);
        } else {
            showAlert('Error al consultar disponibilidad', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// Mostrar slots de disponibilidad
function displayAvailabilitySlots(slots) {
    const grid = document.getElementById('availability-grid');
    const slotsContainer = document.getElementById('availability-slots');
    
    grid.style.display = 'block';
    
    slotsContainer.innerHTML = slots.map(slot => `
        <div style="
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            background: ${slot.available ? '#2ecc71' : '#e74c3c'};
            color: white;
            font-weight: bold;
        ">
            <div>${slot.timeSlot}</div>
            <div style="font-size: 0.9em; margin-top: 5px;">
                ${slot.available ? '✓ Disponible' : '✗ Ocupado'}
            </div>
        </div>
    `).join('');
}