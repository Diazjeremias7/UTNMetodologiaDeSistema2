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