import apiClient from './client';
import { User } from '../store/vpnStore';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/auth/delete-account');
  },
};
