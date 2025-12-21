import { useState, useEffect } from "react";
import { Plus, Heart, Search, User, Compass, RefreshCw, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../services/api'; 

export default function UserExplore() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- STATE YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState("explore"); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination, Search, Sort & Filter State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  
  // Filtreleme State'leri
  const [sortOption, setSortOption] = useState("newest"); // Varsayılan
  const [selectedTag, setSelectedTag] = useState(null);   
  const [availableTags, setAvailableTags] = useState([]); 
  
  const LIMIT = 9; 

  // Token'dan User ID okuma
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || payload.sub || payload._id;
      }
    } catch (error) {
      console.error("Token okunamadı:", error);
    }
    return null;
  };

  // LocalStorage'daki kombinlerimi okuma
  const getMyOutfitIds = () => {
    try {
      const ids = localStorage.getItem("myOutfitIds");
      return ids ? JSON.parse(ids) : [];
    } catch {
      return [];
    }
  };

  // Tag Listesini Çek (Filtreleme butonları için)
  const fetchTags = async () => {
    try {
      const response = await api.get('/tags/get-tags');
      let tagList = [];
      if (response.data?.data?.tags) tagList = response.data.data.tags;
      else if (response.data?.tags) tagList = response.data.tags;
      else if (Array.isArray(response.data?.data)) tagList = response.data.data;
      
      const tagNames = tagList.map(t => typeof t === 'object' ? t.name : String(t));
      setAvailableTags(tagNames);
    } catch (error) {
      console.error("Tagler yüklenemedi:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Backend verisini UI formatına çevir
  const mapBackendDataToDesign = (dataList, currentUserId, myOutfitIds) => {
    if (!Array.isArray(dataList)) return [];

    return dataList.map(item => {
      let photoUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
      
      if (item.image) {
        let imageUrl = null;
        if (typeof item.image === 'object') {
          imageUrl = item.image.url || item.image.path || item.image.secure_url;
        } else if (typeof item.image === 'string') {
          imageUrl = item.image;
        }
        
        if (imageUrl) {
           if (imageUrl.startsWith('http')) {
             photoUrl = imageUrl;
           } else {
             const cleanUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
             photoUrl = `https://embedo1api.ardaongun.com${cleanUrl}`;
           }
        }
      }

      let cleanTags = [];
      if (Array.isArray(item.tags)) {
        cleanTags = item.tags.map(tag => {
          if (typeof tag === 'object' && tag !== null) return tag.name || tag._id || 'Tag';
          return String(tag);
        });
      }

      let isMine = false;
      if (item.userId && item.userId !== null) {
        isMine = String(item.userId) === String(currentUserId);
      } else {
        isMine = myOutfitIds.includes(item._id);
      }

      return {
        _id: String(item._id || item.id),
        name: String(item.name || "İsimsiz"),
        description: String(item.description || "Açıklama yok"),
        value: Number(item.value || item.price || 0),
        tags: cleanTags,
        photo: photoUrl,
        isMine: isMine,
        createdAt: item.createdAt 
      };
    });
  };

  // --- VERİ ÇEKME FONKSİYONU ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = getUserIdFromToken();
      const myOutfitIds = getMyOutfitIds();
      
      // Temel Query Parametreleri
      let queryParams = `?page=${page}&limit=${LIMIT}`;
      
      // Arama Ekle
      if (debouncedSearch) {
        queryParams += `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      // Tag Filtresi Ekle 
      if (selectedTag) {
        queryParams += `&tag=${encodeURIComponent(selectedTag)}`;
      }

      // 🔥 KRİTİK DÜzELTME: Backend'in kabul ettiği sort değerlerini kullan
      const validBackendSorts = ["newest", "oldest", "a-z", "z-a"];
      
      if (validBackendSorts.includes(sortOption)) {
        queryParams += `&sort=${sortOption}`;
      }
      
      // 🐛 DEBUG: Hangi URL'ye istek atıldığını görelim
      console.log("📡 API İsteği:", `/items/get-items${queryParams}`);

      const response = await api.get(`/items/get-items${queryParams}`);

      let rawData = [];
      let totalPagesData = 1;

      if (response.data?.data && Array.isArray(response.data.data)) {
         rawData = response.data.data;
      } else if (response.data?.data?.items) {
         rawData = response.data.data.items;
         totalPagesData = response.data.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
         rawData = response.data;
      }

      setTotalPages(totalPagesData);
      
      let cleanData = mapBackendDataToDesign(rawData, userId, myOutfitIds);
      
      // Tab Filtresi (Explore vs My Outfits)
      if (activeTab === "explore") {
        cleanData = cleanData.filter(item => !item.isMine);
      } else {
        cleanData = cleanData.filter(item => item.isMine);
      }

      // --- FRONTEND SIRALAMA (Client-Side Sorting) ---
      // Backend fiyat sıralamasını desteklemediği için burada JS ile sıralıyoruz
      if (sortOption === "price_asc") {
        cleanData.sort((a, b) => a.value - b.value);
      } else if (sortOption === "price_desc") {
        cleanData.sort((a, b) => b.value - a.value);
      }

      console.log("✅ Veri başarıyla yüklendi:", cleanData.length, "öğe");
      setItems(cleanData);

    } catch (error) {
      console.error("❌ Veri çekme hatası:", error);
      
      // 🐛 Hata detayını görelim
      if (error.response) {
        console.error("Hata Detayı:", {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce (Arama Geciktirme)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Değişiklikleri İzle ve Veriyi Çek
  useEffect(() => {
    fetchData();
  }, [page, activeTab, debouncedSearch, sortOption, selectedTag, location.key]);

  const handleRefresh = () => fetchData();
  const handleCardClick = (itemId) => navigate(`/outfit/${itemId}`);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedTag(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">OutfitShare</h1>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Yenile</span>
            </button>
            <button 
              onClick={() => navigate("/add-outfit")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
            >
              <Plus size={20} /> Yeni Kombin
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-8 max-w-7xl mx-auto">
          <button 
            onClick={() => handleTabChange("explore")} 
            className={`py-4 px-2 border-b-2 flex items-center gap-2 transition ${
              activeTab === "explore" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Compass size={20} /> 
            <span>Keşfet</span>
          </button>
          <button 
            onClick={() => handleTabChange("my-outfits")} 
            className={`py-4 px-2 border-b-2 flex items-center gap-2 transition ${
              activeTab === "my-outfits" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={20} /> 
            <span>Kombinlerim</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search & Sort Area */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                  type="text"
                  placeholder="Kombin ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            
            {/* Sıralama Dropdown */}
            <div className="relative min-w-[200px]">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
               <select 
                 value={sortOption}
                 onChange={(e) => setSortOption(e.target.value)}
                 className="w-full appearance-none bg-white border border-gray-300 rounded-xl pl-11 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700"
               >
                 <option value="newest">En Yeni</option>
                 <option value="oldest">En Eski</option>
                 <option value="a-z">İsim (A-Z)</option>
                 <option value="z-a">İsim (Z-A)</option>
                 <option value="price_asc">Fiyat (Artan)</option>
                 <option value="price_desc">Fiyat (Azalan)</option>
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
            </div>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <button 
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedTag === null
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Tümü
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                  {selectedTag === tag && <X size={14} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading & Content */}
        {loading && items.length === 0 ? (
           <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "my-outfits" 
                ? "Henüz hiç kombin eklemedin." 
                : "Aradığınız kriterlere uygun kombin bulunamadı."}
            </p>
            {activeTab === "my-outfits" && (
              <button onClick={() => navigate("/add-outfit")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Hemen Ekle
              </button>
            )}
          </div>
        ) : (
          /* Grid List */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {items.map((item) => (
                <div 
                    key={item._id} 
                    onClick={() => handleCardClick(item._id)}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                    <div className="h-64 bg-gray-100 overflow-hidden relative">
                    <img 
                        src={item.photo} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                        onError={(e) => {
                           e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400';
                        }} 
                    />
                    {item.isMine && (
                        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        Senin Kombin
                        </div>
                    )}
                    </div>
                    <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                        <span className="text-lg font-bold text-blue-600">₺{item.value}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags && item.tags.length > 0 ? (
                        item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                            #{tag}
                            </span>
                        ))
                        ) : (
                        <span className="text-xs text-gray-400">Etiket yok</span>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                        İncele
                        </button>
                        <button 
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-100 text-gray-500 p-2.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
                        >
                        <Heart size={20} />
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {/* Pagination Controls */}
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
                    disabled={page >= totalPages && totalPages > 1}
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
    </div>
  );
}