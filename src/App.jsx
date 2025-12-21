import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import OutfitList from './pages/dashboard/OutfitList';
import AddOutfit from './pages/dashboard/AddOutfit';
import TagManagement from './pages/dashboard/TagManagement';

import UserExplore from "./pages/user/UserExplore"; 
import UserAddOutfit from "./pages/user/UserAddOutfit"; 

import LandingPage from './pages/LandingPage';
import About from './pages/About';
import OutfitDetail from './pages/outfit/OutfitDetail';
import EditOutfit from './pages/outfit/EditOutfit';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
      <Route path="/outfit/:id" element={<OutfitDetail />} />
      <Route path="/edit-outfit/:id" element={<EditOutfit />} />  
      
        
        {/* User Panel */}
        <Route path="/explore" element={<UserExplore />} />
        <Route path="/add-outfit" element={<UserAddOutfit />} />
        <Route path="/add-item" element={<UserAddOutfit />} />

        {/* Organization/Admin Panel */}
        <Route path="/dashboard" element={<DashboardLayout />}>
           <Route index element={<OutfitList />} /> 
           <Route path="outfits" element={<OutfitList />} />
           <Route path="add" element={<AddOutfit />} />
           <Route path="tags" element={<TagManagement />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;