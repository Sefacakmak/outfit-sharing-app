import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Save, ArrowLeft } from "lucide-react";
import api from '../../services/api';

const AddOutfit = () => {
  const navigate = useNavigate();
  
  // State Yönetimi
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  
  // Tag Yönetimi (ID tabanlı)
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Tag Listesini Çek
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags/get-tags');
        let tagList = [];
        
        // API yanıtını güvenli çözümle
        if (response.data?.data?.tags) {
          tagList = response.data.data.tags;
        } else if (response.data?.tags) {
          tagList = response.data.tags;
        } else if (Array.isArray(response.data?.data)) {
          tagList = response.data.data;
        } else if (Array.isArray(response.data)) {
          tagList = response.data;
        }

        setAvailableTags(tagList);
      } catch (error) {
        console.error("Tag listesi yüklenemedi:", error);
      }
    };
    fetchTags();
  }, []);

  // Resim Seçme
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Tag Seçip/Çıkarma
  const handleTagToggle = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  // KAYDETME İŞLEMİ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ADIM 1: Kıyafet Verisini Gönder (JSON)
      const itemData = {
        name: name,
        description: description,
        value: Number(value),
        tags: selectedTagIds // Backend ID bekliyor
      };

      console.log("📤 Admin Ekleme - Veri:", itemData);

      const createResponse = await api.post("/items/add-item", itemData);
      
      const newItemId = createResponse.data?.data?._id || createResponse.data?._id;

      if (!newItemId) throw new Error("Item ID alınamadı");

      // ADIM 2: Varsa Resmi Yükle (FormData)
      if (imageFile) {
        console.log("📸 Resim yükleniyor... ID:", newItemId);
        
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("itemId", newItemId);

        await api.post("/items/add-item-photo", formData);
      }

      alert("Kıyafet başarıyla eklendi!");
      navigate("/dashboard/outfits"); // Listeye dön

    } catch (error) {
      console.error("Ekleme hatası:", error);
      const msg = error.response?.data?.message || "Bir hata oluştu.";
      
      if (msg.includes("tags")) {
         alert("Hata: Seçilen etiketlerden bazıları sunucuda bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.");
      } else {
         alert("Hata: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
            onClick={() => navigate('/dashboard/outfits')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
        >
            <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Yeni Kıyafet Ekle (Admin)</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon: Resim Yükleme */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">Ürün Fotoğrafı</h3>
                
                <div className="relative aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition cursor-pointer overflow-hidden group">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {preview ? (
                        <>
                            <img src={preview} alt="Önizleme" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-20 pointer-events-none">
                                <span className="text-white font-medium">Fotoğrafı Değiştir</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-500 font-medium">Fotoğraf Yükle</span>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG</p>
                        </div>
                    )}
                </div>
                
                {preview && (
                    <button 
                        onClick={() => { setPreview(null); setImageFile(null); }}
                        className="mt-3 w-full py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition"
                    >
                        Fotoğrafı Kaldır
                    </button>
                )}
            </div>
        </div>

        {/* Sağ Kolon: Form */}
        <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                
                {/* İsim */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kıyafet Adı</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Örn: Mavi Kot Ceket"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>

                {/* Açıklama */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea 
                        required 
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Ürün hakkında detaylı bilgi..."
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>

                {/* Fiyat */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                    <input 
                        type="number" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="0.00"
                        value={value} 
                        onChange={(e) => setValue(e.target.value)} 
                    />
                </div>

                {/* Tag Seçimi (ID Bazlı) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler</label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                        {availableTags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map(tag => {
                                    // Tag objesi kontrolü
                                    const tagId = tag._id || tag.id;
                                    const tagName = tag.name || tag;
                                    
                                    if (!tagId) return null;

                                    const isSelected = selectedTagIds.includes(tagId);
                                    
                                    return (
                                        <button
                                            key={tagId}
                                            type="button"
                                            onClick={() => handleTagToggle(tagId)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                                                isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            {tagName}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-2">
                                <p>Henüz sistemde etiket yok.</p>
                                <button 
                                    onClick={() => navigate('/dashboard/tags')}
                                    className="text-blue-600 text-sm font-medium hover:underline mt-1"
                                >
                                    Etiket Yönetimine Git
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Seçili: {selectedTagIds.length} etiket
                    </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Kaydediliyor...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Kıyafet Ekle</span>
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default AddOutfit;