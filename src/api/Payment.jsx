import api from './api';

const API_BASE_URL = '/api/Payments';

export const createCheckoutSession = async (orderId) => {
    try {
        const response = await api.post(`${API_BASE_URL}/create-checkout-session`, null, { params: { orderId } });
        return response.data;
    } catch (error) {
        throw new Error('Error creating checkout session: ' + error.message);
    }
};