import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Tag as TagIcon } from 'lucide-react';
// import axios from 'axios'; // ARTIK GEREK YOK
import api from '../../services/api'; // Merkezi API servisini kullanıyoruz

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [editTagName, setEditTagName] = useState('');

  // 'apiCall' fonksiyonunu sildik. Artık 'api.get', 'api.post' vb. kullanacağız.

  // Tag'leri Çek
  const fetchTags = async () => {
    try {
      setLoading(true);
      // api.get otomatik olarak base URL ve token'ı ekler
      const response = await api.get('/tags/get-tags');
      
      console.log('🔍 API Response Data:', response.data);
      
      // API response yapısını kontrol et ve güvenli şekilde al
      let tagList = [];
      if (response.data?.data?.tags) {
        tagList = response.data.data.tags;
      } else if (response.data?.tags) {
        tagList = response.data.tags;
      } else if (Array.isArray(response.data?.data)) {
        tagList = response.data.data;
      } else if (Array.isArray(response.data)) {
        tagList = response.data;
      }
      
      setTags(tagList);
    } catch (error) {
      console.error('❌ Tag çekme hatası:', error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // YENİ TAG EKLE
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      alert('Tag adı boş olamaz!');
      return;
    }

    try {
      const payload = { name: newTagName.trim() };
      
      // api.post kullanıyoruz
      await api.post('/tags/create-tag', payload);
      
      // Başarılı olduysa listeyi yenile
      await fetchTags();
      
      // Formu temizle
      setNewTagName('');
      setIsAdding(false);
      
      alert('Tag başarıyla eklendi!');
    } catch (error) {
      console.error('Tag ekleme hatası:', error);
      alert(error.response?.data?.message || 'Tag eklenemedi!');
    }
  };

  // TAG GÜNCELLE
  const handleUpdateTag = async (tagId) => {
    if (!editTagName.trim()) {
      alert('Tag adı boş olamaz!');
      return;
    }

    try {
      const payload = { name: editTagName.trim() };
      
      // api.put kullanıyoruz
      await api.put(`/tags/update-tag/${tagId}`, payload);
      
      // Listeyi güncelle (Tekrar fetch atmaya gerek yok, state güncelleyelim)
      setTags(tags.map(tag => 
        tag._id === tagId ? { ...tag, name: editTagName.trim() } : tag
      ));
      
      setEditingId(null);
      setEditTagName('');
      
      alert('Tag başarıyla güncellendi!');
    } catch (error) {
      console.error('Tag güncelleme hatası:', error);
      alert(error.response?.data?.message || 'Tag güncellenemedi!');
    }
  };

  // TAG SİL
  const handleDeleteTag = async (tagId, tagName) => {
    if (!window.confirm(`"${tagName}" tag'ini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      // api.delete kullanıyoruz
      await api.delete(`/tags/delete-tag/${tagId}`);
      
      // Listeden çıkar
      setTags(tags.filter(tag => tag._id !== tagId));
      
      alert('Tag başarıyla silindi!');
    } catch (error) {
      console.error('Tag silme hatası:', error);
      alert(error.response?.data?.message || 'Tag silinemedi!');
    }
  };

  // Düzenleme başlat
  const startEdit = (tag) => {
    setEditingId(tag._id);
    setEditTagName(tag.name);
  };

  // Düzenleme iptal
  const cancelEdit = () => {
    setEditingId(null);
    setEditTagName('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Tag'ler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TagIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tag Yönetimi</h1>
              <p className="text-sm text-gray-500">Kıyafet etiketlerini yönetin</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Yeni Tag
          </button>
        </div>
      </div>

      {/* Yeni Tag Ekleme Formu */}
      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Yeni Tag Ekle</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Örn: Casual, Vintage, Sport..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              autoFocus
            />
            <button
              onClick={handleAddTag}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Check size={20} />
              Kaydet
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTagName('');
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            >
              <X size={20} />
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Tag Listesi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {tags.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Tag Yok</h3>
            <p className="text-gray-500 mb-6">İlk tag'inizi ekleyerek başlayın</p>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              İlk Tag'i Ekle
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tags.map((tag) => {
              if (!tag || !tag._id) return null;

              return (
                <div
                  key={tag._id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  {editingId === tag._id ? (
                  // Düzenleme Modu
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateTag(tag._id)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateTag(tag._id)}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                      title="Kaydet"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition"
                      title="İptal"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  // Normal Görünüm
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {tag?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{tag?.name || 'İsimsiz'}</h3>
                        <p className="text-xs text-gray-500">ID: {tag?._id || 'Bilinmiyor'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(tag)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                        title="Düzenle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag._id, tag.name)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Toplam Tag Sayısı:</span> {tags.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default TagManagement;