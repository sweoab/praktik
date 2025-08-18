import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../views/spinner/Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <Spinner />;
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated()) {
    return <Navigate 
      to="/auth/login" 
      state={{ from: location }} 
      replace 
    />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
