import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const AddOutfit = () => {
  const navigate = useNavigate();
  
  // State Yönetimi
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  
  // 🔥 CRITICAL: Admin için TAG ID'leri kullanılmalı
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]); // {_id, name} şeklinde objeler
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);

  // Tag Listesini Çek
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setTagsLoading(true);
        console.log("📡 Tag'ler yükleniyor...");
        
        const response = await api.get('/tags/get-tags');
        console.log("📦 Tag API Yanıtı:", response.data);
        
        let tagList = [];
        
        // API yanıtının farklı formatlarını handle et
        if (response.data?.data?.tags) {
          tagList = response.data.data.tags;
        } else if (response.data?.tags) {
          tagList = response.data.tags;
        } else if (Array.isArray(response.data?.data)) {
          tagList = response.data.data;
        } else if (Array.isArray(response.data)) {
          tagList = response.data;
        }

        // Tag'lerin {_id, name} formatında olduğundan emin ol
        const formattedTags = tagList.map(tag => {
          if (typeof tag === 'object' && tag._id) {
            return { _id: tag._id, name: tag.name || 'İsimsiz' };
          }
          // Eğer sadece string ise (olmamalı ama yine de kontrol)
          console.warn("⚠️ Tag objesi değil:", tag);
          return null;
        }).filter(Boolean);

        console.log("✅ Formatlanmış Tag'ler:", formattedTags);
        setAvailableTags(formattedTags);
        
      } catch (error) {
        console.error("❌ Tag listesi yüklenemedi:", error);
        console.error("Hata Detayı:", error.response?.data);
        alert("Tag'ler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.");
      } finally {
        setTagsLoading(false);
      }
    };
    fetchTags();
  }, []);

  // Resim Seçme
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Tag Seçip/Çıkarma (ID bazlı)
  const handleTagToggle = (tagId) => {
    console.log("🔘 Tag tıklandı (ID):", tagId);
    
    if (selectedTagIds.includes(tagId)) {
      // Tag varsa çıkar
      const newTags = selectedTagIds.filter(id => id !== tagId);
      setSelectedTagIds(newTags);
      console.log("➖ Tag çıkarıldı. Yeni liste:", newTags);
    } else {
      // Tag yoksa ekle
      const newTags = [...selectedTagIds, tagId];
      setSelectedTagIds(newTags);
      console.log("➕ Tag eklendi. Yeni liste:", newTags);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // ADIM 1: Item'ı Oluştur
    const itemData = {
      name: name.trim(),
      description: description.trim(),
      value: Number(value) || 0,
      tags: selectedTagIds
    };

    console.log("📤 [ADMIN] 1. Adım - Item verisi gönderiliyor:", itemData);

    const createResponse = await api.post("/items/add-item", itemData);
    
    console.log("✅ [ADMIN] 1. Adım - Item oluşturuldu:", createResponse.data);
    
    const newItemId = createResponse.data?.data?._id || createResponse.data?._id;

    if (!newItemId) {
      throw new Error("Item ID alınamadı");
    }

    // ADIM 2: Resmi Yükle (Varsa)
    if (imageFile) {
      console.log("📸 [ADMIN] 2. Adım - Resim yükleniyor...");
      console.log("- Item ID:", newItemId);
      console.log("- Dosya:", imageFile.name, imageFile.size, "bytes");
      
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("itemId", newItemId);
      
      // FormData içeriğini kontrol et
      console.log("📦 FormData hazır:");
      for (let pair of formData.entries()) {
        console.log(`   - ${pair[0]}:`, pair[1]);
      }

      const uploadResponse = await api.post("/items/add-item-photo", formData);
      
      console.log("✅ [ADMIN] 2. Adım - Resim yükleme response:", uploadResponse.data);
      
      // 🔥 Response'u detaylı incele
      if (uploadResponse.data) {
        console.log("📋 Upload response keys:", Object.keys(uploadResponse.data));
        console.log("📋 Image data:", uploadResponse.data.data?.image || uploadResponse.data.image);
      }

      // 🔥 KRİTİK: Resmin gerçekten yüklendiğini doğrula
      console.log("🔍 [ADMIN] 3. Adım - Item'ı tekrar çekip resmi kontrol ediyoruz...");
      const verifyResponse = await api.get(`/items/get-item/${newItemId}`);
      const verifiedItem = verifyResponse.data?.data || verifyResponse.data;
      
      console.log("📸 Yüklenen resim doğrulaması:");
      console.log("- Item ID:", verifiedItem._id);
      console.log("- Image field:", verifiedItem.image);
      console.log("- Image type:", typeof verifiedItem.image);
      
      if (!verifiedItem.image) {
        console.error("⚠️ UYARI: Resim yüklendi ama item'da image field'ı boş!");
      }
    }

    alert("✅ Kıyafet başarıyla eklendi!");
    navigate("/dashboard/outfits");

  } catch (error) {
    console.error("❌ [ADMIN] Hata:", error);
    console.error("📋 Hata Detayı:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    const msg = error.response?.data?.message || error.message || "Bir hata oluştu.";
    
    // Daha detaylı hata mesajı
    if (error.response?.status === 404) {
      alert("❌ Hata: API endpoint'i bulunamadı.\n\n" + 
            "URL: " + error.config?.url + "\n" +
            "Mesaj: " + msg);
    } else {
      alert("❌ Hata: " + msg);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/outfits')}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Yeni Kıyafet Ekle (Admin)</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon: Resim Yükleme */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-4">Ürün Fotoğrafı</h3>
            
            <div className="relative aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition cursor-pointer overflow-hidden group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {preview ? (
                <>
                  <img src={preview} alt="Önizleme" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-20 pointer-events-none">
                    <span className="text-white font-medium">Fotoğrafı Değiştir</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500 font-medium">Fotoğraf Yükle</span>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG</p>
                </div>
              )}
            </div>
            
            {preview && (
              <button 
                onClick={() => { setPreview(null); setImageFile(null); }}
                className="mt-3 w-full py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition"
              >
                Fotoğrafı Kaldır
              </button>
            )}
          </div>
        </div>

        {/* Sağ Kolon: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            
            {/* İsim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kıyafet Adı</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Örn: Mavi Kot Ceket"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea 
                required 
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Ürün hakkında detaylı bilgi..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            {/* Fiyat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="0.00"
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
              />
            </div>

            {/* Tag Seçimi - DÜZELTİLMİŞ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler {selectedTagIds.length > 0 && <span className="text-blue-600">({selectedTagIds.length} seçili)</span>}
              </label>
              
              {tagsLoading ? (
                <div className="flex justify-center items-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">Etiketler yükleniyor...</p>
                  </div>
                </div>
              ) : availableTags.length > 0 ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => {
                      const isSelected = selectedTagIds.includes(tag._id);
                      
                      return (
                        <button
                          key={tag._id}
                          type="button"
                          onClick={() => handleTagToggle(tag._id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-blue-300'
                          }`}
                        >
                          {isSelected && <span className="mr-1">✓</span>}
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-500 mb-2">⚠️ Henüz sistemde etiket yok.</p>
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard/tags')}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Etiket Yönetimine Git →
                  </button>
                </div>
              )}
              
              {/* Seçili Tag'lerin İsimleri ve ID'leri */}
              {selectedTagIds.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Seçili Etiketler:</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedTagIds.map((id) => {
                      const tag = availableTags.find(t => t._id === id);
                      return (
                        <span key={id} className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          {tag?.name || 'Bilinmiyor'}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-blue-600 font-mono">
                    ID'ler: {selectedTagIds.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Kıyafet Ekle</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOutfit;