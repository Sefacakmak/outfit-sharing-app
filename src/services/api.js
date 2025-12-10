import axios from 'axios';

// API Base URL
const BASE_URL = 'https://embedo1api.ardaongun.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- İŞTE EKSİK OLABİLECEK KISIM BURASI ---
// Her istekten önce çalışır ve Token'ı ekler
api.interceptors.request.use((config) => {
  // 1. Token'ı kutudan (localStorage) al
  const token = localStorage.getItem('accessToken');
  
  // 2. Eğer token varsa, isteğin başlığına (Header) yapıştır
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
// -------------------------------------------

export default api;