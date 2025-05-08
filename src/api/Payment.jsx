import api from './api';

const API_BASE_URL = '/api/Payments';

export const createCheckoutSession = async (orderId) => {
    try {
        // Ensure orderId is being passed correctly
        if (!orderId) {
            throw new Error('Order ID is required');
        }

        // Make API call with orderId in the request URL
        const response = await api.post(`${API_BASE_URL}/create-checkout-session?orderId=${encodeURIComponent(orderId)}`);

        // Log response for debugging
        console.log('Stripe session response:', response);

        if (!response.data || !response.data.url) {
            throw new Error('Invalid response from payment server');
        }

        return response.data;
    } catch (error) {
        // Add more detailed error logging
        console.error('Payment API error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            error: error
        });
        
        // Throw more specific error based on response
        if (error.response?.status === 400) {
            throw new Error(`Invalid order ID or order not found: ${orderId}`);
        }
        throw new Error(`Failed to create checkout session: ${error.message}`);
    }
};