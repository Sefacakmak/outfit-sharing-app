import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();

  // --- KULLANICI BİLGİLERİ STATE'İ ---
  const [formData, setFormData] = useState({
    username: '', // API genelde 'first_name' değil 'username' bekler (dokümana göre)
    email: '',
    password: '',
    password_confirmation: '', // Şifre tekrarı kontrolü için
  });

  const ORGANIZATION_ID = 'e5eb2d2a-99f8-427a-b109-fccd62b0d982';

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Input değişikliklerini yakala
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Şifre Eşleşme Kontrolü
    if (formData.password !== formData.password_confirmation) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);

    try {
      // 2. API'ye Gönderilecek Paketi Hazırla
      // Organizasyon ID'sini buraya ekliyoruz
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        organizationId: ORGANIZATION_ID // API'nin istediği format
      };

      // 3. İstek Gönder (URL'yi kontrol edin)
      await axios.post('https://embedo1api.ardaongun.com/api/auth/register', payload);

      // 4. Başarılı ise Login'e yönlendir
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      navigate('/login');

    } catch (err) {
      console.error(err);
      // Hata mesajını API'den almaya çalış, yoksa standart mesaj göster
      const errorMessage = err.response?.data?.message || 'Kayıt işlemi başarısız. Bilgileri kontrol edin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      
      {/* ARKA PLAN */}
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
            
            {/* Kullanıcı Adı */}
            <input
                name="username"
                type="text"
                required
                placeholder="Kullanıcı Adı"
                className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={handleChange}
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              required
              placeholder="Email Adresi"
              className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              onChange={handleChange}
            />

            {/* Şifre */}
            <input
              name="password"
              type="password"
              required
              placeholder="Şifre"
              className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              onChange={handleChange}
            />

            {/* Şifre Tekrar */}
            <input
              name="password_confirmation"
              type="password"
              required
              placeholder="Şifre Tekrar"
              className="w-full bg-slate-950/50 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              onChange={handleChange}
            />

            {/* Hata Mesajı */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                {typeof error === 'string' ? error : 'Bir hata oluştu.'}
              </div>
            )}

            {/* Kayıt Butonu */}
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