/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common';
import { authApi } from '@/utils/api';
import type { TokenResponse } from '@/types/auth';

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
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const titleStyles = css`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
`;

const messageStyles = css`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 20px;
`;

const errorStyles = css`
  color: #dc2626;
  font-size: 14px;
  margin-top: 16px;
`;

export const AdminCallback: React.FC = () => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processAdminCallback = async () => {
      console.log('🔄 AdminCallback: Starting callback processing...');
      console.log('📍 Current URL:', window.location.href);

      try {
        // URL에서 code 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('🔑 Extracted code:', code ? `${code.substring(0, 8)}...` : 'null');

        if (!code) {
          console.error('❌ No code parameter found in URL');
          setError('인증 코드가 없습니다. 다시 로그인해주세요.');
          return;
        }

        const redirectUrl = window.location.origin + '/admin';
        console.log('🔗 Redirect URI:', redirectUrl);
        console.log('📡 Calling exchangeToken API...');

        // exchangeToken API 호출하여 access token 획득
        const response = await authApi.exchangeToken(code, redirectUrl);
        console.log('✅ exchangeToken API response received');
        console.log('📊 Response status:', response.status);

        if (response.status >= 200 && response.status < 300 && response.data.data) {
          const tokenData: TokenResponse = response.data.data;
          console.log('🎫 Token data received:', {
            accessToken: tokenData.accessToken ? `${tokenData.accessToken.substring(0, 20)}...` : 'null',
            tokenType: tokenData.tokenType,
            expiresIn: tokenData.expiresIn
          });

          // localStorage에 access token 저장
          localStorage.setItem('accessToken', tokenData.accessToken);
          console.log('💾 Access token saved to localStorage');

          console.log('👤 Fetching user info for role validation...');
          // 사용자 정보 가져오기
          const userResponse = await authApi.getUserInfo();
          console.log('✅ User info API response received');
          console.log('📊 User response status:', userResponse.status);

          if (userResponse.status >= 200 && userResponse.status < 300 && userResponse.data.data) {
            const userData = userResponse.data.data;
            console.log('👤 User data received:', {
              studentId: userData?.studentId,
              studentNumber: userData?.studentNumber,
              name: userData?.name,
              email: userData?.email,
              role: userData?.role
            });

            // 관리자 권한 검증 (ROLE_ADMIN 또는 ROLE_FINANCE만 허용)
            console.log('🔐 Validating admin role...');
            const allowedRoles = ['ROLE_ADMIN', 'ROLE_FINANCE'];
            if (!userData || !allowedRoles.includes(userData.role)) {
              console.error('❌ Insufficient privileges. User role:', userData?.role || 'null');
              console.error('❌ Required roles:', allowedRoles);
              setError('관리자 권한이 필요합니다. 현재 권한으로는 관리자 페이지에 접근할 수 없습니다.');
              return;
            }

            console.log('✅ Admin role validation passed. Role:', userData.role);
            console.log('🔄 Redirecting to admin dashboard...');
            // 관리자 대시보드로 리다이렉트
            window.location.href = '/admin';
          } else {
            throw new Error('Failed to fetch user info.');
          }
        } else {
          throw new Error('Failed to exchange token.');
        }

      } catch (err) {
        console.error('❌ Admin callback processing failed:', err);
        if (err instanceof Error) {
          console.error('❌ Error message:', err.message);
          console.error('❌ Error stack:', err.stack);
        }
        setError('인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    processAdminCallback();
  }, []);

  if (error) {
    return (
      <div css={containerStyles}>
        <div css={cardStyles}>
          <h1 css={titleStyles}>인증 오류</h1>
          <div css={errorStyles}>{error}</div>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div css={containerStyles}>
      <div css={cardStyles}>
        <h1 css={titleStyles}>관리자 인증 처리 중</h1>
        <div css={messageStyles}>
          인증을 처리하고 있습니다. 잠시만 기다려주세요...
        </div>
        <LoadingSpinner size={32} />
      </div>
    </div>
  );
};