/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const layoutStyles = css`
  min-height: 100vh;
  background: #f8fafc;
`;

const headerStyles = css`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const titleStyles = css`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;

const userInfoStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const contentStyles = css`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div css={layoutStyles}>
      {showNavigation && isAuthenticated && (
        <header css={headerStyles}>
          <h1 css={titleStyles}>KNU CSE 인증 시스템</h1>
          {user && (
            <div css={userInfoStyles}>
              <span>{user.name} ({user.role})</span>
              <Button size="small" variant="secondary" onClick={logout}>
                로그아웃
              </Button>
            </div>
          )}
        </header>
      )}
      <main css={contentStyles}>
        {children}
      </main>
    </div>
  );
};