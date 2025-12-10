import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import OutfitCard from '../../components/OutfitCard';

const OutfitList = () => {
  const navigate = useNavigate();
  
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        // DOĞRU ADRES: /items/get-items
        // Parametreleri de ekledik (sort, page, limit)
        const response = await api.get('/items/get-items?sort=a-z&page=1&limit=20');
        
        console.log("Gelen Veri:", response.data); // Konsoldan yapıyı kontrol edebiliriz

        // API'den gelen verinin yapısına göre burayı ayarlıyoruz.
        // Genelde response.data.items veya response.data.content içinde olur.
        // Eğer direkt dizi geliyorsa response.data yeterlidir.
        // Şimdilik response.data.items || response.data diyelim garanti olsun.
        setOutfits(response.data.items || response.data); 

      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError("Kıyafetler yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Kıyafet Koleksiyonu</h1>
           <p className="text-gray-500 mt-1">Mağazandaki tüm ürünleri buradan yönet.</p>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard/add')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 font-medium"
        >
          <span>+</span> Yeni Kıyafet Ekle
        </button>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Kıyafetler yükleniyor...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-8 border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && outfits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {outfits.map((outfit) => (
            // NOT: Backend 'id' yerine '_id' gönderebilir, ona dikkat.
            <OutfitCard key={outfit._id || outfit.id} outfit={outfit} />
          ))}
        </div>
      )}

      {!loading && !error && outfits.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">👕</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz kıyafet eklemediniz</h3>
            <p className="text-gray-500 mb-6">İlk kıyafetinizi ekleyerek satışa başlayın.</p>
            <button 
               onClick={() => navigate('/dashboard/add')}
               className="text-blue-600 font-semibold hover:underline"
            >
               Hemen Ekle
            </button>
        </div>
      )}
    </div>
  );
};

export default OutfitList;