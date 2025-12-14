import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Provider/AuthProvider";
import useUserRole from "../hooks/useUserRole";
import Loader from "../Components/Shared/Loader";

export default function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const { data: userData, isLoading } = useUserRole(user?.email);
  const location = useLocation();

  if (loading || isLoading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userData?.role))
    return <Navigate to="/access-denied" replace />;

  // authorized
  return children;
}
