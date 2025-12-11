import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute'; // <-- Bunu ekledik

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Herkese Açık Rotalar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* --- KORUMALI ROTALAR (Sadece giriş yapanlar görebilir) --- */}
      <Route element={<PrivateRoute />}>
        {/* Dashboard ve diğer özel sayfalar buraya gelecek */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold">Giriş Başarılı! Burası Dashboard.</div>} />
      </Route>

    </Routes>
  );
}

export default App;