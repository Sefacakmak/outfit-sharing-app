import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import api from '../../services/api';

const OutfitList = () => {
  const navigate = useNavigate();
  
  // --- STATE YÖNETİMİ ---
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfalama & Filtreleme
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const LIMIT = 8; // Her sayfada kaç ürün görünsün

  // Veri Çekme Fonksiyonu
  const fetchOutfits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Backend'e sayfalama parametrelerini gönderiyoruz
      let queryParams = `?page=${page}&limit=${LIMIT}`;

      if (debouncedSearch) {
        queryParams += `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      // Backend sıralamayı destekliyorsa ekle
      const validBackendSorts = ["newest", "oldest", "a-z", "z-a"];
      if (validBackendSorts.includes(sortOption)) {
        queryParams += `&sort=${sortOption}`;
      }

      const response = await api.get(`/items/get-items${queryParams}`);
      console.log("📥 API Yanıtı:", response.data); // Hata ayıklama için

      let dataArray = [];
      let totalPagesData = 1;
      let isServerSidePagination = false;

      // 1. İHTİMAL: Backend sayfalamayı destekliyor ve 'items' içinde dönüyor
      if (response.data?.data?.items) {
          dataArray = response.data.data.items;
          totalPagesData = response.data.data.totalPages || 1;
          isServerSidePagination = true;
      } 
      // 2. İHTİMAL: Backend sayfalamayı desteklemiyor, düz array dönüyor (Tüm veriyi gönderiyor)
      else if (response.data?.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
          isServerSidePagination = false;
      } 
      // 3. İHTİMAL: Direkt array dönüyor
      else if (Array.isArray(response.data)) {
          dataArray = response.data;
          isServerSidePagination = false;
      }

      // --- VERİYİ İŞLEME VE DÜZELTME ---
      let processedData = dataArray.map(item => {
          // Resim URL Düzeltme
          let imageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
          if (item.image) {
            let rawUrl = typeof item.image === 'object' ? (item.image.url || item.image.path) : item.image;
            if (rawUrl) {
                if (rawUrl.startsWith('http')) {
                    imageUrl = rawUrl;
                } else {
                    const cleanUrl = rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl;
                    imageUrl = `https://embedo1api.ardaongun.com${cleanUrl}`;
                }
            }
          }

          // Tag İsimlerini Ayıklama
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
              photo: imageUrl,
              tags: cleanTags,
              value: Number(item.value || item.price || 0)
          };
      });

      // --- SAYFALAMA MANTIĞI (Kritik Düzeltme) ---
      
      if (isServerSidePagination) {
        // Backend sayfalamayı yapmış, direkt kullan
        setOutfits(processedData);
        setTotalPages(totalPagesData);
      } else {
        // Backend tüm veriyi göndermiş, biz tarayıcıda sayfalayacağız (Client-Side)
        
        // Önce Frontend Sıralama (Eğer gerekiyorsa)
        if (sortOption === "price_asc") processedData.sort((a, b) => a.value - b.value);
        else if (sortOption === "price_desc") processedData.sort((a, b) => b.value - a.value);
        else if (sortOption === "newest") processedData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); // Tarih yoksa hata vermesin diye 0

        // Toplam sayfa sayısını kendimiz hesaplıyoruz
        const calculatedTotalPages = Math.ceil(processedData.length / LIMIT);
        setTotalPages(calculatedTotalPages || 1);

        // O anki sayfanın verisini kesip alıyoruz
        const startIndex = (page - 1) * LIMIT;
        const endIndex = startIndex + LIMIT;
        setOutfits(processedData.slice(startIndex, endIndex));
      }

    } catch (err) {
      console.error("Hata:", err);
      setError("Veriler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Arama geciktirme
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sayfa değişimini izle
  useEffect(() => {
    fetchOutfits();
  }, [page, debouncedSearch, sortOption]);

  // SİLME İŞLEMİ
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Bu kıyafeti kalıcı olarak silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/items/delete-item/${id}`);
      fetchOutfits(); 
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silinemedi! " + (err.response?.data?.message || "Bir hata oluştu."));
    }
  };

  const handleCardClick = (id) => {
    navigate(`/outfit/${id}`);
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

            {/* Pagination Kontrolleri */}
            <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`p-2 rounded-lg transition ${
                        page === 1 
                        ? "text-gray-300 cursor-not-allowed" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                >
                    <ChevronLeft size={24} />
                </button>
                
                <span className="text-sm font-medium text-gray-600">
                    Sayfa <span className="text-gray-900 font-bold">{page}</span> / {totalPages || 1}
                </span>

                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages}
                    className={`p-2 rounded-lg transition ${
                        page >= totalPages
                        ? "text-gray-300 cursor-not-allowed" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </>
      )}
    </div>
  );
};

export default OutfitList;