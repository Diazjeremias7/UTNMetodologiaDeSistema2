// Cargar datos del perfil y reservas al entrar a la página
document.addEventListener('DOMContentLoaded', async () => {
    const user = api.getCurrentUser && api.getCurrentUser();

    if (!user || !user.id) {
        Feedback.alert('Debes iniciar sesión para acceder al perfil', 'error');
        setTimeout(() => window.location.href = '../index.html', 2000);
        return;
    }

    // Cargar datos del usuario
    loadUserProfile(user);

    // Cargar reservas
    loadUserReservations(user.id);
});

// Cargar datos del perfil del usuario
function loadUserProfile(user) {
    // Avatar con iniciales
    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : user.email?.charAt(0).toUpperCase() || 'U';

    document.getElementById('profileAvatar').textContent = initials;
    document.getElementById('userName').textContent = user.name || 'Usuario';
    document.getElementById('userEmail').textContent = user.email || '-';

    // Detalles del perfil
    document.getElementById('detailEmail').textContent = user.email || '-';
    document.getElementById('detailPhone').textContent = user.phone || '-';
    document.getElementById('detailMemberSince').textContent = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('es-ES')
        : '-';
}

// Cargar reservas del usuario
async function loadUserReservations(userId) {
    try {
        Feedback.loading(true, 'Cargando reservas...');

        let result = await api.getUserReservations(userId);

        // Adaptar a formato array
        const reservations = Array.isArray(result) ? result : result.data || [];

        Feedback.loading(false);

        // Calcular estadísticas
        const stats = {
            active: reservations.filter(r => r.status === 'active').length,
            cancelled: reservations.filter(r => r.status === 'cancelled').length,
            total: reservations.length
        };

        // Actualizar estadísticas en el dashboard
        document.getElementById('statActive').textContent = stats.active;
        document.getElementById('statCancelled').textContent = stats.cancelled;
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('detailTotalReservations').textContent = stats.total;

        // Mostrar últimas 3 reservas
        const latestReservations = reservations.slice(0, 3);
        displayLatestReservations(latestReservations);

        // Mostrar todas las reservas
        displayAllReservations(reservations);

    } catch (error) {
        console.error('Error al cargar reservas:', error);
        Feedback.alert('Error al cargar las reservas', 'error');
        Feedback.loading(false);
    }
}

// Mostrar últimas 3 reservas
function displayLatestReservations(reservations) {
    const container = document.getElementById('reservationsList');

    if (reservations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No tienes reservas aún. <a href="nueva-reserva.html">Crear una nueva</a></p>
            </div>
        `;
        return;
    }

    container.innerHTML = reservations.map(res => `
        <div class="reservation-item ${res.status === 'cancelled' ? 'cancelled' : ''}">
            <div class="reservation-details">
                <h4>Reserva #${res.id}</h4>
                <p><strong>📅 Fecha:</strong> ${formatDate(res.date)}</p>
                <p><strong>🕐 Horario:</strong> ${res.time_slot}</p>
                <p><strong>💰 Precio:</strong> $${res.total_price || '0'}</p>
                <p><strong>🎯 Estado:</strong> <span class="status-badge">${res.status === 'active' ? 'Activa' : 'Cancelada'}</span></p>
                ${res.services && res.services.length > 0 ? `<p><strong>🛠️ Servicios:</strong> ${Array.isArray(res.services) ? res.services.join(', ') : res.services}</p>` : ''}
            </div>
            <div class="reservation-actions">
                ${res.status === 'active' ? `
                    <button class="btn-cancel" onclick="cancelReservationFromProfile(${res.id})">Cancelar</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Mostrar todas las reservas
function displayAllReservations(reservations) {
    const container = document.getElementById('allReservationsList');

    if (reservations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No tienes reservas. <a href="nueva-reserva.html">Haz tu primera reserva</a></p>
            </div>
        `;
        return;
    }

    // Ordenar por fecha descendente
    const sorted = [...reservations].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted.map(res => `
        <div class="reservation-item ${res.status === 'cancelled' ? 'cancelled' : ''}">
            <div class="reservation-details">
                <h4>Reserva #${res.id}</h4>
                <p><strong>📅 Fecha:</strong> ${formatDate(res.date)}</p>
                <p><strong>🕐 Horario:</strong> ${res.time_slot}</p>
                <p><strong>💰 Precio:</strong> $${res.total_price || '0'}</p>
                <p><strong>🎯 Estado:</strong> <span class="status-badge">${res.status === 'active' ? 'Activa' : 'Cancelada'}</span></p>
                ${res.services && res.services.length > 0 ? `<p><strong>🛠️ Servicios:</strong> ${Array.isArray(res.services) ? res.services.join(', ') : res.services}</p>` : ''}
            </div>
            <div class="reservation-actions">
                ${res.status === 'active' ? `
                    <button class="btn-cancel" onclick="cancelReservationFromProfile(${res.id})">Cancelar</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Cancelar reserva desde el perfil
async function cancelReservationFromProfile(id) {
    Feedback.confirm(
        '¿Estás seguro de que deseas cancelar esta reserva?',
        'Confirmar cancelación',
        async function () {
            try {
                Feedback.loading(true, 'Cancelando reserva...');

                const result = await api.cancelReservation(id);

                Feedback.loading(false);

                if (result.success || result.id) {
                    Feedback.toast('Reserva cancelada exitosamente', 'success');

                    // Recargar reservas
                    const user = api.getCurrentUser && api.getCurrentUser();
                    if (user && user.id) {
                        loadUserReservations(user.id);
                    }
                } else {
                    Feedback.alert('Error al cancelar la reserva', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Feedback.loading(false);
                Feedback.alert('Error de conexión', 'error');
            }
        },
        function () {
            Feedback.toast('Cancelación abortada', 'info');
        }
    );
}

// Cerrar sesión
function logoutUser() {
    Feedback.confirm(
        '¿Seguro que deseas cerrar sesión?',
        'Cerrar sesión',
        function () {
            api.logoutUser();
            Feedback.alert('Sesión cerrada correctamente', 'success');
            setTimeout(() => window.location.href = '../index.html', 1500);
        }
    );
}

// Función auxiliar para formatear fechas
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}
