import { useState, useEffect } from "react";
import { Plus, Heart, Search, User, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OutfitShare() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("explore"); // "explore" veya "my-outfits"
  const [items, setItems] = useState([]);
  const [myOutfits, setMyOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Backend'den gelecek
  useEffect(() => {
    // Keşfet için tüm kombinler
    setItems([
      {
        _id: "1",
        name: "Yaz Kombinim",
        description: "Plaj için harika bir kombin",
        value: 150,
        tags: ["Yaz", "Plaj", "Casual"],
        photo: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"
      },
      {
        _id: "2",
        name: "İş Toplantısı",
        description: "Profesyonel ve şık",
        value: 320,
        tags: ["İş", "Formal", "Klasik"],
        photo: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"
      },
      {
        _id: "3",
        name: "Spor Kombin",
        description: "Rahat ve sportif",
        value: 85,
        tags: ["Spor", "Casual", "Rahat"],
        photo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
      }
    ]);

    // Benim kombinlerim
    setMyOutfits([
      {
        _id: "4",
        name: "Akşam Yemeği",
        description: "Romantik bir akşam için",
        value: 280,
        tags: ["Akşam", "Şık", "Romantik"],
        photo: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400"
      }
    ]);

    setLoading(false);
  }, []);

  const currentItems = activeTab === "explore" ? items : myOutfits;
  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">OutfitShare</h1>
            <button 
              onClick={() => navigate("/add-outfit")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Yeni Kombin
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("explore")}
              className={`py-4 px-2 border-b-2 transition flex items-center gap-2 ${
                activeTab === "explore"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Compass size={20} />
              Keşfet
            </button>
            <button
              onClick={() => setActiveTab("my-outfits")}
              className={`py-4 px-2 border-b-2 transition flex items-center gap-2 ${
                activeTab === "my-outfits"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <User size={20} />
              Kombinlerim
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Kombin ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === "explore" ? "Kombin Bulunamadı" : "Henüz Kombin Eklemediniz"}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "explore"
                ? "Arama kriterlerinize uygun kombin bulunamadı."
                : "İlk kombinini ekleyerek başla!"}
            </p>
            <button 
              onClick={() => navigate("/add-outfit")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Kombin Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-blue-600">${item.value}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition text-sm font-medium">
                      Görüntüle
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}