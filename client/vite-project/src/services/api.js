import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
};

export const bookingService = {
    create: (customerId, bookingData) => api.post(`/booking/create/${customerId}`, bookingData),
    getDetails: (id) => api.get(`/booking/${id}`),
    getCustomerBookings: (customerId) => api.get(`/booking/customer/${customerId}`),
    getDriverBookings: (driverId) => api.get(`/booking/driver/${driverId}`),
    accept: (id, driverId) => api.put(`/booking/${id}/accept/${driverId}`),
    reject: (id) => api.put(`/booking/${id}/reject`),
};

export const invoiceService = {
    getByBooking: (bookingId) => api.get(`/invoice/booking/${bookingId}`),
};

export const tripService = {
    start: (bookingId) => api.post(`/trip/start/${bookingId}`),
    updateLocation: (tripId, lat, lng) => api.put(`/trip/${tripId}/update-location`, null, { params: { lat, lng } }),
    getDetails: (tripId) => api.get(`/trip/${tripId}`),
    complete: (tripId) => api.post(`/trip/${tripId}/complete`),
};

export const customerService = {
    getProfile: (id) => api.get(`/customer/${id}`),
    updateProfile: (id, data) => api.put(`/customer/${id}`, data),
    addAddress: (id, address) => api.put(`/customer/${id}/address`, null, { params: { address } }),
};

export const walletService = {
    getBalance: (userId) => api.get(`/wallet/${userId}`), 
    addMoney: (userId, amount, method) => api.post(`/wallet/add/${userId}`, null, { params: { amount, method } }),
    withdraw: (userId, amount, method) => api.post(`/wallet/withdraw/${userId}`, null, { params: { amount, method } }),
    getTransactions: (userId) => api.get(`/wallet/transactions/${userId}`),
};

export default api;
