import axios from 'axios';

// 1. Point this to your LOCAL FastAPI backend URL while developing
// const API_URL = 'http://localhost:8000/api/v1';

// When you are ready to deploy, comment out the line above and uncomment the line below:
const API_URL = 'https://ipd-collegeapp.onrender.com/api/v1';

// 2. Create a helper to send requests
const api = axios.create({
  baseURL: API_URL,
});

// 3. THE INTERCEPTOR (The Magic Part)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;