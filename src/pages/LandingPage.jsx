import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* --- NAVBAR (Glassmorphism Effect) --- */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 flex items-center gap-2">
            <span>✨</span> OutfitShare
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Hakkımızda</Link>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Giriş Yap</Link>
            <Link 
              to="/register" 
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Arkaplan Dekorları */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            Yeni Sezon Kombinleri Yayında
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Tarzını Paylaş, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              İlham Kaynağı Ol.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Dünyanın dört bir yanından kombinleri keşfet, kendi benzersiz tarzını oluştur ve binlerce moda tutkunuyla etkileşime geç.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-indigo-600 text-white text-lg px-8 py-4 rounded-full font-bold hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Hemen Başla
            </Link>
            <Link 
              to="/about" 
              className="bg-white text-gray-700 border border-gray-200 text-lg px-8 py-4 rounded-full font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Özellikler</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Platformumuzda sizi bekleyen ayrıcalıklı özelliklerle moda dünyasına hızlı bir giriş yapın.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Kart 1 */}
            <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                👗
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Kombin Keşfi</h3>
              <p className="text-gray-600 leading-relaxed">Binlerce farklı tarz ve trend arasından sana en uygun olanı bul, kaydet ve ilham al.</p>
            </div>

            {/* Kart 2 */}
            <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🏷️
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Akıllı Etiketler</h3>
              <p className="text-gray-600 leading-relaxed">Kıyafetleri "Yaz", "Vintage", "Streetwear" gibi akıllı etiketlerle saniyeler içinde filtrele.</p>
            </div>

            {/* Kart 3 */}
            <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Kolay Paylaşım</h3>
              <p className="text-gray-600 leading-relaxed">Kendi kombinini yükle, toplulukla paylaş, yorumları oku ve beğenileri topla.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (Yeni Eklendi) --- */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
             {/* Dekoratif Daireler */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
             
             <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Moda Yolculuğuna Bugün Başla</h2>
             <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
               Hesabını oluştur ve binlerce stil sahibi kullanıcının arasına katıl. Tamamen ücretsiz.
             </p>
             <Link to="/register" className="relative z-10 bg-white text-indigo-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg">
               Ücretsiz Kayıt Ol
             </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <Link to="/" className="text-2xl font-bold text-white mb-4 block">OutfitShare</Link>
             <p className="max-w-xs">Tarzını keşfetmen ve paylaşman için en iyi platform.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Bağlantılar</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Ana Sayfa</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Hakkımızda</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Giriş Yap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Yasal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition">Kullanım Şartları</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2025 OutfitShare. Tüm hakları saklıdır.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;