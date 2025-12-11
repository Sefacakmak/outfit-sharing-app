import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- NAVBAR BÖLÜMÜ [cite: 55] --- */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            OutfitShare
          </Link>
          <div className="space-x-4">
            <Link to="/about" className="text-gray-600 hover:text-indigo-600">Hakkımızda</Link>
            {/* Login ve Register butonları [cite: 55] */}
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Giriş Yap</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Slogan + CTA) [cite: 57] --- */}
      <header className="bg-indigo-50 py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Tarzını Paylaş, İlham Ver!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Dünyanın dört bir yanından kombinleri keşfet, kendi tarzını oluştur ve moda tutkunlarıyla paylaş.
          </p>
          <Link 
            to="/register" 
            className="bg-indigo-600 text-white text-lg px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow-lg"
          >
            Hemen Başla
          </Link>
        </div>
      </header>

      {/* --- FEATURES SECTION (Özellik Kartları) [cite: 58] --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Öne Çıkan Özellikler</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Kart 1 */}
            <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-bold mb-2">Kombin Keşfi</h3>
              <p className="text-gray-600">Binlerce farklı tarz arasından sana en uygun olanı bul ve ilham al.</p>
            </div>

            {/* Kart 2 */}
            <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🏷️</div>
              <h3 className="text-xl font-bold mb-2">Akıllı Etiketler</h3>
              <p className="text-gray-600">Kıyafetleri "Yaz", "Vintage", "Spor" gibi etiketlerle kolayca filtrele.</p>
            </div>

            {/* Kart 3 */}
            <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Kolay Paylaşım</h3>
              <p className="text-gray-600">Kendi kombinini yükle, toplulukla paylaş ve beğenileri topla.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER [cite: 59] --- */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 OutfitShare. Tüm hakları saklıdır.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;