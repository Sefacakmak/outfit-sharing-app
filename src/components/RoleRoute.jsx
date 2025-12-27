import { Navigate, Outlet } from "react-router-dom";

/**
 * RoleRoute - Rol bazlı yetkilendirme komponenti
 * 
 * Kullanım:
 * <Route element={<RoleRoute allowedRoles={["admin", "organization"]} />}>
 *   <Route path="/dashboard" element={<DashboardLayout />} />
 * </Route>
 */
const RoleRoute = ({ allowedRoles = [] }) => {
  // 1. Token kontrolü
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    console.warn("⚠️ RoleRoute: Token bulunamadı, login'e yönlendiriliyor...");
    return <Navigate to="/login" replace />;
  }

  // 2. Role okuma
  let userRole = localStorage.getItem("userRole");

  // Eğer localStorage'da role yoksa, token'dan parse et
  if (!userRole) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = String(payload.role || payload.user?.role || "user").toLowerCase();
      localStorage.setItem("userRole", userRole); // Gelecekteki kontroller için kaydet
    } catch (error) {
      console.error("❌ RoleRoute: Token parse hatası:", error);
      // Token bozuksa login'e yönlendir
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }

  // 3. Yetki kontrolü
  const hasPermission = allowedRoles.length === 0 || allowedRoles.some(role => {
    // Hem "organization" hem "admin" rolü kabul edilsin
    return userRole.includes(role.toLowerCase());
  });

  if (!hasPermission) {
    console.warn(`⛔ RoleRoute: Yetkisiz erişim! Kullanıcı rolü: ${userRole}, İzin verilenler: ${allowedRoles.join(", ")}`);
    
    // Kullanıcı rolüne göre yönlendir
    if (userRole.includes("admin") || userRole.includes("org")) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/explore" replace />;
    }
  }

  // 4. Yetki varsa içeri gir
  console.log("✅ RoleRoute: Erişim izni verildi. Rol:", userRole);
  return <Outlet />;
};

export default RoleRoute;