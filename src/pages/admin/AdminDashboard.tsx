/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Layout, Button } from '@/components/common';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { useAuth } from '@/contexts/AuthContext';

const containerStyles = css`
  max-width: 1200px;
  margin: 0 auto;
`;

const headerStyles = css`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 30px;
`;

const titleStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
`;

const cardGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const cardStyles = css`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const cardTitleStyles = css`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
`;

const cardDescriptionStyles = css`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const buttonRowStyles = css`
  display: flex;
  gap: 8px;
`;

const statsStyles = css`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 30px;
`;

const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const statItemStyles = css`
  text-align: center;
`;

const statNumberStyles = css`
  font-size: 32px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 4px;
`;

const statLabelStyles = css`
  font-size: 14px;
  color: #64748b;
`;

interface AdminCard {
  title: string;
  description: string;
  actions: Array<{
    label: string;
    variant: 'primary' | 'secondary' | 'success';
    onClick: () => void;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { isFinanceOrAbove } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    paidDues: 0,
    qrScans: 0,
    providers: 0,
  });

  useEffect(() => {
    // Load statistics from API
    // This is a placeholder - implement actual API calls
    setStats({
      totalStudents: 245,
      paidDues: 189,
      qrScans: 1024,
      providers: 3,
    });
  }, []);

  if (!isFinanceOrAbove) {
    return (
      <Layout>
        <div css={containerStyles}>
          <div css={titleStyles}>접근 권한이 없습니다</div>
          <p>관리자 기능을 사용하려면 FINANCE 이상의 권한이 필요합니다.</p>
        </div>
      </Layout>
    );
  }

  const adminCards: AdminCard[] = [
    {
      title: 'QR 인증',
      description: '실시간 학생 신분 확인 및 QR 코드 스캔',
      actions: [
        {
          label: 'QR 인증 시작',
          variant: 'success',
          onClick: () => window.location.href = '/qr-auth',
        },
      ],
    },
    {
      title: '학생 관리',
      description: '학생 정보 조회, 추가, 수정, 삭제',
      actions: [
        {
          label: '학생 목록',
          variant: 'primary',
          onClick: () => window.location.href = '/admin/students',
        },
        {
          label: '새 학생 추가',
          variant: 'success',
          onClick: () => window.location.href = '/admin/students/create',
        },
      ],
    },
    {
      title: '회비 관리',
      description: '회비 납부 현황 관리 및 CSV 업로드',
      actions: [
        {
          label: '회비 현황',
          variant: 'primary',
          onClick: () => window.location.href = '/admin/dues',
        },
        {
          label: 'CSV 업로드',
          variant: 'secondary',
          onClick: () => window.location.href = '/admin/dues/upload',
        },
      ],
    },
    {
      title: 'QR 인증 로그',
      description: 'QR 코드 스캔 기록 조회 및 관리',
      actions: [
        {
          label: '로그 조회',
          variant: 'primary',
          onClick: () => window.location.href = '/admin/qr-logs',
        },
      ],
    },
    {
      title: 'Provider 관리',
      description: 'OAuth2 Provider 설정 관리',
      actions: [
        {
          label: 'Provider 목록',
          variant: 'primary',
          onClick: () => window.location.href = '/admin/providers',
        },
        {
          label: '새 Provider',
          variant: 'success',
          onClick: () => window.location.href = '/admin/providers/create',
        },
      ],
    },
  ];

  return (
    <Layout>
      <div css={containerStyles}>
        <AdminNavigation />

        <div css={headerStyles}>
          <h1 css={titleStyles}>📊 관리자 대시보드</h1>
        </div>

        <div css={statsStyles}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
            시스템 현황
          </h2>
          <div css={statsGridStyles}>
            <div css={statItemStyles}>
              <div css={statNumberStyles}>{stats.totalStudents}</div>
              <div css={statLabelStyles}>전체 학생</div>
            </div>
            <div css={statItemStyles}>
              <div css={statNumberStyles}>{stats.paidDues}</div>
              <div css={statLabelStyles}>회비 납부</div>
            </div>
            <div css={statItemStyles}>
              <div css={statNumberStyles}>{stats.qrScans}</div>
              <div css={statLabelStyles}>QR 스캔 횟수</div>
            </div>
            <div css={statItemStyles}>
              <div css={statNumberStyles}>{stats.providers}</div>
              <div css={statLabelStyles}>활성 Provider</div>
            </div>
          </div>
        </div>

        <div css={cardGridStyles}>
          {adminCards.map((card, index) => (
            <div key={index} css={cardStyles}>
              <h3 css={cardTitleStyles}>{card.title}</h3>
              <p css={cardDescriptionStyles}>{card.description}</p>
              <div css={buttonRowStyles}>
                {card.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={action.variant}
                    size="small"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};