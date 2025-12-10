import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import useAuthStore from '../../store/useAuthStore';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', formData);
      // API'den gelen veriyi yapına göre düzenle
      const { accessToken, refreshToken } = response.data.data;
      login(accessToken, refreshToken);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Mavi Filtre Katmanı */}
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      </div>

      {/* LOGIN KARTI */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        {/* Kartın Kendisi (Glassmorphism) */}
        <div className="bg-slate-900/60 border border-blue-400/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Giriş Yap</h1>
            <p className="text-blue-200/70 text-sm">Trendleri yakalamaya devam et.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="group">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Adresi"
                  className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="group">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Şifre"
                  className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transform active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Hesabın yok mu?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Hemen Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}