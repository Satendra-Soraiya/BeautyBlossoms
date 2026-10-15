import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const checkServerHealth = async () => {
  try {
    const res = await api.get('/health');
    return { ok: true, data: res.data };
  } catch (error) {
    return {
      ok: false,
      error: error.response?.data || error.message || 'Server unreachable',
    };
  }
};

export default api;
