import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/auth';
import { authApi } from '@/utils/api';
import { ROLES } from '@/config/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isFinanceOrAbove: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);
  const navigate = useNavigate();
  

  const isAuthenticated = !!user;
  const isAdmin = user?.role === ROLES.ADMIN;
  const isFinanceOrAbove = user?.role === ROLES.ADMIN || user?.role === ROLES.FINANCE || user?.role === ROLES.EXECUTIVE;

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      [ROLES.ADMIN]: 4,
      [ROLES.EXECUTIVE]: 3,
      [ROLES.FINANCE]: 3,
      [ROLES.STUDENT]: 1,
    };

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const initializeAuth = async () => {
      const existingToken = localStorage.getItem('accessToken');
      if (existingToken) {
        try {
          const response = await authApi.getUserInfo();
          if (response.status >= 200 && response.status < 300 && response.data.data) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('accessToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to get user info with existing token:', error);
          localStorage.removeItem('accessToken');
          setUser(null);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    logout,
    hasRole,
    isAdmin,
    isFinanceOrAbove,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};