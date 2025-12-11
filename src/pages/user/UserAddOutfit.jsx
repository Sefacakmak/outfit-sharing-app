import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserAddOutfit = () => {
  const navigate = useNavigate();
  
  // Form verileri
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  
  // Durumlar
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

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

    // Resmi Base64'e çevir
    let imageBase64 = null;
    if (imageFile) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
    }

    // JSON olarak gönder
    const response = await axios.post(
      "https://embedo1api.ardaongun.com/api/items/add-item",
      {
        name: name,
        description: description,
        value: parseFloat(price), // "value" olarak gönder, Postman'de öyle
        tags: [] // Boş array gönder
      },
      {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    alert("Harika! Kombin paylaşıldı.");
    navigate("/explore");

  } catch (error) {
    console.error("Yükleme Hatası:", error);
    alert("Yükleme başarısız! " + (error.response?.data?.message || "Bir hata oluştu."));
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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