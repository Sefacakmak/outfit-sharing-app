import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Üst Dekoratif Alan */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-white -z-10" />

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Sol: İçerik Bölümü */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              Hikayemiz
            </div>
            
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Modayı Yeniden <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Keşfetmeye Hazır Mısın?
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              OutfitShare, moda tutkunlarını bir araya getiren modern bir platformdur. 
              Amacımız, kullanıcıların gardıroplarındaki parçaları en iyi şekilde değerlendirmelerine 
              yardımcı olmak ve yeni stiller keşfetmelerini sağlamaktır.
            </p>

            <div className="border-l-4 border-indigo-500 pl-6 italic text-gray-500">
              "Tarz, sadece ne giydiğin değil, kendini nasıl ifade ettiğindir."
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Bu proje, modern web geliştirme süreçlerini uygulamak amacıyla geliştirilmiştir. 
              Kullanıcı dostu arayüzümüz ve güçlü altyapımız ile moda dünyasına yeni bir soluk getiriyoruz.
            </p>

            <div className="pt-4">
              <Link 
                to="/" 
                className="group inline-flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
              >
                ← Ana Sayfaya Dön
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-indigo-800"></span>
              </Link>
            </div>
          </div>

          {/* Sağ: Görsel Alan (Placeholder kullanıldı) */}
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-3 opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Team working together" 
              className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px] hover:scale-[1.02] transition-transform duration-500"
            />
            
            {/* Yüzen İstatistik Kartı */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
              <div className="text-3xl font-bold text-indigo-600">5K+</div>
              <div className="text-gray-500 text-sm">Mutlu Kullanıcı</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;