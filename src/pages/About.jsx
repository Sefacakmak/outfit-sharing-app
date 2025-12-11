import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Hakkımızda</h1>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          OutfitShare, moda tutkunlarını bir araya getiren modern bir platformdur. 
          Amacımız, kullanıcıların gardıroplarındaki parçaları en iyi şekilde değerlendirmelerine 
          yardımcı olmak ve yeni stiller keşfetmelerini sağlamaktır.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Bu proje, modern web geliştirme süreçlerini uygulamak amacıyla geliştirilmiştir. 
          Kullanıcı dostu arayüzümüz ve güçlü altyapımız ile moda dünyasına yeni bir soluk getiriyoruz.
        </p>

        <div className="text-center">
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;