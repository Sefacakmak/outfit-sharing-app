import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OutfitList = () => {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sunucu Adresi
  const IMG_BASE_URL = 'https://embedo1api.ardaongun.com'; 

  // Listeyi Çek
  const fetchOutfits = async () => {
    try {
      const response = await api.get('/items/get-items');
      console.log("Sunucudan Gelen Veri:", response.data);
      
      let dataArray = [];
      // Veri yapısını güvenli şekilde çözüyoruz
      if (response.data?.data?.items && Array.isArray(response.data.data.items)) {
          dataArray = response.data.data.items;
      } else if (Array.isArray(response.data)) {
          dataArray = response.data;
      } else if (response.data?.data?.content) {
          dataArray = response.data.data.content;
      }
      setOutfits(dataArray);
    } catch (err) {
      console.error("Hata:", err);
      setError("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  // SİLME İŞLEMİ
  const handleDelete = async (id) => {
    if (!window.confirm("Bu kıyafeti gerçekten silmek istiyor musun?")) return;

    // Listeden anında sil (Kullanıcı beklemesin)
    const originalOutfits = [...outfits];
    setOutfits(outfits.filter(item => (item._id || item.id) !== id));

    try {
      // API'ye silme isteği gönder
      await api.delete(`/items/delete-item/${id}`);
      console.log("Silme işlemi başarılı:", id);
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silinemedi! Lütfen sayfayı yenileyip tekrar dene.");
      // Hata olursa eski listeyi geri yükle
      setOutfits(originalOutfits);
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Koleksiyonum</h1>
        <button 
          onClick={() => navigate('/dashboard/add')}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          + Yeni Ekle
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {outfits.map((item) => {
          // --- 1. RESİM URL DÜZELTME ---
          let imageUrl = "https://placehold.co/400x300?text=Resim+Yok";
          
          // Konsoldaki resme göre düzeltme: item.image bir obje olabilir!
          let imageSource = item.image;
          
          // Eğer image bir obje ise ve içinde url varsa (Ekran görüntüsündeki gibi)
          if (imageSource && typeof imageSource === 'object' && imageSource.url) {
             imageSource = imageSource.url;
          }

          // Şimdi elimizdeki imageSource bir yazı (string) ise linki oluştur
          if (imageSource && typeof imageSource === 'string') {
             if (imageSource.startsWith('http')) {
                imageUrl = imageSource;
             } else {
                // Başında / yoksa ekleyelim
                const path = imageSource.startsWith('/') ? imageSource : `/${imageSource}`;
                imageUrl = `${IMG_BASE_URL}${path}`;
             }
          }

          
         
          const price = item.price !== undefined ? item.price : item.value;

          const itemId = item._id || item.id;

          return (
            <div key={itemId} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition relative group">
              
              <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={imageUrl}
                  alt={item.name || 'Ürün'}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Hata"; }}
                />
              </div>

              <h3 className="font-bold text-lg mb-1">{item.name || 'İsimsiz'}</h3>
              
              <div className="flex justify-between items-center mt-2">
                 <p className="text-blue-600 font-bold text-xl">
                   {price !== undefined ? `${price} ₺` : 'Fiyat Yok'}
                 </p>
                 
                 <button 
                    onClick={() => handleDelete(itemId)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 px-3 py-1 rounded hover:bg-red-50"
                 >
                    Sil
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutfitList;