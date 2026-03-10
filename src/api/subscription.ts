import apiClient from './client';

export interface SubscriptionStatus {
  plan: 'free' | 'premium';
  subscriptionExpiresAt?: string;
}

export const subscriptionApi = {
  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await apiClient.get('/subscription/status');
    return response.data;
  },

  activate: async (): Promise<SubscriptionStatus> => {
    const response = await apiClient.post('/subscription/activate');
    return response.data;
  },
};