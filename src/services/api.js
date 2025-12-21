import axios from 'axios';

const api = axios.create({
  baseURL: 'https://embedo1api.ardaongun.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token eklendi:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ Token bulunamadı!');
    }

    // FormData için Content-Type'ı kaldır (axios otomatik ayarlar)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    console.log('📤 API İsteği:', config.method.toUpperCase(), config.url);
    console.log('📦 Gönderilen Veri:', config.data);

    return config;
  },
  (error) => {
    console.error('❌ Request hatası:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Token yenileme
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Yanıtı:', response.status, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ API Hatası:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });

    // 401 hatası ve henüz yenileme yapılmadıysa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          console.error('❌ Refresh token yok, login\'e yönlendiriliyor...');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('🔄 Token yenileniyor...');

        // Token yenileme isteği
        const response = await axios.post(
          'https://embedo1api.ardaongun.com/api/auth/refresh',
          { refreshToken }
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          console.log('✅ Token başarıyla yenilendi!');

          // Orijinal isteği yeni token ile tekrarla
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token yenileme başarısız:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 404 hatası için özel mesaj
    if (error.response?.status === 404) {
      console.error('🔴 404 Hatası - Endpoint bulunamadı!');
      console.error('URL:', error.config?.url);
      console.error('Method:', error.config?.method);
    }

    return Promise.reject(error);
  }
);

export default api;