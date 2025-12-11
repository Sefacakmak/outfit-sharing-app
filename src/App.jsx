import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import OutfitList from './pages/dashboard/OutfitList';
import AddOutfit from './pages/dashboard/AddOutfit'; 

// DİKKAT: Artık dosya adın UserExplore.jsx olmak ZORUNDA
import UserExplore from "./pages/user/UserExplore"; 
// Eğer UserAddOutfit dosyan yoksa bu satırı ve aşağıdaki route'u silmen gerekebilir:
import UserAddOutfit from "./pages/user/UserAddOutfit"; 

import LandingPage from './pages/LandingPage';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* KORUMALI ALAN */}
      <Route element={<PrivateRoute />}>
        
        {/* User Girecek */}
        <Route path="/explore" element={<UserExplore />} />
        <Route path="/add-outfit" element={<UserAddOutfit />} />

        {/* Admin Girecek */}
        <Route path="/dashboard" element={<DashboardLayout />}>
           <Route index element={<OutfitList />} /> 
           <Route path="add" element={<AddOutfit />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;