import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

const UserAddOutfit = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  
  // 🔥 KRİTİK DEĞİŞİKLİK: Tag ID'leri kullan (isim değil!)
  const [selectedTagIds, setSelectedTagIds] = useState([]); // ID array
  const [availableTags, setAvailableTags] = useState([]); // {_id, name} objeler
  
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Tag'leri yükle
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags/get-tags');
        console.log("📦 Tag API Yanıtı:", response.data);
        
        let tagList = [];
        
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
          console.warn("⚠️ Tag objesi değil:", tag);
          return null;
        }).filter(Boolean);

        console.log("✅ Formatlanmış Tag'ler:", formattedTags);
        setAvailableTags(formattedTags);
        
      } catch (error) {
        console.error("Tag'ler yüklenemedi:", error);
      }
    };

    fetchTags();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 TAG ID İLE ÇALIŞMA
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

  const saveMyOutfitId = (id) => {
    try {
      const ids = JSON.parse(localStorage.getItem("myOutfitIds") || "[]");
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem("myOutfitIds", JSON.stringify(ids));
      }
    } catch (error) {
      console.error("localStorage kayıt hatası:", error);
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

    console.log("📤 [USER] 1. Adım - Item verisi gönderiliyor:", itemData);

    const createResponse = await api.post("/items/add-item", itemData);

    console.log("✅ [USER] 1. Adım - Item oluşturuldu:", createResponse.data);

    const newItemId = createResponse.data?.data?._id || createResponse.data?._id;

    if (!newItemId) {
      throw new Error("Item ID alınamadı");
    }

    // localStorage'a kaydet
    saveMyOutfitId(newItemId);

    // ADIM 2: Resmi Yükle (Varsa)
    if (imageFile) {
      console.log("📸 [USER] 2. Adım - Resim yükleniyor...");
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
      
      console.log("✅ [USER] 2. Adım - Resim yükleme response:", uploadResponse.data);
      
      // 🔥 Response'u detaylı incele
      if (uploadResponse.data) {
        console.log("📋 Upload response keys:", Object.keys(uploadResponse.data));
        console.log("📋 Image data:", uploadResponse.data.data?.image || uploadResponse.data.image);
      }

      // 🔥 KRİTİK: Resmin gerçekten yüklendiğini doğrula
      console.log("🔍 [USER] 3. Adım - Item'ı tekrar çekip resmi kontrol ediyoruz...");
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

    alert("✅ Kombin başarıyla eklendi!");
    
    // Sayfayı yenileyerek güncel veriyi göster
    window.location.href = "/explore";

  } catch (error) {
    console.error("❌ [USER] Hata:", error);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Yeni Kombin Ekle</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Resim Alanı */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition cursor-pointer relative bg-gray-50">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <img src={preview} alt="Önizleme" className="h-48 object-contain rounded shadow-sm" />
            ) : (
              <div className="text-center text-gray-500">
                <span className="text-4xl block mb-2">📸</span>
                <span className="text-sm font-medium">Resim Yüklemek İçin Tıkla</span>
              </div>
            )}
          </div>

          {/* İsim */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Başlık</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Kombin Adı"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              rows="3" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              placeholder="Açıklama"
            />
          </div>

          {/* Fiyat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fiyat (₺)</label>
            <input 
              type="number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder="0"
            />
          </div>

          {/* Tag Seçimi - ID BAZLI */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Etiketler {selectedTagIds.length > 0 && <span className="text-blue-600">({selectedTagIds.length} seçili)</span>}
            </label>
            
            {availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag._id);
                  return (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => handleTagToggle(tag._id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Henüz tag eklenmemiş</p>
            )}
            
            {/* Seçili Tag'lerin İsimleri */}
            {selectedTagIds.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 mb-1">Seçili Etiketler:</p>
                <div className="flex flex-wrap gap-1 mb-1">
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

          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={() => navigate("/explore")} 
              className="w-1/3 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-2/3 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
            >
              {loading ? "Kaydediliyor..." : "Paylaş"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserAddOutfit;