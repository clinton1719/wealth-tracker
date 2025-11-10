import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { selectAuthToken } from "@/slices/authSlice";
import { Spinner } from "@/components/ui/spinner";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useSelector(selectAuthToken);
  const location = useLocation();

  if (token === undefined) {
    return <Spinner />;
  }

  if (!token) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }
  
  return children;
}
