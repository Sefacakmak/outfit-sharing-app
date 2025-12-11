import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserAddOutfit = () => {
  const navigate = useNavigate();
  
  // Form verileri
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState([]);
  
  // Durumlar
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [itemId, setItemId] = useState(null);

  // Resim seçildiğinde çalışır
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Seçilen resmin önizlemesini oluştur
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      
      console.log("Token alındı:", token ? "✓ Var" : "✗ Yok");
      console.log("Token uzunluğu:", token?.length);

      // Form verileri
      const itemData = {
        name: name,
        description: description,
        value: value ? parseFloat(value) : 0,
        tags: tags
      };

      console.log("1. Item oluşturuluyor:", itemData);

      const createItemResponse = await axios.post(
        "https://embedo1api.ardaongun.com/api/items/add-item",
        itemData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("API Response tamamı:", createItemResponse.data);
      
      // Response yapısını kontrol et
      const newItemId = createItemResponse.data?.data?._id || createItemResponse.data?.data?.id || createItemResponse.data?._id || createItemResponse.data?.id || null;
      setItemId(newItemId);
      console.log("2. Item oluşturuldu, ID:", newItemId);

      // Adım 2: Resim yükle (eğer varsa ve itemId mevcutsa)
      if (imageFile && newItemId) {
        const photoFormData = new FormData();
        photoFormData.append("file", imageFile);
        photoFormData.append("itemId", newItemId);

        console.log("3. Resim yükleniyor...");

        await axios.post(
          "https://embedo1api.ardaongun.com/api/items/add-item-photo",
          photoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        console.log("4. Resim başarıyla yüklendi");
      } else if (imageFile && !newItemId) {
        console.warn("Resim yüklenemiyor: itemId alınamadı, foto yükleme atlandı.");
      }

      alert("Harika! Kombin paylaşıldı.");
      navigate("/explore");

    } catch (error) {
      console.error("Yükleme Hatası:", error);
      console.error("Hata Detayı:", error.response?.data);
      console.error("Status:", error.response?.status);

      // Eğer yetkisiz ise (401) kullanıcının token'ı temizle ve girişe yönlendir
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        alert("Oturum süreniz dolmuş veya yetkisizsiniz. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      alert("Yükleme başarısız! " + (error.response?.data?.message || error.message || "Bir hata oluştu."));
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
              required
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
              placeholder="Örn: Hafta Sonu Stili"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Kombin detaylarından bahset..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Fiyat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fiyat (₺)</label>
            <input 
              type="number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="0.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {/* Butonlar */}
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
              className="w-2/3 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Yükleniyor...
                </span>
              ) : "Paylaş"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserAddOutfit;