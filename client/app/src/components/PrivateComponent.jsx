// ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProviders";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
