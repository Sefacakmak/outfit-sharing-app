import axios from 'axios';

// API Base URL
const BASE_URL = 'https://embedo1api.ardaongun.com/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// 1. REQUEST INTERCEPTOR (İstek Atılmadan Önce)
// Her isteğe mevcut token'ı ekler
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. RESPONSE INTERCEPTOR (Cevap Geldikten Sonra - YENİ EKLENEN KISIM)
api.interceptors.response.use(
  (response) => {
    // Cevap başarılıysa (200-299), olduğu gibi döndür
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Hata 401 ise (Yetki Hatası) ve bu isteği daha önce tekrar etmediysek
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Sonsuz döngüye girmemesi için işaretle

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error("Refresh token yok");
        }

        // Token Yenileme İsteği (Refresh Endpoint)
        // NOT: Burada oluşturduğumuz 'api' instance yerine saf 'axios' kullanıyoruz
        // ki interceptor döngüsüne girmesin.
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        // Yeni Access Token'ı al (API yanıt yapısına göre değişebilir, genelde data.data içindedir)
        // useAuthStore.js'de gördüğümüz yapıya göre: response.data.data.accessToken
        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;

        if (!newAccessToken) {
            throw new Error("Yeni access token alınamadı");
        }

        // 1. Yeni token'ı kaydet
        localStorage.setItem('accessToken', newAccessToken);

        // 2. Axios varsayılan header'ını güncelle
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // 3. Başarısız olan orijinal isteğin header'ını güncelle
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 4. Orijinal isteği tekrar dene
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh token da geçersizse veya hata aldıysak
        console.error("Oturum yenilenemedi:", refreshError);
        
        // Kullanıcı verilerini temizle
        localStorage.clear(); // Tüm tokenları siler
        
        // Kullanıcıyı login sayfasına yönlendir
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // 401 dışındaki diğer hataları olduğu gibi fırlat
    return Promise.reject(error);
  }
);

export default api;