import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PrivateRoute = () => {
  // Zustand store'dan giriş yapıp yapmadığını kontrol et
  const { isAuthenticated } = useAuthStore();

  // Eğer kullanıcı giriş yapmışsa sayfayı göster (Outlet)
  // Yapmamışsa Login sayfasına fırlat
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;