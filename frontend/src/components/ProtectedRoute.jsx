import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingSkeleton from "./LoadingSkeleton";


export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

 if (loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}