import apiClient from './client';

export const paymentApi = {
  createPayment: async (
    plan: 'monthly' | 'yearly',
  ): Promise<{ paymentUrl: string; paymentId: string }> => {
    const response = await apiClient.post('/payment/create', { plan });
    return response.data;
  },

  checkStatus: async (paymentId: string): Promise<{ status: string; plan?: string }> => {
    const response = await apiClient.get(`/payment/status/${paymentId}`);
    return response.data;
  },
};
