/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef } from 'react';
import { Layout, Button, Input } from '@/components/common';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { qrApi } from '@/utils/api';

const containerStyles = css`
  max-width: 1200px;
  margin: 0 auto;
`;

const contentStyles = css`
  max-width: 600px;
  margin: 0 auto;
`;

const titleStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 30px;
  text-align: center;
`;

const cardStyles = css`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  text-align: center;
`;

const scannerStyles = css`
  width: 100%;
  max-width: 400px;
  height: 300px;
  background: #f8fafc;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  position: relative;
  overflow: hidden;
`;

const videoStyles = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const placeholderStyles = css`
  color: #64748b;
  font-size: 16px;
  text-align: center;
`;

const studentInfoStyles = css`
  background: #f1f5f9;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  text-align: left;
`;

const infoRowStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
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
  font-weight: 500;
`;

const statusBadgeStyles = css`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

const paidBadgeStyles = css`
  ${statusBadgeStyles};
  background: #dcfce7;
  color: #059669;
`;

const unpaidBadgeStyles = css`
  ${statusBadgeStyles};
  background: #fef2f2;
  color: #dc2626;
`;

const inputSectionStyles = css`
  margin: 20px 0;
  display: flex;
  gap: 12px;
  align-items: end;
`;

const errorStyles = css`
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
`;

const successMessageStyles = css`
  background: #dcfce7;
  color: #059669;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
`;

interface StudentInfo {
  studentNumber: string;
  name: string;
  duesPaid: boolean;
}

export const QRAuthPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualStudentNumber, setManualStudentNumber] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setError('카메라 접근에 실패했습니다. 수동으로 학번을 입력해주세요.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const searchStudent = async (studentNumber: string) => {
    if (!studentNumber.trim()) {
      setError('학번을 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');
    setStudentInfo(null);

    try {
      const response = await qrApi.getStudentByQR(studentNumber);
      if (response.status >= 200 && response.status < 300) {
        setStudentInfo(response.data.data || null);
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err as { response?: { status: number } }).response?.status === 404) {
        setError('존재하지 않는 학번입니다.');
      } else {
        setError('학생 정보를 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = () => {
    searchStudent(manualStudentNumber);
  };

  const handleAuthenticate = async () => {
    if (!studentInfo) return;

    setLoading(true);
    setError('');

    try {
      await qrApi.saveQRLog({
        studentNumber: studentInfo.studentNumber,
        studentName: studentInfo.name,
        duesPaid: studentInfo.duesPaid,
        scanDate: new Date().toISOString().split('T')[0],
      });
      
      setAuthSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStudentInfo(null);
        setAuthSuccess(false);
        setManualStudentNumber('');
        stopCamera();
      }, 3000);
    } catch (err: unknown) {
      console.error('Auth log failed:', err);
      setError('인증 로그 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStudentInfo(null);
    setError('');
    setAuthSuccess(false);
    setManualStudentNumber('');
    stopCamera();
  };

  return (
    <Layout>
      <div css={containerStyles}>
        <AdminNavigation />

        <div css={contentStyles}>
          <h1 css={titleStyles}>📱 QR 인증</h1>

        <div css={cardStyles}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>학생 신분 확인</h3>
          
          {!authSuccess ? (
            <>
              {/* QR Scanner */}
              <div css={scannerStyles}>
                {isScanning ? (
                  <video
                    ref={videoRef}
                    css={videoStyles}
                    autoPlay
                    playsInline
                    muted
                  />
                ) : (
                  <div css={placeholderStyles}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
                    <p>QR 코드를 스캔하려면<br />카메라를 시작하세요</p>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                {!isScanning ? (
                  <Button onClick={startCamera}>
                    카메라 시작
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={stopCamera}>
                    카메라 중지
                  </Button>
                )}
              </div>

              {/* Manual Input */}
              <div>
                <p style={{ color: '#64748b', marginBottom: '16px' }}>
                  또는 수동으로 학번을 입력하세요:
                </p>
                <div css={inputSectionStyles}>
                  <Input
                    type="text"
                    value={manualStudentNumber}
                    onChange={(e) => setManualStudentNumber(e.target.value)}
                    placeholder="학번 입력 (예: 2021012345)"
                    onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    fullWidth
                  />
                  <Button
                    onClick={handleManualSearch}
                    disabled={loading || !manualStudentNumber.trim()}
                  >
                    {loading ? '검색 중...' : '검색'}
                  </Button>
                </div>
              </div>

              {error && <div css={errorStyles}>{error}</div>}

              {/* Student Information */}
              {studentInfo && (
                <>
                  <div css={studentInfoStyles}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>
                      학생 정보
                    </h3>
                    <div css={infoRowStyles}>
                      <span css={labelStyles}>이름:</span>
                      <span css={valueStyles}>{studentInfo.name}</span>
                    </div>
                    <div css={infoRowStyles}>
                      <span css={labelStyles}>학번:</span>
                      <span css={valueStyles}>{studentInfo.studentNumber}</span>
                    </div>
                    <div css={infoRowStyles}>
                      <span css={labelStyles}>회비 납부:</span>
                      <span css={studentInfo.duesPaid ? paidBadgeStyles : unpaidBadgeStyles}>
                        {studentInfo.duesPaid ? '납부 완료' : '미납부'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                      variant="success"
                      onClick={handleAuthenticate}
                      disabled={loading}
                    >
                      {loading ? '처리 중...' : '✓ 인증 완료'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetForm}
                    >
                      취소
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div css={successMessageStyles}>
              ✅ 인증이 완료되었습니다!<br />
              자동으로 초기화됩니다...
            </div>
          )}
          </div>
        </div>
      </div>
    </Layout>
  );
};