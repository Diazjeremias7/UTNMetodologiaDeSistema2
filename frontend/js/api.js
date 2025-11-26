const API_URL = 'http://localhost:3000/api';

const api = {
    // Usuarios
    async createUser(userData) {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return response.json();
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