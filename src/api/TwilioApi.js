import api from './api';

const API_BASE_URL = '/api/TwilioSms';

export const sendSMS = async (phoneNumber, messageData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/send`, messageData, {
            params: { phoneNumber }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
    }
};

export const sendWhatsApp = async (phoneNumber, messageData) => {
    try {   
        const response = await api.post(`${API_BASE_URL}/SendWhatsapp`, messageData, {
            params: { phoneNumber }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw new Error(error.response?.data?.message || 'Failed to send WhatsApp message');
    }
};

export const getAllSmsHistory = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching SMS history:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch SMS history');
    }
};