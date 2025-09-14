/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { authApi } from '@/utils/api';
import { TokenResponse } from '@/types/auth';

const containerStyles = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
`;

const cardStyles = css`
  text-align: center;
  padding: 40px;
`;

const messageStyles = css`
  font-size: 18px;
  color: #475569;
  margin-top: 20px;
`;

const errorStyles = css`
  color: #dc2626;
  font-size: 16px;
  margin-top: 20px;
`;

export const AdminCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const code = searchParams.get('code');

      if (!code) {
        setError('유효하지 않은 접근입니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      // ❗ 백엔드 OAuth 설정에 등록된 Redirect URI와 정확히 일치해야 합니다.
      const redirectUrl = window.location.origin + '/admin/callback';

      try {
        const response = await authApi.exchangeToken(code, redirectUrl);

        if (response.status >= 200 && response.status < 300 && response.data.data) {
          const { accessToken } = response.data.data as TokenResponse;
          localStorage.setItem('accessToken', accessToken);
          
          // 토큰 저장 후 관리자 페이지로 이동
          // window.location.href를 사용해 페이지를 완전히 새로고침하여 AuthProvider가 새 토큰을 인식하게 함
          window.location.href = '/admin';
        } else {
          throw new Error('토큰 교환에 실패했습니다.');
        }
      } catch (err) {
        console.error("Admin callback failed:", err);
        setError('인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    exchangeCodeForToken();
  }, [searchParams, navigate]);

  return (
    <div css={containerStyles}>
      <div css={cardStyles}>
        <LoadingSpinner size={48} />
        {error ? (
          <p css={errorStyles}>{error}</p>
        ) : (
          <p css={messageStyles}>관리자 인증을 처리하고 있습니다...</p>
        )}
      </div>
    </div>
  );
};