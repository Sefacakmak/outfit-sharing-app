import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // DÜZELTME BURADA YAPILDI:
      // Veri, response.data.data içinde geliyor.
      // Ve ismi 'accessToken' (bitişik).
      const { accessToken, refreshToken, user } = response.data.data; 

      // Token'ı kaydediyoruz
      localStorage.setItem('accessToken', accessToken);
      // Refresh token'ı da kaydedelim (ileride lazım olur)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      set({ 
        isAuthenticated: true, 
        user: user || { email }, // User objesi gelmiyorsa geçici olarak email koyalım
        isLoading: false 
      });

      return true;
    } catch (error) {
      console.error("Login hatası:", error);
      set({ 
        error: error.response?.data?.message || 'Giriş başarısız', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;