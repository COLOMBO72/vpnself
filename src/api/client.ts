import axios from 'axios';
import { useVpnStore } from '../store/vpnStore';

//const API_URL = 'http://10.0.2.2:3000/api'; // 10.0.2.2 — это localhost для Android эмулятора
const API_URL = 'http://94.241.174.77:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматически добавляем токен к каждому запросу
apiClient.interceptors.request.use((config) => {
  const token = useVpnStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обрабатываем ошибки
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useVpnStore.getState().setToken(null);
      useVpnStore.getState().setUser(null);
    }
    return Promise.reject(error);
  }
);

export default apiClient;