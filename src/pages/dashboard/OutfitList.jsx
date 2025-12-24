import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import api from '../../services/api';

const OutfitList = () => {
  const navigate = useNavigate();
  
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const LIMIT = 8;

  // 🔥 RESİM URL PARSING FONKSİYONU
  const parseImageUrl = (imageData) => {
    const defaultImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
    
    if (!imageData) return defaultImage;
    
    let imageUrl = null;
    
    if (typeof imageData === 'object' && imageData !== null) {
      imageUrl = imageData.url || imageData.path || imageData.secure_url;
    } else if (typeof imageData === 'string') {
      imageUrl = imageData;
    }
    
    if (!imageUrl) return defaultImage;
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
    return `https://embedo1api.ardaongun.com${cleanPath}`;
  };

// Veri Çekme
  const fetchOutfits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let queryParams = `?page=${page}&limit=${LIMIT}`;

      if (debouncedSearch) {
        queryParams += `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      const validBackendSorts = ["newest", "oldest", "a-z", "z-a"];
      if (validBackendSorts.includes(sortOption)) {
        queryParams += `&sort=${sortOption}`;
      }

      console.log("📡 [ADMIN] API İsteği:", `/items/get-items${queryParams}`);

      const response = await api.get(`/items/get-items${queryParams}`);
      
      let dataArray = [];
      let totalPagesData = 1; // Varsayılan 1

      // VERİYİ AYIKLAMA KISMI
      if (response.data?.data?.items) {
        // 1. Senaryo: Backend tam pagination veriyor
        dataArray = response.data.data.items;
        totalPagesData = response.data.data.totalPages || 1;
      } else {
        // 2. Senaryo: Backend düz array veriyor (Sorunlu kısım burasıydı)
        dataArray = response.data.data || response.data || [];
        
        // 🔥 ÇÖZÜM BURADA:
        // Eğer gelen veri sayısı LIMIT (8) kadar veya fazlaysa,
        // kodun "Sonraki" sayfaya geçebilmesi için toplam sayfa sayısını 
        // manuel olarak (bulunduğumuz sayfa + 1) yapıyoruz.
        if (dataArray.length >= LIMIT) {
            totalPagesData = page + 1; 
        } else {
            // Eğer 8'den az veri geldiyse, bu son sayfadır.
            totalPagesData = page;
        }
      }

      // Güvenlik önlemi
      if (totalPagesData < page) totalPagesData = page;

      // VERİYİ İŞLE VE RESİMLERİ PARSE ET
      let processedData = dataArray.map(item => {
        const photoUrl = parseImageUrl(item.image);
        
        let cleanTags = [];
        if (Array.isArray(item.tags)) {
          cleanTags = item.tags.map(tag => {
            if (typeof tag === 'object' && tag !== null) {
              return tag.name || 'Etiket';
            }
            return String(tag);
          });
        }

        return {
          ...item,
          _id: item._id || item.id,
          photo: photoUrl,
          tags: cleanTags,
          value: Number(item.value || item.price || 0)
        };
      });

      // Frontend sıralama
      if (sortOption === "price_asc") {
        processedData.sort((a, b) => a.value - b.value);
      } else if (sortOption === "price_desc") {
        processedData.sort((a, b) => b.value - a.value);
      }
      
      // Slice işlemini kaldırdık çünkü backend zaten sayfalanmış veri gönderiyor.

      setOutfits(processedData);
      setTotalPages(totalPagesData);

    } catch (err) {
      console.error("❌ [ADMIN] Veri çekme hatası:", err);
      setError("Veriler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Arama geciktirme
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Arama yapınca ilk sayfaya dön
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sayfa değişimini izle
  useEffect(() => {
    fetchOutfits();
  }, [page, debouncedSearch, sortOption]);

  // Silme işlemi
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Bu kıyafeti kalıcı olarak silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/items/delete-item/${id}`);
      
      // Silme sonrası liste güncelleme
      if (outfits.length === 1 && page > 1) {
        // Son öğe silindiyse bir önceki sayfaya git
        setPage(page - 1);
      } else {
        fetchOutfits();
      }
      
      alert("✅ Kıyafet başarıyla silindi!");
    } catch (err) {
      console.error("❌ Silme hatası:", err);
      alert("❌ Silinemedi! " + (err.response?.data?.message || "Bir hata oluştu."));
    }
  };

  const handleCardClick = (id) => {
    navigate(`/outfit/${id}`);
  };

  // 🔥 Sayfa değiştirme fonksiyonları
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Koleksiyon Yönetimi</h1>
          <p className="text-gray-500">Tüm kıyafetleri buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/add')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} /> Yeni Ekle
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Kombin adı ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-11 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="a-z">İsim (A-Z)</option>
            <option value="z-a">İsim (Z-A)</option>
            <option value="price_asc">Fiyat (Artan)</option>
            <option value="price_desc">Fiyat (Azalan)</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
          {error}
          <button onClick={() => fetchOutfits()} className="ml-4 underline font-bold">Tekrar Dene</button>
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Sonuç Bulunamadı</h3>
          <p className="text-gray-500">Aradığınız kriterlere uygun kıyafet yok.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {outfits.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleCardClick(item._id)}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition border border-gray-100 group flex flex-col h-full cursor-pointer relative"
              >
                {/* Resim Alanı */}
                <div className="h-56 bg-gray-100 rounded-lg mb-4 overflow-hidden relative flex-shrink-0">
                  <img 
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      console.warn("🖼️ Resim yüklenemedi:", item.photo);
                      e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400';
                    }}
                  />
                  {/* Silme Butonu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => handleDelete(e, item._id)}
                      className="bg-white/90 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Bilgiler */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 line-clamp-1 text-lg" title={item.name}>
                    {item.name || 'İsimsiz'}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-bold flex-shrink-0 ml-2">
                    ₺{item.value}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                  {item.description || 'Açıklama yok'}
                </p>

                {/* Tagler */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center min-h-[40px]">
                  {item.tags && item.tags.length > 0 ? (
                    item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Tag size={12} /> Etiket yok
                    </span>
                  )}
                  {item.tags && item.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{item.tags.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - DÜZELTİLMİŞ */}
          <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`p-2 rounded-lg transition flex items-center gap-1 ${
                page === 1 
                  ? "text-gray-300 cursor-not-allowed" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <ChevronLeft size={24} />
              <span className="text-sm hidden sm:inline">Önceki</span>
            </button>
            
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">
                Sayfa <span className="text-gray-900 font-bold">{page}</span> / {totalPages}
              </span>
              <div className="text-xs text-gray-400 mt-0.5">
                {outfits.length} öğe gösteriliyor
              </div>
            </div>

            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className={`p-2 rounded-lg transition flex items-center gap-1 ${
                page >= totalPages
                  ? "text-gray-300 cursor-not-allowed" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <span className="text-sm hidden sm:inline">Sonraki</span>
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Debug Bilgisi (Geliştirme aşamasında kullanışlı) */}
          <div className="mt-4 text-center text-xs text-gray-400">
            Debug: Sayfa {page}/{totalPages} | Gösterilen: {outfits.length} öğe
          </div>
        </>
      )}
    </div>
  );
};

export default OutfitList;