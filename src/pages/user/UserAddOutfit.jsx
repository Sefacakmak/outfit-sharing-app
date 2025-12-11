import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserAddOutfit = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedTag, setSelectedTag] = useState(""); 
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const tagsList = ["Casual", "Vintage", "Streetwear", "Sport", "Formal", "Summer", "Winter"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (selectedTag) formData.append("tags", selectedTag); 
      if (imageFile) formData.append("image", imageFile);

      // Token'ı localStorage'dan alıp header'a ekliyoruz (Interceptor yoksa diye garanti olsun)
      const token = localStorage.getItem("accessToken"); 

      await axios.post("https://embedo1api.ardaongun.com/api/outfits", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        }
      });

      alert("Kombin başarıyla yüklendi!");
      navigate("/explore");

    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Hata oluştu. Giriş yaptığınızdan emin olun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Yeni Kombin Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block mb-1 font-medium">Başlık</label>
          <input type="text" required className="w-full border p-2 rounded"
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Açıklama</label>
          <textarea required className="w-full border p-2 rounded h-24"
            value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Fiyat (TL)</label>
            <input type="number" className="w-full border p-2 rounded"
              value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Kategori</label>
            <select className="w-full border p-2 rounded bg-white"
              onChange={(e) => setSelectedTag(e.target.value)} required>
              <option value="">Seç...</option>
              {tagsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Fotoğraf</label>
          <input type="file" accept="image/*" className="w-full border p-2 rounded"
            onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-bold">
          {loading ? "Yükleniyor..." : "Paylaş"}
        </button>
      </form>
    </div>
  );
};

export default UserAddOutfit;