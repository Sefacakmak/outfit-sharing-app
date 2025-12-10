import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    // Arka plan resmi ve karanlık katman
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop")',
      }}
    >
      {/* Koyu Mavi Overlay (Katman) */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

      {/* Login Kartı (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-md">
        
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Giriş Yap</h1>
          <p className="text-gray-300 text-sm">Trendleri yakalamaya devam et.</p>
        </div>

        {/* Hata Mesajı (Varsa) */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sefa@embedlab.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>

          {/* Şifre Input */}
          <div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>

          {/* Buton */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg text-white font-semibold transition-all shadow-lg shadow-blue-600/30
              ${isLoading 
                ? 'bg-blue-800 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02]'
              }`}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>

        </form>

        {/* Kayıt Ol Linki */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors">
            Hemen Kayıt Ol
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;