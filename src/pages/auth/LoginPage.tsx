/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Layout } from '@/components/common';
import { API_BASE_URL } from '@/config/constants';

const containerStyles = css`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.3)
  ), url('/cse-building.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
`;

const loginCardStyles = css`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    padding: 40px 32px;
    max-width: 380px;
    border-radius: 20px;
  }
`;

const headerSectionStyles = css`
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
  }
`;

const logoStyles = css`
  width: 120px;
  height: 120px;
  margin: 0 auto 40px;
  background: url('/knu-logo.png') center/contain no-repeat;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 32px;
  }
`;

const titleStyles = css`
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 20px;
  line-height: 1.3;
  color: #374151;

  span.highlight {
    font-weight: 700;
    color: #1f2937;
    display: block;
    font-size: 32px;
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 16px;

    span.highlight {
      font-size: 28px;
      margin-bottom: 6px;
    }
  }
`;

const subtitleStyles = css`
  font-size: 16px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 0;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const loginSectionStyles = css`
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 32px;
  }
`;


const googleButtonStyles = css`
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
  }
`;

const googleIconStyles = css`
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%2334A853' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%23EA4335' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E") center/contain no-repeat;
`;

const footerStyles = css`
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  text-align: center;
  color: #64748b;
  font-size: 13px;
  line-height: 1.4;

  @media (max-width: 768px) {
    margin-top: 30px;
    padding-top: 20px;
    font-size: 12px;
  }
`;

export const LoginPage: React.FC = () => {
  const handleLogin = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirectUrl') || window.location.origin;
    
    const loginUrl = `${API_BASE_URL}/login?redirectUrl=${encodeURIComponent(redirectTo)}`;
    window.location.href = loginUrl;
  };

  return (
    <Layout showNavigation={false}>
      <div css={containerStyles}>
        <div css={loginCardStyles}>
          <div css={headerSectionStyles}>
            <div css={logoStyles}></div>
            <h1 css={titleStyles}>
              <span className="highlight">경북대학교 컴퓨터학부</span>
              학생회 통합 인증 시스템
            </h1>
            <p css={subtitleStyles}>
              KNU 이메일로 간편하게 로그인하세요
            </p>
          </div>

          <div css={loginSectionStyles}>
            <button css={googleButtonStyles} onClick={handleLogin}>
              <div css={googleIconStyles} />
              Google로 로그인
            </button>

            <div css={footerStyles}>
              <p>@knu.ac.kr 계정만 사용 가능</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};