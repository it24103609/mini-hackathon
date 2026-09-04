import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mini-hackathon-production-aa2a.up.railway.app/api'
});

// Automatically attach Authorization token if user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('medfind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
