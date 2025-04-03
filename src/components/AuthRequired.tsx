
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

interface AuthRequiredProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthRequired = ({ children, allowedRoles }: AuthRequiredProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Check for role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to unauthorized page if user doesn't have required role
      navigate("/unauthorized");
    }
  }, [isAuthenticated, loading, user, navigate, allowedRoles, location.pathname]);

  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If authenticated and has proper role permissions, render children
  return isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role))) ? (
    <>{children}</>
  ) : null;
};

export default AuthRequired;
