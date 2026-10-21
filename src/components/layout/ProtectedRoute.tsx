import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../data/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the URL they were trying to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
