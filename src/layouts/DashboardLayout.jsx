import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

// İkonları bileşen içinde tanımlıyoruz (Harici kütüphane gerektirmemesi için)
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Outfit: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
};

export default function DashboardLayout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Genel Bakış', path: '/dashboard', icon: <Icons.Dashboard /> },
    { name: 'Kıyafet Listesi', path: '/dashboard/outfits', icon: <Icons.Outfit /> },
    { name: 'Etiket Yönetimi', path: '/dashboard/tags', icon: <Icons.Tag /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Dekoratif Arkaplan Efekti */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

        {/* Logo Alanı */}
        <div className="p-8 pb-4 relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-900/50 group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">OutfitShare</h1>
              <p className="text-xs text-slate-400 font-medium">Yönetim Paneli</p>
            </div>
          </Link>
        </div>

        {/* Navigasyon */}
        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menü</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Kullanıcı Profili (Alt Kısım) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 relative z-10">
          <div className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@outfitshare.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          
          {/* Sol: Başlık ve Breadcrumb */}
          <div>
             <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find(m => m.path === location.pathname)?.name || 'Panel'}
            </h2>
             <p className="text-sm text-gray-500 mt-1">Hoş geldin, bugünün istatistikleri hazır.</p>
          </div>
          
          {/* Sağ: Arama, Bildirim, Çıkış */}
          <div className="flex items-center gap-6">
            
            {/* Dekoratif Arama Çubuğu */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2.5 w-64 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
               <span className="text-gray-400 mr-2"><Icons.Search /></span>
               <input 
                 type="text" 
                 placeholder="Ara..." 
                 className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
               />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <Icons.Bell />
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all group"
            >
              <span>Çıkış Yap</span>
              <span className="group-hover:translate-x-1 transition-transform">
                <Icons.Logout />
              </span>
            </button>
          </div>
        </header>

        {/* SAYFA İÇERİĞİ (OUTLET) */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fadeIn">
             {/* İçerik buraya render edilecek */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}