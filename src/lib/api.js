import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profile) => {
  const response = await api.put('/auth/profile', { profile });
  return response.data;
};

export const getRecommendations = async (profile) => {
  const response = await api.post('/recommendations', { profile });
  return response.data;
};

export const predictEligibility = async (profile) => {
  const response = await api.post('/predict-eligibility', { profile });
  return response.data;
};

export const chatWithAI = async (messages) => {
  const response = await api.post('/chat', { messages });
  return response.data;
};

export default api;
