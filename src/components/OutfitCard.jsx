import React from 'react';

const OutfitCard = ({ outfit }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      {/* Resim Alanı */}
      <div className="h-64 overflow-hidden relative group">
        <img 
          src={outfit.imageUrl} 
          alt={outfit.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Fiyat Etiketi (Opsiyonel görsel detay) */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₺{outfit.price}
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{outfit.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{outfit.description}</p>
        
        {/* Tagler */}
        <div className="flex flex-wrap gap-2 mb-4">
          {outfit.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Düzenle</button>
          <button className="text-red-500 hover:text-red-700 text-sm font-semibold">Sil</button>
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;