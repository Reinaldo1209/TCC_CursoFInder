// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" />;
    }
  }
  return children;
}
