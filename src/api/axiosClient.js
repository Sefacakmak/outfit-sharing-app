import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: 'https://embedo1api.ardaongun.com/api', // [cite: 4]
});

// 1. İstek atılmadan önce araya gir: Token ekle
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Cevap geldiğinde araya gir: Hata var mı bak
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 ise (Yetkisiz) ve daha önce tekrar denenmediyse
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token'ı al
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
            // Refresh token yoksa kullanıcıyı dışarı at
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        // Token yenileme isteği at
        // NOT: API dökümanına göre endpoint farklı olabilir, refresh endpointi genellikle /auth/refresh şeklindedir.
        // Şimdilik standart bir yapı kuruyoruz.
        const response = await axios.post('https://embedo1api.ardaongun.com/api/auth/refresh-token', {
          token: refreshToken, 
        });

        // Yeni token'ı kaydet
        const { accessToken } = response.data; // API cevabına göre burayı düzelteceğiz
        useAuthStore.getState().setAccessToken(accessToken);

        // Orijinal isteği yeni token ile tekrarla
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Yenileme de başarısızsa (Refresh token da ölmüşse) tamamen çıkış yap
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;