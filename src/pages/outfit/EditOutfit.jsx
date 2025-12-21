import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import api from '../../services/api';

const EditOutfit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    tags: [],
    currentImage: null,
    newImage: null,
    imagePreview: null
  });

  const [availableTags, setAvailableTags] = useState([]);

  const IMG_BASE_URL = 'https://embedo1api.ardaongun.com';

  // Mevcut outfit'i yükle
  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        setLoading(true);

        // Outfit detayını çek
        const outfitResponse = await api.get(`/items/get-item/${id}`);
        const outfitData = outfitResponse.data?.data || outfitResponse.data;

        // Resim URL'sini düzelt
        let photoUrl = null;
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

        setFormData({
          name: outfitData.name || '',
          description: outfitData.description || '',
          value: outfitData.value || outfitData.price || '',
          tags: cleanTags,
          currentImage: photoUrl,
          newImage: null,
          imagePreview: null
        });

        // Tag'leri çek
        const tagsResponse = await api.get('/tags/get-tags');
        let tagList = [];
        
        if (tagsResponse.data?.data?.tags) {
          tagList = tagsResponse.data.data.tags;
        } else if (tagsResponse.data?.tags) {
          tagList = tagsResponse.data.tags;
        } else if (Array.isArray(tagsResponse.data?.data)) {
          tagList = tagsResponse.data.data;
        } else if (Array.isArray(tagsResponse.data)) {
          tagList = tagsResponse.data;
        }

        setAvailableTags(tagList.map(tag => typeof tag === 'object' ? tag.name : String(tag)));

      } catch (err) {
        console.error("Outfit yüklenemedi:", err);
        setError("Outfit yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [id]);

  // Input değişikliklerini yakala
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Tag seçimi - Sadece var olan tag'leri kontrol et
  const handleTagToggle = (tagName) => {
    const currentTags = formData.tags || [];
    
    // Bu tag sistemde var mı kontrol et
    if (!availableTags.includes(tagName)) {
      alert(`"${tagName}" tag'i sistemde mevcut değil. Lütfen Tag Yönetimi'nden önce oluşturun.`);
      return;
    }
    
    if (currentTags.includes(tagName)) {
      // Tag varsa çıkar
      setFormData({
        ...formData,
        tags: currentTags.filter(t => t !== tagName)
      });
    } else {
      // Tag yoksa ekle
      setFormData({
        ...formData,
        tags: [...currentTags, tagName]
      });
    }
  };

  // Resim seçimi
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          newImage: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Resim seçimini iptal et
  const handleCancelImage = () => {
    setFormData({
      ...formData,
      newImage: null,
      imagePreview: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Formu kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1. AŞAMA: Outfit bilgilerini güncelle
      const updatePayload = {
        name: formData.name,
        description: formData.description,
        value: Number(formData.value),
        tags: formData.tags
      };

      console.log("1. Outfit güncelleniyor:", updatePayload);

      await api.patch(`/items/update-item/${id}`, updatePayload);

      console.log("1. Outfit bilgileri güncellendi!");

      // 2. AŞAMA: Eğer yeni resim seçildiyse resmi güncelle
      if (formData.newImage) {
        console.log("2. Resim güncelleniyor...");
        
        const photoData = new FormData();
        photoData.append('file', formData.newImage);
        photoData.append('itemId', id);

        await api.post('/items/add-item-photo', photoData);
        
        console.log("2. Resim güncellendi!");
      }

      alert("Kombin başarıyla güncellendi! 🎉");
      navigate(`/outfit/${id}`);

    } catch (error) {
      console.error("Güncelleme hatası:", error);
      const errorMsg = error.response?.data?.message || error.message || "Bir hata oluştu.";
      setError(errorMsg);
      alert("Hata: " + errorMsg);
    } finally {
      setSaving(false);
    }
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

  if (error && !formData.name) {
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

  const displayImage = formData.imagePreview || formData.currentImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(`/outfit/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">İptal</span>
            </button>

            <h1 className="text-xl font-bold text-gray-900">Kombini Düzenle</h1>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                saving 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <Save size={18} />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Resim Alanı */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Fotoğraf
            </label>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="space-y-4">
              {displayImage ? (
                <div className="relative">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={displayImage}
                      alt="Kombin"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
                      }}
                    />
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    {formData.imagePreview && (
                      <button
                        type="button"
                        onClick={handleCancelImage}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Upload size={20} />
                    </button>
                  </div>

                  {formData.imagePreview && (
                    <div className="mt-2 text-center">
                      <span className="text-sm text-green-600 font-medium">
                        ✓ Yeni resim seçildi (Kaydet'e basın)
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition"
                >
                  <Upload size={48} className="text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">Fotoğraf Yükle</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                </button>
              )}
            </div>
          </div>

          {/* Başlık */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kombin Adı
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Örn: Yazlık Kombin"
            />
          </div>

          {/* Açıklama */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Kombin hakkında detaylı bilgi..."
            />
          </div>

          {/* Fiyat */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fiyat (₺)
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="0"
            />
          </div>

          {/* Tag Seçimi */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Etiketler
            </label>
            
            {availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {availableTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Henüz etiket eklenmemiş</p>
              </div>
            )}

            {formData.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Seçili:</span>{' '}
                  {formData.tags.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Alt Butonlar */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/outfit/${id}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition font-medium ${
                saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <Save size={20} />
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOutfit;