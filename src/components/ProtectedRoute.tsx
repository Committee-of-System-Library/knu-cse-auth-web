import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  adminOnly = false,
}) => {
  const { user, isAuthenticated, isLoading, isFinanceOrAbove } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 로딩 중일 때만 로딩 스피너 표시
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    const currentUrl = window.location.href;
    // 이미 login 페이지이거나 redirectUrl이 포함된 경우 중복 리다이렉트 방지
    if (location.pathname === '/login' || currentUrl.includes('redirectUrl=')) {
      return null;
    }
    const encodedUrl = encodeURIComponent(currentUrl);
    navigate(`/login?redirectUrl=${encodedUrl}`, { replace: true });
    return null;
  }

  // If admin access is required but user is not admin
  if (adminOnly && !isFinanceOrAbove) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // If specific role is required
  if (requiredRole && user && !hasRequiredRole(user.role, requiredRole)) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return <>{children}</>;
};

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    'ROLE_ADMIN': 4,
    'ROLE_EXECUTIVE': 3,
    'ROLE_FINANCE': 3,
    'ROLE_STUDENT': 1,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}