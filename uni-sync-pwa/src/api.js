import axios from 'axios';

// 1. Point this to your FastAPI backend URL
// Ensure your backend is running on port 8000!
// 1. Point this to your LIVE Render backend URL
const API_URL = 'https://ipd-collegeapp.onrender.com/api/v1';

// 2. Create a helper to send requests
const api = axios.create({
  baseURL: API_URL,
});

// 3. THE INTERCEPTOR (The Magic Part)
// Before every request, check if we have a token in the pocket (localStorage).
// If yes, attach it to the header.
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