import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddOutfit = () => {
  const navigate = useNavigate();
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]); // Çoklu seçim için dizi
  const [imageFile, setImageFile] = useState(null); // Dosya yükleme için

  const availableTags = ["Casual", "Vintage", "Streetwear", "Sport", "Formal", "Summer", "Winter"];

  const handleTagChange = (e) => {
    // Basit olması için tekli seçim yapıyoruz, çoklu seçim için mantık genişletilebilir
    setTags([e.target.value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. FormData Oluştur (Resim yüklemek için şart)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      // Tagleri API'nin istediği formatta gönderiyoruz
      tags.forEach(tag => formData.append("tags", tag)); 
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // 2. API İsteği Gönder (POST)
      // Content-Type: multipart/form-data olmalı (Axios bunu FormData görünce otomatik yapar)
      await axios.post("https://embedo1api.ardaongun.com/api/outfits", formData);

      alert("Kıyafet başarıyla eklendi!");
      navigate("/explore"); // Listeye geri dön

    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Bir hata oluştu. Lütfen tüm alanları doldurup tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Yeni Kombin Ekle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Başlık */}
        <div>
          <label className="block text-gray-700 mb-1">Başlık</label>
          <input type="text" required className="w-full border p-2 rounded"
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-gray-700 mb-1">Açıklama</label>
          <textarea required className="w-full border p-2 rounded h-24"
            value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Fiyat (Opsiyonel ama genelde olur) */}
        <div>
          <label className="block text-gray-700 mb-1">Fiyat (TL)</label>
          <input type="number" className="w-full border p-2 rounded"
            value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        {/* Tag Seçimi */}
        <div>
          <label className="block text-gray-700 mb-1">Kategori (Tag)</label>
          <select className="w-full border p-2 rounded" onChange={handleTagChange}>
            <option value="">Seçiniz...</option>
            {availableTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Resim Yükleme */}
        <div>
          <label className="block text-gray-700 mb-1">Fotoğraf Yükle</label>
          <input type="file" accept="image/*" className="w-full border p-2 rounded"
            onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 font-bold">
          Paylaş
        </button>

      </form>
    </div>
  );
};

export default AddOutfit;