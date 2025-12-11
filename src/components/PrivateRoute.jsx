import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {

  // Login.jsx dosyasında 'accessToken' ismiyle kaydetmiştik.
  // Burada da aynı isimle okumak ZORUNDAYIZ.
  const token = localStorage.getItem("accessToken");

  // Kontrol amaçlı konsola yazdıralım (F12'de görebilirsin)
  console.log("Güvenlik Kontrolü: Token var mı?", !!token);

  // Token varsa içeri gir (Outlet), yoksa Login'e git (Navigate)
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;