import apiClient from './client';
import { Server } from '../store/vpnStore';

export const serversApi = {
  getServers: async (): Promise<Server[]> => {
    const response = await apiClient.get('/servers');
    return response.data;
  },

  getConfig: async (serverId: string): Promise<string> => {
    const response = await apiClient.get(`/servers/${serverId}/config`);
    return response.data.config;
  },
};