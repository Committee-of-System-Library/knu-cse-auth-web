/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Button, Input, Layout, LoadingSpinner } from '@/components/common';
import { authApi } from '@/utils/api';

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
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const titleStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
`;

const subtitleStyles = css`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const formStyles = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const studentInfoStyles = css`
  background: #f1f5f9;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  text-align: left;
`;

const infoRowStyles = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const labelStyles = css`
  font-weight: 600;
  color: #475569;
`;

const valueStyles = css`
  color: #1e293b;
`;

const errorStyles = css`
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
`;

const successStyles = css`
  color: #059669;
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
`;

interface StudentInfo {
  name: string;
  studentNumber: string;
}

export const AdditionalInfoPage: React.FC = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // URL에서 token과 redirectUrl 쿼리 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlRedirect = urlParams.get('redirectUrl');

    if (urlToken) {
      setToken(urlToken);
    }
    if (urlRedirect) {
      setRedirectUrl(urlRedirect);
    }
  }, []);

  const handleCheckStudentNumber = async () => {
    if (!studentNumber.trim()) {
      setError('학번을 입력해주세요');
      return;
    }

    setIsChecking(true);
    setError('');
    setCheckSuccess(false);

    try {
      const response = await authApi.checkStudentNumber(studentNumber);
      setStudentInfo(response.data.data || null);
      setCheckSuccess(true);
    } catch {
      setError('존재하지 않는 학번입니다. 관리자에게 문의하세요.');
      setStudentInfo(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleConnect = async () => {
    if (!studentInfo) return;

    setIsConnecting(true);
    setError('');

    try {
      await authApi.connectStudentNumber({
        token: token,
        studentNumber: studentNumber,
        redirectUrl: redirectUrl
      });
      // 자동으로 redirectUrl?code=... 로 이동
    } catch (err: unknown) {
      console.error('Connect failed:', err);
      setError('계정 연결 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsConnecting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking && !studentInfo) {
      handleCheckStudentNumber();
    }
  };

  return (
    <Layout showNavigation={false}>
      <div css={containerStyles}>
        <div css={cardStyles}>
          <h1 css={titleStyles}>추가 정보 입력</h1>
          <p css={subtitleStyles}>
            처음 로그인하시는군요!<br />
            학번을 입력하여 계정을 연결해주세요.
          </p>

          <div css={formStyles}>
            <Input
              label="학번"
              type="text"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="예: 2021012345"
              disabled={isChecking || isConnecting || !!studentInfo}
              fullWidth
            />

            {!studentInfo && (
              <Button
                onClick={handleCheckStudentNumber}
                disabled={isChecking || !studentNumber.trim()}
                fullWidth
              >
                {isChecking ? (
                  <>
                    <LoadingSpinner size={16} centered={false} />
                    확인 중...
                  </>
                ) : (
                  '학번 확인'
                )}
              </Button>
            )}

            {checkSuccess && !error && (
              <div css={successStyles}>
                ✓ 학번이 확인되었습니다
              </div>
            )}

            {error && (
              <div css={errorStyles}>
                {error}
              </div>
            )}

            {studentInfo && (
              <>
                <div css={studentInfoStyles}>
                  <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>
                    학생 정보 확인
                  </h3>
                  <div css={infoRowStyles}>
                    <span css={labelStyles}>이름:</span>
                    <span css={valueStyles}>{studentInfo.name}</span>
                  </div>
                  <div css={infoRowStyles}>
                    <span css={labelStyles}>학번:</span>
                    <span css={valueStyles}>{studentInfo.studentNumber}</span>
                  </div>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  fullWidth
                  variant="success"
                >
                  {isConnecting ? (
                    <>
                      <LoadingSpinner size={16} centered={false} />
                      연결 중...
                    </>
                  ) : (
                    '계정 연결하기'
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};