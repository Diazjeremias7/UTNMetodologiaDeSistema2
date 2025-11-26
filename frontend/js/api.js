const API_URL = 'http://localhost:3000/api';

const api = {
    // Usuarios
    async registerUser(userData) {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en registro');
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async loginUser(credentials) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en login');
            // Guardar token o usuario en localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    async getUsers() {
        const response = await fetch(`${API_URL}/users`);
        return response.json();
    },

    // Reservas
    async createReservation(reservationData) {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData),
        });
        return response.json();
    },

    async getReservations() {
        const response = await fetch(`${API_URL}/reservations`);
        return response.json();
    },

    async getUserReservations(userId) {
        const response = await fetch(`${API_URL}/reservations/user/${userId}`);
        return response.json();
    },

    async cancelReservation(id) {
        const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
            method: 'PATCH',
        });
        return response.json();
    },
};

window.api = api;