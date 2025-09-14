/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Layout } from '@/components/common';

const containerStyles = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
`;

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const titleStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const contentStyles = css`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`;

const actionBarStyles = css`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const searchSectionStyles = css`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const searchRowStyles = css`
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
`;

const modernButtonStyles = css`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const secondaryButtonStyles = css`
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px 20px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
`;

const modernInputStyles = css`
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const modernSelectStyles = css`
  ${modernInputStyles}
  cursor: pointer;
  min-width: 140px;
`;

interface AdminPageLayoutProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  icon,
  children,
  actions
}) => {
  return (
    <Layout>
      <div css={containerStyles}>
        <div css={headerStyles}>
          <h1 css={titleStyles}>
            {icon && <span>{icon}</span>}
            {title}
          </h1>
          {actions && (
            <div css={actionBarStyles}>
              {actions}
            </div>
          )}
        </div>

        <div css={contentStyles}>
          {children}
        </div>
      </div>
    </Layout>
  );
};

export const SearchSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div css={searchSectionStyles}>
    <div css={searchRowStyles}>
      {children}
    </div>
  </div>
);

export const ModernButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
}> = ({ children, onClick, disabled, variant = 'primary', type = 'button' }) => {
  const buttonStyles = variant === 'primary' ? modernButtonStyles :
                     variant === 'secondary' ? secondaryButtonStyles :
                     css`
                       ${modernButtonStyles}
                       background: linear-gradient(135deg, #dc2626, #b91c1c);

                       &:hover {
                         background: linear-gradient(135deg, #b91c1c, #991b1b);
                         box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
                       }
                     `;

  return (
    <button
      type={type}
      css={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const ModernInput: React.FC<{
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({ type = 'text', value, onChange, placeholder, onKeyPress }) => (
  <input
    type={type}
    css={modernInputStyles}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    onKeyPress={onKeyPress}
  />
);

export const ModernSelect: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}> = ({ value, onChange, children }) => (
  <select
    css={modernSelectStyles}
    value={value}
    onChange={onChange}
  >
    {children}
  </select>
);