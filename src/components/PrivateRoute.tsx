// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';  // Import useAuthState
import { auth } from '../firebase'; // Import Firebase auth

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    // You might want to render a loading spinner here
    return <p>Loading...</p>;
  }

  if (error) {
    // Handle the error appropriately
    console.error("PrivateRoute error:", error);
    return <p>Error: {error.message}</p>;
  }

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the children (the protected route) if authenticated
  return children;
};

export default PrivateRoute;