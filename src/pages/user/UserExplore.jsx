import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserExplore = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Token'ı al (Giriş yapılmışsa header'a eklemek iyi olur)
    const token = localStorage.getItem("accessToken");

    // 2. İŞTE BULDUĞUMUZ DOĞRU ADRES:
    const API_URL = "https://embedo1api.ardaongun.com/api/items/get-items";

    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    }) 
      .then(res => {
        console.log("Veriler Geldi:", res.data);
        
        // API yapısına göre veriyi yakalıyoruz (Genelde res.data.data içinde olur)
        const items = res.data.data || res.data || [];
        
        // Eğer items bir dizi (array) değilse boş dizi yapalım ki hata vermesin
        setOutfits(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Hata:", err);
        setError("Veri çekilemedi. (404 alıyorsan adres yanlıştır ama bu sefer doğru!)");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Yükleniyor...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Keşfet</h1>
        <Link to="/add-outfit" className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition">
          + Kombin Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outfits.length > 0 ? outfits.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
             <div className="h-48 bg-gray-200 mb-4 rounded-lg overflow-hidden relative">
               <img 
                 // Resim verisi farklı isimlerle gelebilir, hepsini kontrol ediyoruz
                 src={item.image || item.imageUrl || item.photo || "https://placehold.co/400"} 
                 alt="Kıyafet" 
                 className="w-full h-full object-cover"
                 onError={(e) => {e.target.src='https://placehold.co/400?text=Resim+Yok'}}
               />
             </div>
             <h3 className="font-bold text-xl text-gray-800">{item.name || item.title || "İsimsiz"}</h3>
             <p className="text-gray-500 text-sm mb-2">{item.description}</p>
             <p className="text-green-600 font-bold text-lg">{item.price ? `${item.price} ₺` : ""}</p>
          </div>
        )) : (
          <div className="col-span-3 text-center py-10 text-gray-500">
            Hiç kıyafet bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserExplore;