/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/common';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/utils/api';
import { AdminStatistics } from '@/types/auth';

const containerStyles = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
`;

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const titleStyles = css`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const refreshButtonStyles = css`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const quickActionsStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const actionCardStyles = css`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;

    &::before {
      transform: scaleX(1);
    }
  }
`;

const actionIconStyles = css`
  font-size: 24px;
  margin-bottom: 12px;
  display: block;
`;

const actionTitleStyles = css`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
`;

const actionDescStyles = css`
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
`;

const statsStyles = css`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
`;

const statsSectionTitleStyles = css`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '📊';
    font-size: 18px;
  }
`;

const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
`;

const statItemStyles = css`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  }
`;

const statNumberStyles = css`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  display: block;
`;

const statLabelStyles = css`
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  path: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'QR 코드 스캔',
    description: '실시간 학생 신분증 확인',
    icon: '📱',
    path: '/qr-auth',
  },
  {
    title: '학생 관리',
    description: '학생 정보 조회 및 수정',
    icon: '👥',
    path: '/admin/students',
  },
  {
    title: '회비 관리',
    description: '납부 현황 및 CSV 업로드',
    icon: '💰',
    path: '/admin/dues',
  },
  {
    title: 'QR 로그',
    description: '스캔 기록 조회 및 관리',
    icon: '📋',
    path: '/admin/qr-logs',
  },
  {
    title: 'Provider 관리',
    description: 'OAuth2 설정 관리',
    icon: '🔐',
    path: '/admin/providers',
  },
];

export const AdminDashboard: React.FC = () => {
  const { isFinanceOrAbove } = useAuth();
  const [stats, setStats] = useState<AdminStatistics>({
    totalStudents: 0,
    paidDues: 0,
    qrScans: 0,
    providers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getStatistics();

      if (response.status >= 200 && response.status < 300 && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setError('통계를 불러오는 중 오류가 발생했습니다.');
      // Keep previous stats if error occurs
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  if (!isFinanceOrAbove) {
    return (
      <Layout>
        <div css={containerStyles}>
          <div css={css`
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 20px;
            border: 1px solid #e2e8f0;
          `}>
            <div css={css`
              font-size: 48px;
              margin-bottom: 16px;
            `}>🔒</div>
            <h2 css={css`
              font-size: 24px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 12px;
            `}>접근 권한이 필요합니다</h2>
            <p css={css`
              color: #64748b;
              font-size: 16px;
            `}>관리자 기능을 사용하려면 FINANCE 이상의 권한이 필요합니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <Layout>
      <div css={containerStyles}>
        <div css={headerStyles}>
          <h1 css={titleStyles}>관리자 대시보드</h1>
          <button
            css={refreshButtonStyles}
            onClick={loadStatistics}
            disabled={loading}
          >
            <span>{loading ? '⟳' : '↻'}</span>
            {loading ? '새로고침 중...' : '새로고침'}
          </button>
        </div>

        <div css={statsStyles}>
          <h2 css={statsSectionTitleStyles}>시스템 현황</h2>
          {error && (
            <div css={css`
              color: #dc2626;
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 24px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 500;
            `}>
              <span>⚠️</span>
              {error}
            </div>
          )}
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
              <div css={statLabelStyles}>QR 스캔</div>
            </div>
            <div css={statItemStyles}>
              <div css={statNumberStyles}>{stats.providers}</div>
              <div css={statLabelStyles}>Provider</div>
            </div>
          </div>
        </div>

        <div css={quickActionsStyles}>
          {quickActions.map((action, index) => (
            <div
              key={index}
              css={actionCardStyles}
              onClick={() => navigate(action.path)}
            >
              <span css={actionIconStyles}>{action.icon}</span>
              <h3 css={actionTitleStyles}>{action.title}</h3>
              <p css={actionDescStyles}>{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};