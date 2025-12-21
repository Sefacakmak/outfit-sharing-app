import { useState, useEffect } from "react";
// import axios from "axios"; // ARTIK BUNA GEREK YOK
import { useNavigate } from "react-router-dom";
import api from '../../services/api'; // Bizim oluşturduğumuz güvenli api

const UserAddOutfit = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Tag'leri yükle
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags/get-tags'); // Kısa adres kullanımı
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

        const tagNames = tagList.map(tag => typeof tag === 'object' ? tag.name : String(tag));
        setAvailableTags(tagNames);
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

  const handleTagToggle = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
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
      // Token'ı elle almaya gerek kalmadı, api.js hallediyor.

      // ADIM 1: Ürünü Oluştur (JSON)
      const itemData = {
        name: name,
        description: description,
        value: Number(value),
        tags: selectedTags
      };

      console.log("1. Ürün verisi gönderiliyor...", itemData);

      // Axios yerine 'api' kullanıyoruz ve URL'in sadece sonunu yazıyoruz
      const createResponse = await api.post("/items/add-item", itemData);

      console.log("1. Başarılı! Cevap:", createResponse.data);

      const newItemId = createResponse.data?.data?._id || createResponse.data?._id;

      if (!newItemId) {
        throw new Error("Item ID alınamadı");
      }

      // localStorage'a kaydet
      saveMyOutfitId(newItemId);

      // ADIM 2: Resmi Yükle
      if (imageFile) {
        console.log("2. Resim yükleniyor... ID:", newItemId);
        
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("itemId", newItemId);

        // Content-Type header'ını sildik, Axios FormData olduğunu anlayıp kendi ayarlayacak
        await api.post("/items/add-item-photo", formData);
        
        console.log("2. Resim yüklendi!");
      }

      alert("Kombin başarıyla eklendi!");
      window.location.href = "/explore";

    } catch (error) {
      console.error("Hata:", error);
      alert("Hata: " + (error.response?.data?.message || error.message));
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

          {/* Tag Seçimi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Etiketler (Opsiyonel)</label>
            {availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Henüz tag eklenmemiş</p>
            )}
            
            {selectedTags.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-semibold">Seçili:</span> {selectedTags.join(', ')}
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