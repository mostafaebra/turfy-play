import axios from 'axios';

const api = axios.create({
  // UPDATED: The new stable server URL
  baseURL: '', 
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    // We removed the 'ngrok-skip-browser-warning' header as it is no longer needed
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;