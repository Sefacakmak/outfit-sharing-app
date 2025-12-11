import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  // Giriş İşlemi
  login: (accessToken, refreshToken) => {
    // Token'ları kaydet
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Token içinden kullanıcı bilgisini ve rolü oku
    const decodedUser = jwtDecode(accessToken);

    set({
      accessToken,
      refreshToken,
      user: decodedUser,
      isAuthenticated: true,
    });
  },

  // Çıkış İşlemi
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  // Access Token Yenileme (Axios interceptor kullanacak)
  setAccessToken: (newAccessToken) => {
    localStorage.setItem('accessToken', newAccessToken);
    const decodedUser = jwtDecode(newAccessToken);
    set({ accessToken: newAccessToken, user: decodedUser });
  },
}));

export default useAuthStore;