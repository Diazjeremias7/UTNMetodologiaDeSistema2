// Sistema de gestión de sesión
const SessionManager = {
    // Inicializar sesión al cargar la página
    init: function () {
        this.updateNavbar();
        this.setupEventListeners();
    },

    // Actualizar navbar según estado de sesión
    updateNavbar: function () {
        const user = api.getCurrentUser && api.getCurrentUser();
        const navbarInstance = document.querySelector('.navbar');

        if (!navbarInstance) return;

        // Buscar o crear contenedor de usuario
        let userMenuContainer = document.getElementById('user-menu-container');

        if (user && user.id) {
            // Usuario logueado
            if (!userMenuContainer) {
                userMenuContainer = document.createElement('div');
                userMenuContainer.id = 'user-menu-container';
                userMenuContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: white;
                `;

                const navLinks = navbarInstance.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.parentElement.insertBefore(userMenuContainer, navLinks.nextSibling);
                }
            }

            // Actualizar contenido del menú de usuario
            userMenuContainer.innerHTML = `
                <span class="user-greeting">Hola, ${user.name || user.email}</span>
                <button class="btn-user-menu" onclick="SessionManager.toggleUserMenu(event)">⚙️</button>
                <div class="user-menu-dropdown" id="userMenuDropdown" style="display: none;">
                    <a href="pages/perfil.html" class="menu-item">👤 Mi Perfil</a>
                    <a href="pages/nueva-reserva.html" class="menu-item">📅 Nueva Reserva</a>
                    <a href="pages/reserva.html" class="menu-item">📋 Mis Reservas</a>
                    <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #ddd;">
                    <a href="javascript:void(0)" onclick="SessionManager.logout()" class="menu-item logout">🚪 Cerrar Sesión</a>
                </div>
            `;
        } else {
            // Usuario no logueado
            if (userMenuContainer) {
                userMenuContainer.remove();
            }
        }
    },

    // Toggle del menú de usuario
    toggleUserMenu: function (event) {
        event.stopPropagation();
        const dropdown = document.getElementById('userMenuDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    },

    // Cerrar dropdown cuando se hace clic afuera
    setupEventListeners: function () {
        document.addEventListener('click', function (event) {
            const dropdown = document.getElementById('userMenuDropdown');
            const btn = event.target.closest('.btn-user-menu');

            if (!btn && dropdown) {
                dropdown.style.display = 'none';
            }
        });
    },

    // Logout del usuario
    logout: function () {
        Feedback.confirm(
            '¿Seguro que deseas cerrar sesión?',
            'Cerrar sesión',
            function () {
                api.logoutUser();
                SessionManager.clearSession();
                Feedback.toast('Sesión cerrada correctamente', 'success');
                setTimeout(() => window.location.href = 'index.html', 1500);
            }
        );
    },

    // Limpiar sesión
    clearSession: function () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateNavbar();
    },

    // Verificar si usuario está logueado
    isLoggedIn: function () {
        return api.getCurrentUser && api.getCurrentUser() !== null;
    },

    // Obtener usuario actual
    getUser: function () {
        return api.getCurrentUser && api.getCurrentUser();
    },

    // Redirigir a login si no está autenticado
    requireLogin: function () {
        if (!this.isLoggedIn()) {
            Feedback.alert('Debes iniciar sesión para acceder', 'error');
            setTimeout(() => window.location.href = 'pages/login.html', 2000);
            return false;
        }
        return true;
    }
};

// Inicializar sesión cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    SessionManager.init();
});
