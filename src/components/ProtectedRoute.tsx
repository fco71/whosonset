import React from 'react';
import { Navigate, useLocation, type Location } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthRouteLoadingFallback: React.FC = () => (
  <div className="flex min-h-[320px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
  </div>
);

const getFullPath = (location: Location): string => {
  return `${location.pathname}${location.search}${location.hash}`;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthRouteLoadingFallback />;
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: getFullPath(location) }} replace />;
  }

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
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <AuthRouteLoadingFallback />;
  }
  
  if (currentUser) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};
