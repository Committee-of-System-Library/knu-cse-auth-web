/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Layout } from '@/components/common';
import { API_BASE_URL } from '@/config/constants';

const containerStyles = css`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const cardStyles = css`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const leftSectionStyles = css`
  background: linear-gradient(
    135deg, 
    rgba(30, 58, 138, 0.9) 0%, 
    rgba(59, 130, 246, 0.8) 100%
  ), url('/campus-background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    min-height: 200px;
    padding: 20px;
  }
`;

const rightSectionStyles = css`
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const logoStyles = css`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 36px;
  font-weight: bold;
  color: #1e3a8a;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
`;

const titleStyles = css`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const subtitleStyles = css`
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const loginSectionStyles = css`
  text-align: center;
`;

const loginTitleStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const loginSubtitleStyles = css`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 40px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const googleButtonStyles = css`
  background: white;
  border: 2px solid #e2e8f0;
  color: #334155;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1e3a8a;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(30, 58, 138, 0.15);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const googleIconStyles = css`
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%2334A853' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%23EA4335' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E") center/contain no-repeat;
`;

const footerStyles = css`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const buildingImageStyles = css`
  width: 100%;
  max-width: 300px;
  height: 200px;
  background: url('/cse-building.jpg') center/cover no-repeat;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    height: 120px;
    margin-bottom: 15px;
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
        <div css={cardStyles}>
          <div css={leftSectionStyles}>
            <div css={logoStyles}>KNU</div>
            <h1 css={titleStyles}>
              경북대학교<br />
              컴퓨터학부
            </h1>
            <p css={subtitleStyles}>
              학생회 통합 인증 시스템<br />
              안전하고 편리한 로그인
            </p>
            <div css={buildingImageStyles} />
          </div>
          
          <div css={rightSectionStyles}>
            <div css={loginSectionStyles}>
              <h2 css={loginTitleStyles}>로그인</h2>
              <p css={loginSubtitleStyles}>
                경북대학교 이메일 계정으로<br />
                간편하게 로그인하세요
              </p>
              
              <button css={googleButtonStyles} onClick={handleLogin}>
                <div css={googleIconStyles} />
                Google로 로그인
              </button>
              
              <div css={footerStyles}>
                <p>
                  경북대학교 이메일(@knu.ac.kr)만<br />
                  로그인 가능합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};