/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: ReactNode;
}

const buttonStyles = css`
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const variants = {
  primary: css`
    background: #1e3a8a;
    color: white;
    &:hover:not(:disabled) {
      background: #1e40af;
    }
  `,
  secondary: css`
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `,
  danger: css`
    background: #dc2626;
    color: white;
    &:hover:not(:disabled) {
      background: #ef4444;
    }
  `,
  success: css`
    background: #059669;
    color: white;
    &:hover:not(:disabled) {
      background: #10b981;
    }
  `,
};

const sizes = {
  small: css`
    padding: 6px 12px;
    font-size: 14px;
    min-height: 32px;
  `,
  medium: css`
    padding: 10px 16px;
    font-size: 16px;
    min-height: 40px;
  `,
  large: css`
    padding: 14px 24px;
    font-size: 18px;
    min-height: 48px;
  `,
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <button
      css={[
        buttonStyles,
        variants[variant],
        sizes[size],
        fullWidth && css`width: 100%;`
      ]}
      {...props}
    >
      {children}
    </button>
  );
};