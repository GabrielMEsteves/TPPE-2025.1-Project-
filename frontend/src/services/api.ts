import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Altere para o endereço do seu backend
});

// Interceptor para adicionar token JWT se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 