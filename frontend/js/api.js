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

    // Registro: /api/users/register
    async registerUser(userData) {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    async getUsers() {
        const response = await fetch(`${API_URL}/users`);
        return response.json();
    },

    // Reservas
    async createReservation(reservationData) {
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers,
            body: JSON.stringify(reservationData),
        });
        return response.json();
    },

        // Login: /api/users/login
        async loginUser(credentials) {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            return response.json();
        },

    async getReservations() {
        const response = await fetch(`${API_URL}/reservations`);
        return response.json();
    },

    async getUserReservations(userId) {
        const token = localStorage.getItem('authToken');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/reservations/user/${userId}`, { headers });
        return response.json();
    },

    async cancelReservation(id) {
        const token = localStorage.getItem('authToken');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
            method: 'PATCH',
            headers,
        });
        return response.json();
    },
};

window.api = api;