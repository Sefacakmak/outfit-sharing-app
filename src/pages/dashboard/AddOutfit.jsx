import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Senin oluşturduğun api.js

const AddOutfit = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '', 
    image: null, 
    imagePreview: null 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // -------------------------------------------------------
      // 1. AŞAMA: Kıyafet Verisini Gönder (JSON Formatında)
      // -------------------------------------------------------
      
      // Postman'de 'tags' bir dizi (array) olarak görünüyor.
      // Senin formundaki 'category'yi alıp bir dizinin içine koyuyoruz.
      const tagsArray = formData.category ? [formData.category] : [];

      const itemPayload = {
        name: formData.name,
        description: formData.description,
        value: Number(formData.price), // Postman 'value' bekliyor ve sayı olmalı.
        tags: tagsArray // Backend 'category' değil 'tags' bekliyor.
      };

      console.log("1. İstek Gönderiliyor:", itemPayload);

      // api.js kullandığımız için base URL ve token otomatik eklenir.
      const itemResponse = await api.post('/items/add-item', itemPayload);

      console.log("1. Aşama Başarılı:", itemResponse.data);

      // Yeni oluşan ID'yi güvenli şekilde alıyoruz
      const newItemId = itemResponse.data.data?._id || itemResponse.data._id;

      if (!newItemId) throw new Error("Kıyafet oluşturuldu ama ID alınamadı.");

      // -------------------------------------------------------
      // 2. AŞAMA: RESİM YÜKLEME (FormData Formatında)
      // -------------------------------------------------------
      if (formData.image) {
        console.log("2. Resim yükleniyor... ID:", newItemId);
        
        const photoData = new FormData();
        // Postman'deki 'add item photo' isteğine birebir uyuyoruz
        photoData.append('file', formData.image);  // Anahtar: 'file'
        photoData.append('itemId', newItemId);     // Anahtar: 'itemId'

        // api.js Content-Type'ı otomatik halleder (multipart/form-data)
        await api.post('/items/add-item-photo', photoData);
        
        console.log("2. Aşama Başarılı (Resim Yüklendi)");
      }

      alert("Harika! Kıyafet başarıyla eklendi. 🎉");
      
      // Başarılı olunca listeye atıyoruz. Liste sayfası açıldığında
      // kendi useEffect'i çalışıp yeni veriyi sunucudan çekecektir.
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Hata Detayı:", error);
      const errorMsg = error.response?.data?.message || error.message || "Bir hata oluştu.";
      alert("Hata: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Yeni Kıyafet Ekle</h2>
          <p className="text-gray-500 text-sm">Koleksiyonuna yeni bir parça eklemek için formu doldur.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* İsim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kıyafet Adı</label>
            <input type="text" name="name" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" placeholder="Örn: Mavi Gömlek" />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea name="description" rows="3" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all resize-none" placeholder="Ürün hakkında kısa bilgi..." />
          </div>

          {/* Fiyat ve Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
              <input type="number" name="price" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori (Etiket)</label>
              <select name="category" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all bg-white">
                <option value="">Seçiniz...</option>
                <option value="Casual">Gündelik (Casual)</option>
                <option value="Formal">Resmi (Formal)</option>
                <option value="Sport">Spor (Sport)</option>
                <option value="Winter">Kışlık (Winter)</option>
                <option value="Summer">Yazlık (Summer)</option>
              </select>
            </div>
          </div>

          {/* Resim Yükleme Alanı */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf</label>
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
             <div onClick={handleBoxClick} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer relative overflow-hidden group transition-all ${formData.imagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                {formData.imagePreview ? (
                  <div className="relative">
                    <img src={formData.imagePreview} alt="Önizleme" className="h-64 w-full object-contain mx-auto rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">Değiştirmek için tıkla</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="text-gray-900 font-medium">Fotoğraf Yükle</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 5MB)</p>
                  </div>
                )}
             </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
             <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">İptal</button>
             <button 
                type="submit" 
                disabled={loading} 
                className={`px-8 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all flex items-center gap-2
                  ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}
                `}
             >
               {loading ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Kaydediliyor...
                 </>
               ) : 'Kaydet'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutfit;