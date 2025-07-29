import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] Checking access:', { 
    pathname: location.pathname, 
    hasUser: !!currentUser 
  });

  if (!currentUser) {
    console.log('[ProtectedRoute] Redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  console.log('[ProtectedRoute] Allowing access to:', location.pathname);
  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { currentUser } = useAuth();
  
  console.log('[PublicRoute] Checking access:', { 
    hasUser: !!currentUser 
  });
  
  if (currentUser) {
    console.log('[PublicRoute] Redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  console.log('[PublicRoute] Allowing access');
  return <>{children}</>;
}; 