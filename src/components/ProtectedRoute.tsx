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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    const currentUrl = window.location.href;
    
    // 이미 login 페이지이거나 redirectUrl이 포함된 경우 중복 리다이렉트 방지
    if (location.pathname === '/login' || currentUrl.includes('redirectUrl=')) {
      return null;
    }

    let finalRedirectUri = '';
    const origin = window.location.origin;
    const pathname = location.pathname;

    if (pathname.includes('/admin') || pathname.includes('/qr-auth')) {
      finalRedirectUri = `${origin}/admin/callback`;
    } else {
      finalRedirectUri = currentUrl;
    }

    const encodedRedirectUri = encodeURIComponent(finalRedirectUri);
    navigate(`/login?redirectUrl=${encodedRedirectUri}`, { replace: true });

    return null;
  }

  // 관리자 접근이 필요하지만 권한이 없는 경우
  if (adminOnly && !isFinanceOrAbove) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // 특정 역할(role)이 필요하지만 충족하지 못하는 경우
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