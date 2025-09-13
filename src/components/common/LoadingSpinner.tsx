/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinnerStyles = css`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #1e3a8a;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const containerStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

interface LoadingSpinnerProps {
  size?: number;
  centered?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  centered = true 
}) => {
  const customSpinnerStyles = css`
    ${spinnerStyles};
    width: ${size}px;
    height: ${size}px;
  `;

  if (centered) {
    return (
      <div css={containerStyles}>
        <div css={customSpinnerStyles} />
      </div>
    );
  }

  return <div css={customSpinnerStyles} />;
};