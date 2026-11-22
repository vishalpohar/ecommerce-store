import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedRoute = ({ children, sellerOnly = false }) => {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (sellerOnly && user.role !== "seller") {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
