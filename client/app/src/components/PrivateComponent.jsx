import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Providers/AuthProviders";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, logout } = useAuth();

  const location = useLocation();

  useEffect(() => {
    console.log("Route changed:", location.pathname);
    // You can perform any monitoring or tracking logic here
  }, [location.pathname]);

  if (isAuthenticated()) {
    return element;
  }
  logout();
  return <Navigate to="/login" state={{ from: window.location.pathname }} />;
};

export default PrivateRoute;
