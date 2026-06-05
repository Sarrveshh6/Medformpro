import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/v1',
  headers: {
    'X-API-Key': import.meta.env.VITE_CLINIC_API_KEY || 'clinic_key_xxxxx',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error.response?.data?.error || error);
  }
);
