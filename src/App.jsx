import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Routes>
      {/* Şimdilik ana sayfaya girenleri Login'e yönlendirelim */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth Rotaları */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard (Giriş yapınca gidilecek yer - Şimdilik boş bir yazı olsun) */}
      <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold">Giriş Başarılı! Burası Dashboard.</div>} />
    </Routes>
  );
}

export default App;