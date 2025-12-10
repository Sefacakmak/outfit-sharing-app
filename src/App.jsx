import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import OutfitList from './pages/dashboard/OutfitList';
import AddOutfit from './pages/dashboard/AddOutfit'; // 1. Sayfayı içeri aldık

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Korumalı Rotalar */}
      <Route element={<PrivateRoute />}>
        
        {/* Dashboard Layout Kapsayıcısı */}
        <Route path="/dashboard" element={<DashboardLayout />}>
           
           {/* /dashboard -> Listeyi Göster */}
           <Route index element={<OutfitList />} /> 
           
           {/* /dashboard/add -> Ekleme Formunu Göster */}
           <Route path="add" element={<AddOutfit />} />
        
        </Route>

      </Route>

    </Routes>
  );
}

export default App;