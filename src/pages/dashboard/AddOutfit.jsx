import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AddOutfit = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Gizli input'a ulaşmak için referans
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null, // Seçilen dosya burada tutulacak
    imagePreview: null // Önizleme URL'i burada tutulacak
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Resim Seçme Fonksiyonu
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosyayı state'e kaydet
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result // Önizleme için URL oluştur
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Kutucuğa tıklayınca gizli input'u aç
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gönderilen Veri:", formData);
    alert("Kıyafet ve Resim başarıyla eklendi! (Demo)");
    navigate('/dashboard');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Yeni Kıyafet Ekle</h2>
          <p className="text-gray-500 text-sm">Koleksiyonuna yeni bir parça eklemek için formu doldur.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ... Diğer input alanları aynı kalıyor ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kıyafet Adı</label>
            <input 
              type="text" name="name" placeholder="Örn: Yazlık Çiçekli Elbise" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              onChange={handleChange} required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea 
              name="description" rows="4" placeholder="Kıyafet hakkında detaylı bilgi..." 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
              <input 
                type="number" name="price" placeholder="0.00" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                onChange={handleChange} required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select 
                name="category" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                onChange={handleChange} required
              >
                <option value="">Seçiniz...</option>
                <option value="casual">Gündelik (Casual)</option>
                <option value="formal">Resmi (Formal)</option>
                <option value="sport">Spor (Sport)</option>
                <option value="winter">Kışlık (Winter)</option>
              </select>
            </div>
          </div>

          {/* --- RESİM YÜKLEME ALANI (GÜNCELLENDİ) --- */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf</label>
             
             {/* Gizli Input */}
             <input 
               type="file" 
               accept="image/*" 
               ref={fileInputRef} 
               onChange={handleImageChange} 
               className="hidden" 
             />

             {/* Tıklanabilir Alan */}
             <div 
               onClick={handleBoxClick}
               className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative overflow-hidden group
                 ${formData.imagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
             >
                {formData.imagePreview ? (
                  // Resim Seçildiyse Göster
                  <div className="relative">
                    <img 
                      src={formData.imagePreview} 
                      alt="Önizleme" 
                      className="h-48 w-full object-contain mx-auto rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Değiştirmek için tıkla</span>
                    </div>
                  </div>
                ) : (
                  // Resim Yoksa İkon Göster
                  <>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm text-gray-500">Fotoğraf yüklemek için tıklayın</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                  </>
                )}
             </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
             <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">İptal</button>
             <button type="submit" className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Kaydet</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddOutfit;