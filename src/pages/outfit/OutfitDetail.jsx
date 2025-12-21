import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Heart, Share2, Tag } from 'lucide-react';
import api from '../../services/api';

const OutfitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const IMG_BASE_URL = 'https://embedo1api.ardaongun.com';

  // Token'dan userId al
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || payload.sub || payload._id;
      }
    } catch (error) {
      console.error("Token okunamadı:", error);
    }
    return null;
  };

  // localStorage'dan kontrol et
  const getMyOutfitIds = () => {
    try {
      const ids = localStorage.getItem("myOutfitIds");
      return ids ? JSON.parse(ids) : [];
    } catch {
      return [];
    }
  };

  // Outfit detayını çek
  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/items/get-item/${id}`);
        
        let outfitData = response.data?.data || response.data;
        
        // Resim URL'sini düzelt
        let photoUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800";
        
        if (outfitData.image) {
          let imageUrl = null;
          
          if (typeof outfitData.image === 'object') {
            imageUrl = outfitData.image.url || outfitData.image.path;
          } else if (typeof outfitData.image === 'string') {
            imageUrl = outfitData.image;
          }
          
          if (imageUrl) {
            if (imageUrl.startsWith('http')) {
              photoUrl = imageUrl;
            } else {
              const cleanUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
              photoUrl = `${IMG_BASE_URL}${cleanUrl}`;
            }
          }
        }

        // Tag'leri temizle - obje ise name'ini al
        let cleanTags = [];
        if (Array.isArray(outfitData.tags)) {
          cleanTags = outfitData.tags.map(tag => {
            if (typeof tag === 'object' && tag !== null) {
              return tag.name || tag._id || 'Tag';
            }
            return String(tag);
          });
        }

        const processedOutfit = {
          _id: String(outfitData._id || outfitData.id),
          name: String(outfitData.name || "İsimsiz"),
          description: String(outfitData.description || "Açıklama yok"),
          value: Number(outfitData.value || outfitData.price || 0),
          tags: cleanTags,
          photo: photoUrl,
          userId: outfitData.userId,
          createdAt: outfitData.createdAt || new Date().toISOString()
        };

        setOutfit(processedOutfit);

        // Sahiplik kontrolü
        const userId = getUserIdFromToken();
        const myOutfitIds = getMyOutfitIds();
        const isMyOutfit = outfitData.userId 
          ? String(outfitData.userId) === String(userId)
          : myOutfitIds.includes(id);
        
        setIsOwner(isMyOutfit);

      } catch (err) {
        console.error("Outfit yüklenemedi:", err);
        setError("Outfit yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [id]);

  // Outfit silme
  const handleDelete = async () => {
    if (!window.confirm("Bu kombini silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/items/delete-item/${id}`);
      alert("Kombin başarıyla silindi!");
      navigate('/explore');
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Kombin silinemedi!");
    }
  };

  // Düzenleme sayfasına git
  const handleEdit = () => {
    navigate(`/edit-outfit/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kombin Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/explore')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Keşfet Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Geri</span>
            </button>

            <div className="flex items-center gap-3">
              {isOwner && (
                <>
                  <button 
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit2 size={18} />
                    <span className="hidden sm:inline">Düzenle</span>
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                    <span className="hidden sm:inline">Sil</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Sol Taraf - Büyük Fotoğraf */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <div className="aspect-[4/5] bg-gray-100 relative group">
                <img 
                  src={outfit.photo} 
                  alt={outfit.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
                  }}
                />
                
                {/* Overlay bilgiler */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 text-white">
                      <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition">
                        <Heart size={24} />
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition">
                        <Share2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full font-medium shadow-lg">
                      Senin Kombin
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Detaylar */}
          <div className="space-y-6">
            
            {/* Başlık ve Açıklama */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{outfit.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{outfit.description}</p>
              
              {/* Fiyat */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-blue-600">₺{outfit.value}</span>
                <span className="text-gray-500 text-lg">TRY</span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Eklenme Tarihi</span>
                  <span className="font-medium text-gray-700">
                    {new Date(outfit.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tag'ler */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Etiketler</h3>
              </div>
              
              {outfit.tags && outfit.tags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {outfit.tags.map((tag, index) => {
                    // Tag'i string'e çevir
                    const tagText = String(tag);
                    return (
                      <span 
                        key={index}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                      >
                        #{tagText}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Tag size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Henüz etiket eklenmemiş</p>
                </div>
              )}
            </div>

            {/* Aksiyonlar */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bu Kombini</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium">
                  <Heart size={20} />
                  Beğen
                </button>
                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-medium">
                  <Share2 size={20} />
                  Paylaş
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Benzer Kombinler */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benzer Kombinler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-200 cursor-pointer">
                <div className="aspect-[3/4] bg-gray-200"></div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">Örnek Kombin</h4>
                  <p className="text-blue-600 font-bold">₺299</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitDetail;