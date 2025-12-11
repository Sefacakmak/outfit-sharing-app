import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
      // 1. AŞAMA: Kıyafet Oluşturma
      const itemResponse = await api.post('/items/add-item', {
        name: formData.name,
        description: formData.description,
        
       
        price: Number(formData.price),
        value: Number(formData.price), // Sunucu muhtemelen bunu bekliyor
        
        category: formData.category,
      });

      console.log("1. Aşama Başarılı:", itemResponse.data);

      // ID'yi güvenli bir şekilde alıyoruz
      const newItemId = itemResponse.data.data?._id || itemResponse.data._id;

      if (!newItemId) throw new Error("Kıyafet oluşturuldu ama ID alınamadı.");

      // -------------------------------------------------------
      // 2. AŞAMA: RESİM YÜKLEME (Dosya Verisi)
      // -------------------------------------------------------
      if (formData.image) {
        const photoData = new FormData();
        
        // Postman'de gördüğümüz doğru anahtar: 'file'
        photoData.append('file', formData.image); 
        
        // ID'leri ekliyoruz
        photoData.append('id', newItemId); 
        photoData.append('itemId', newItemId); 

        // ÖNEMLİ: Buraya { headers: ... } eklemiyoruz!
        // api.js'yi düzelttiğimiz için Axios artık bunu doğru paketleyecek.
        await api.post('/items/add-item-photo', photoData);
        
        console.log("2. Aşama Başarılı (Resim Yüklendi)");
      }

      alert("İşlem Başarılı! 🎉");
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Hata Detayı:", error);
      alert("Bir hata oluştu: " + (error.response?.data?.message || "Bağlantı Hatası"));
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kıyafet Adı</label>
            <input type="text" name="name" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea name="description" rows="4" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
              <input type="number" name="price" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select name="category" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all bg-white">
                <option value="">Seçiniz...</option>
                <option value="casual">Gündelik (Casual)</option>
                <option value="formal">Resmi (Formal)</option>
                <option value="sport">Spor (Sport)</option>
                <option value="winter">Kışlık (Winter)</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf</label>
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
             <div onClick={handleBoxClick} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer relative overflow-hidden group ${formData.imagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                {formData.imagePreview ? (
                  <div className="relative">
                    <img src={formData.imagePreview} alt="Önizleme" className="h-48 w-full object-contain mx-auto rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm text-gray-500">Fotoğraf yüklemek için tıklayın</p>
                  </>
                )}
             </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
             <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">İptal</button>
             <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
               {loading ? 'Kaydediliyor...' : 'Kaydet'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutfit;