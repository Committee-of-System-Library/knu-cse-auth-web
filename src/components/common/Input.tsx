/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const containerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const labelStyles = css`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const inputStyles = css`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #1e3a8a;
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
  }
`;

const errorInputStyles = css`
  border-color: #dc2626;
  &:focus {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const errorStyles = css`
  font-size: 14px;
  color: #dc2626;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <div css={[containerStyles, fullWidth && css`width: 100%;`]}>
      {label && <label css={labelStyles}>{label}</label>}
      <input
        css={[inputStyles, error && errorInputStyles]}
        ref={ref}
        {...props}
      />
      {error && <span css={errorStyles}>{error}</span>}
    </div>
  );
});