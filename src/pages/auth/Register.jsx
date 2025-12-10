import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    organization_id: '1',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Kayıt işlemi başarısız. Lütfen bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* ARKA PLAN - FARKLI BİR MAVİ TON */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1529139574466-a302d2d3f9f4?q=80&w=2500&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-indigo-950/50 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-slate-900/80"></div>
      </div>

      {/* REGISTER KARTI */}
      <div className="relative z-10 w-full max-w-lg p-6 mx-4">
        <div className="bg-slate-900/70 border border-indigo-400/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Aramıza Katıl</h1>
            <p className="text-indigo-200/70 text-sm">Kendi stil dünyanı oluşturmaya başla.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                type="text"
                required
                placeholder="Ad"
                className="bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={handleChange}
              />
              <input
                name="last_name"
                type="text"
                required
                placeholder="Soyad"
                className="bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={handleChange}
              />
            </div>

            <input
              name="email"
              type="email"
              required
              placeholder="Email Adresi"
              className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Şifre"
              className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              onChange={handleChange}
            />

            <input
              name="password_confirmation"
              type="password"
              required
              placeholder="Şifre Tekrar"
              className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              onChange={handleChange}
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-900/20 transform active:scale-95 transition-all duration-200 disabled:opacity-70"
            >
              {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Zaten üye misin?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}