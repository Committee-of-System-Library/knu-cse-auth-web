/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Table, type Column } from '@/components/common';
import { AdminPageLayout, SearchSection, ModernButton, ModernInput, ModernSelect } from '@/components/admin/AdminPageLayout';
import { qrApi } from '@/utils/api';
import { QrAuthLog, PageableResponse } from '@/types/auth';

const toolbarStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const selectedCountStyles = css`
  color: #64748b;
  font-size: 14px;
`;

const statusBadgeStyles = css`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  &.paid {
    background-color: #dcfce7;
    color: #166534;
  }

  &.unpaid {
    background-color: #fef2f2;
    color: #dc2626;
  }
`;

export const QrLogManagement: React.FC = () => {
  const [logs, setLogs] = useState<QrAuthLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<QrAuthLog[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchColumn, setSearchColumn] = useState('studentName');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [sortKey, setSortKey] = useState('scanDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const loadQrLogs = async () => {
    setLoading(true);
    try {
      const response = await qrApi.getQRLogs({
        page: pagination.page,
        size: pagination.size,
        sortBy: sortKey,
        direction: sortDirection,
        searchColumn: searchKeyword ? searchColumn : undefined,
        searchKeyword: searchKeyword || undefined,
      });

      if (response.status >= 200 && response.status < 300 && response.data.data) {
        const data = response.data.data as PageableResponse<QrAuthLog>;
        setLogs(data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to load QR logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQrLogs();
  }, [pagination.page, pagination.size, sortKey, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    loadQrLogs();
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleRowSelect = (log: QrAuthLog) => {
    setSelectedLogs(prev => {
      const isSelected = prev.some(l => l.id === log.id);
      if (isSelected) {
        return prev.filter(l => l.id !== log.id);
      } else {
        return [...prev, log];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs([...logs]);
    }
  };

  const handleDelete = async () => {
    if (selectedLogs.length === 0) return;

    if (confirm(`선택된 ${selectedLogs.length}개의 QR 로그를 삭제하시겠습니까?`)) {
      try {
        // Delete logs one by one (backend doesn't support batch delete)
        await Promise.all(selectedLogs.map(log => qrApi.deleteQRLog(log.id)));
        setSelectedLogs([]);
        loadQrLogs();
        alert('삭제되었습니다.');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: Column<QrAuthLog>[] = [
    {
      key: 'studentNumber',
      title: '학번',
      sortable: true,
      width: '120px',
    },
    {
      key: 'studentName',
      title: '이름',
      sortable: true,
      width: '100px',
    },
    {
      key: 'duesPaid',
      title: '회비 납부',
      render: (value: unknown) => {
        const paid = value as boolean;
        return (
          <span css={statusBadgeStyles} className={paid ? 'paid' : 'unpaid'}>
            {paid ? '납부' : '미납'}
          </span>
        );
      },
      width: '100px',
    },
    {
      key: 'scanDate',
      title: '스캔 날짜',
      render: (value: unknown) => formatDate(value as string),
      sortable: true,
      width: '160px',
    },
    {
      key: 'actions',
      title: '작업',
      render: (_: unknown, record: QrAuthLog) => (
        <ModernButton
          variant="danger"
          onClick={async () => {
            if (confirm('이 QR 로그를 삭제하시겠습니까?')) {
              try {
                await qrApi.deleteQRLog(record.id);
                loadQrLogs();
                alert('삭제되었습니다.');
              } catch (error) {
                console.error('Delete failed:', error);
                alert('삭제 중 오류가 발생했습니다.');
              }
            }
          }}
        >
          <span>🗑️</span>
          삭제
        </ModernButton>
      ),
      width: '80px',
    },
  ];

  return (
    <AdminPageLayout
      title="QR 인증 로그"
      icon="📋"
    >
      <SearchSection>
        <ModernSelect
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
        >
          <option value="studentName">이름</option>
          <option value="studentNumber">학번</option>
        </ModernSelect>
        <ModernInput
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어 입력"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <ModernButton variant="secondary" onClick={handleSearch}>
          <span>🔍</span>
          검색
        </ModernButton>
      </SearchSection>

      {selectedLogs.length > 0 && (
        <div css={toolbarStyles}>
          <div css={selectedCountStyles}>
            <span>✅</span> {selectedLogs.length}개 항목 선택됨
          </div>
          <div>
            <ModernButton variant="danger" onClick={handleDelete}>
              <span>🗑️</span>
              선택 항목 삭제
            </ModernButton>
          </div>
        </div>
      )}

      <Table<QrAuthLog>
        columns={columns}
        data={logs}
        loading={loading}
        selectable
        selectedRows={selectedLogs}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />

      <div css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #f1f5f9;
      `}>
        <ModernButton
          variant="secondary"
          disabled={pagination.page === 0}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          <span>←</span>
          이전
        </ModernButton>
        <span css={css`
          color: #64748b;
          font-weight: 500;
          padding: 0 16px;
        `}>
          {pagination.page + 1} / {pagination.totalPages}
        </span>
        <ModernButton
          variant="secondary"
          disabled={pagination.page >= pagination.totalPages - 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          다음
          <span>→</span>
        </ModernButton>
      </div>
    </AdminPageLayout>
  );
};