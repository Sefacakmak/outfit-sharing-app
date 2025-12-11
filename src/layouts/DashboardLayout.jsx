import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function DashboardLayout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menü Linkleri
  const menuItems = [
    { name: 'Genel Bakış', path: '/dashboard', icon: '📊' },
    { name: 'Kıyafet Listesi', path: '/dashboard/outfits', icon: 'mn' }, // mn = manken/kıyafet sembolü temsili
    { name: 'Etiket (Tag) Yönetimi', path: '/dashboard/tags', icon: '🏷️' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR (SOL MENÜ) --- */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-wider text-blue-400">MODA APP</h1>
          <p className="text-xs text-slate-400 mt-1">Organization Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-slate-500">Yönetici</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ANA İÇERİK ALANI --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER (ÜST BAR) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(m => m.path === location.pathname)?.name || 'Panel'}
          </h2>
          
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
          >
            Çıkış Yap
          </button>
        </header>

        {/* SAYFA İÇERİĞİ (OUTLET) */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}