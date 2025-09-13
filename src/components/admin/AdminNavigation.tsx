/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

const navStyles = css`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const navTitleStyles = css`
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const navGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`;

const navItemStyles = css`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  color: white;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const activeNavItemStyles = css`
  ${navItemStyles};
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
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
];

export const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div css={navStyles}>
      <h2 css={navTitleStyles}>
        <span>🛡️</span>
        관리자 메뉴
      </h2>
      <div css={navGridStyles}>
        {navItems.map((item) => (
          <div
            key={item.path}
            css={location.pathname === item.path ? activeNavItemStyles : navItemStyles}
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