import { Navigate } from "react-router-dom";
import { getToken } from "../auth/auth.service";
import { JSX } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
