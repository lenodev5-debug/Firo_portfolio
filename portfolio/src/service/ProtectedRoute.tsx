// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // Optional: Verify token with backend
        // You can add this if you want to check token validity on every route change
        // const response = await fetch('http://localhost:4444/api/auth/verify', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        
        // if (!response.ok) {
        //   localStorage.removeItem('token');
        //   localStorage.removeItem('user');
        //   setIsAuthenticated(false);
        //   return;
        // }

        // For now, just check if token exists
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Show loading while checking auth
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/auth/user/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;