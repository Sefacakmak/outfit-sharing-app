import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Route Guards
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute'; // 🆕 YENİ EKLENEN

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Admin/Organization Pages
import OutfitList from './pages/dashboard/OutfitList';
import AddOutfit from './pages/dashboard/AddOutfit';
import TagManagement from './pages/dashboard/TagManagement';

// User Pages
import UserExplore from "./pages/user/UserExplore"; 
import UserAddOutfit from "./pages/user/UserAddOutfit"; 

// Public Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';

// Shared Pages
import OutfitDetail from './pages/outfit/OutfitDetail';
import EditOutfit from './pages/outfit/EditOutfit';

function App() {
  return (
    <Routes>
      {/* ========================================
          PUBLIC ROUTES (Giriş gerektirmez)
      ======================================== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      
      {/* ========================================
          PROTECTED ROUTES (Tüm kullanıcılar)
      ======================================== */}
      <Route element={<PrivateRoute />}>
        {/* Outfit Detay ve Düzenleme - Herkes görebilir */}
        <Route path="/outfit/:id" element={<OutfitDetail />} />
        <Route path="/edit-outfit/:id" element={<EditOutfit />} />
        
        {/* ========================================
            USER PANEL (Sadece normal kullanıcılar)
        ======================================== */}
        <Route element={<RoleRoute allowedRoles={["user"]} />}>
          <Route path="/explore" element={<UserExplore />} />
          <Route path="/add-outfit" element={<UserAddOutfit />} />
          <Route path="/add-item" element={<UserAddOutfit />} />
        </Route>

        {/* ========================================
            ADMIN/ORGANIZATION PANEL 
            (Sadece admin ve organization rolleri)
        ======================================== */}
        <Route element={<RoleRoute allowedRoles={["admin", "organization"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OutfitList />} /> 
            <Route path="outfits" element={<OutfitList />} />
            <Route path="add" element={<AddOutfit />} />
            <Route path="tags" element={<TagManagement />} />
          </Route>
        </Route>
      </Route>

      {/* ========================================
          FALLBACK ROUTE (404 sayfası opsiyonel)
      ======================================== */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;