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

export const getMapaAssentos = async (itinerarioId: number) => {
  const res = await api.get(`/api/v1/itinerarios/${itinerarioId}/assentos`);
  return res.data;
};

export const reservarAssento = async (itinerarioId: number, numeroAssento: string) => {
  const res = await api.post(`/api/v1/passagens/reservar-assento`, null, {
    params: { itinerario_id: itinerarioId, numero_assento: numeroAssento }
  });
  return res.data;
};

export default api; 