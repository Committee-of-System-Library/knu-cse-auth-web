/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

const navStyles = css`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`;

const navTitleStyles = css`
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const navGridStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const navItemStyles = css`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: #f1f5f9;
    color: #475569;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;

const activeNavItemStyles = css`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: 1px solid transparent;
  color: white;
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }
`;

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    path: '/admin',
    label: '대시보드',
    icon: '📊',
  },
  {
    path: '/qr-auth',
    label: 'QR 인증',
    icon: '📱',
  },
  {
    path: '/admin/students',
    label: '학생 관리',
    icon: '👥',
  },
  {
    path: '/admin/dues',
    label: '회비 관리',
    icon: '💰',
  },
  {
    path: '/admin/qr-logs',
    label: 'QR 로그',
    icon: '📋',
  },
  {
    path: '/admin/providers',
    label: 'Provider 관리',
    icon: '🔐',
  },
];

export const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const isActiveNav = (path: string) => {
    // Exact match for dashboard
    if (path === '/admin') {
      return location.pathname === '/admin';
    }

    // For other paths, check if current path starts with the nav item path
    return location.pathname.startsWith(path);
  };

  return (
    <div css={navStyles}>
      <h2 css={navTitleStyles}>
        <span>⚡</span>
        빠른 메뉴
      </h2>
      <div css={navGridStyles}>
        {navItems.map((item) => (
          <div
            key={item.path}
            css={isActiveNav(item.path) ? activeNavItemStyles : navItemStyles}
            onClick={() => handleNavClick(item.path)}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};