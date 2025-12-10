import { Navigate } from "react-router";
import { useAuth } from "../Provider/AuthProvider";
import useUserRole from "../hooks/useUserRole";
import Loader from "../Components/Shared/Loader";

export default function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  const { data: userData, isLoading } = useUserRole(user?.email);

  if (loading || isLoading) return <Loader />;

  // user not logged in
  if (!user) return <Navigate to="/login" />;

  // role does not match
  if (!allowedRoles.includes(userData?.role))
    return <Navigate to="/access-denied" />;

  // authorized
  return children;
}
