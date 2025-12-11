import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sayfa her açıldığında eski oturumu temizle (Sorunsuz geçiş için)
  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) { return {}; }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://embedo1api.ardaongun.com/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const token = response.data.data?.accessToken;

      if (token) {
        // 1. Token'ı kaydet
        localStorage.setItem('accessToken', token);

        // 2. Rolü Çöz ve Kaydet
        const decoded = parseJwt(token);
        const role = String(decoded.role || decoded.user?.role || "user").toLowerCase();
        localStorage.setItem('userRole', role);

        // 3. YÖNLENDİRME (Sessiz ve Hızlı)
        if (role.includes("admin") || role.includes("org")) {
           window.location.replace("/dashboard");
        } else {
           window.location.replace("/explore");
        }
        
      } else {
        setError('Giriş başarısız: Token alınamadı.');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgileri kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop")',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Giriş Yap</h1>
          <p className="text-gray-300 text-sm">Trendleri yakalamaya devam et.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Adresi"
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>

          <div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre"
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>

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