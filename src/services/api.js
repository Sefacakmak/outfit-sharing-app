import axios from 'axios';

// API Base URL
const BASE_URL = 'https://embedo1api.ardaongun.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  // DİKKAT: Buradaki 'headers: { Content-Type... }' kısmını sildik.
  // Bu sayede resim yüklerken tarayıcı doğru ayarı kendi yapacak.
});

// Her isteğe Token ekleyen ayar (Aynı kalıyor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;