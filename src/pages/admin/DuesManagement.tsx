/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';
import { Layout, Button, Input, Table, LoadingSpinner, type Column } from '@/components/common';
import { duesApi } from '@/utils/api';
import { Dues, PageableResponse } from '@/types/auth';

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const titleStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
`;

const uploadSectionStyles = css`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  border: 2px dashed #d1d5db;
  text-align: center;
`;

const fileInputStyles = css`
  display: none;
`;

const searchBarStyles = css`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: end;
`;

const selectStyles = css`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  background: white;
  min-width: 120px;
`;

const toolbarStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const statsStyles = css`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const statCardStyles = css`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  flex: 1;
`;

const statNumberStyles = css`
  font-size: 24px;
  font-weight: 700;
  color: #1e3a8a;
`;

const statLabelStyles = css`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

export const DuesManagement: React.FC = () => {
  const [dues, setDues] = useState<Dues[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDues, setSelectedDues] = useState<Dues[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchColumn, setSearchColumn] = useState('studentName');
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [sortKey, setSortKey] = useState('studentNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDues = async () => {
    setLoading(true);
    try {
      const response = await duesApi.getAllDues({
        page: pagination.page,
        size: pagination.size,
        sortBy: sortKey,
        direction: sortDirection,
        searchColumn: searchKeyword ? searchColumn : undefined,
        searchKeyword: searchKeyword || undefined,
      });

      if (response.status >= 200 && response.status < 300 && response.data.data) {
        const data = response.data.data as PageableResponse<Dues>;
        setDues(data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        }));

        // Calculate stats - 모든 dues 레코드는 납부된 것으로 간주
        const total = data.totalElements;
        const paid = data.content.length;
        setStats({ total, paid, unpaid: 0 });
      }
    } catch (error) {
      console.error('Failed to load dues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDues();
  }, [pagination.page, pagination.size, sortKey, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('CSV 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    try {
      await duesApi.uploadDuesCSV(file);
      alert('회비 데이터가 성공적으로 업로드되었습니다.');
      loadDues();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    loadDues();
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleRowSelect = (due: Dues) => {
    setSelectedDues(prev => {
      const isSelected = prev.some(d => d.duesId === due.duesId);
      if (isSelected) {
        return prev.filter(d => d.duesId !== due.duesId);
      } else {
        return [...prev, due];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDues.length === dues.length) {
      setSelectedDues([]);
    } else {
      setSelectedDues([...dues]);
    }
  };

  const columns: Column<Dues>[] = [
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
      key: 'depositorName',
      title: '입금자명',
      sortable: true,
      width: '100px',
    },
    {
      key: 'amount',
      title: '금액',
      render: (value: unknown) => `${(value as number).toLocaleString()}원`,
      width: '100px',
    },
    {
      key: 'remainingSemesters',
      title: '남은 학기',
      width: '80px',
    },
    {
      key: 'paid',
      title: '납부 상태',
      render: () => (
        <span css={css`
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          background: #dcfce7;
          color: #059669;
        `}>
          납부
        </span>
      ),
      width: '100px',
    },
    {
      key: 'submittedAt',
      title: '납부일',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('ko-KR'),
      width: '120px',
    },
    {
      key: 'actions',
      title: '작업',
      render: (_: unknown, record: Dues) => (
        <Button
          size="small"
          variant="secondary"
          onClick={() => window.location.href = `/admin/dues/${record.duesId}/edit`}
        >
          수정
        </Button>
      ),
      width: '80px',
    },
  ];

  return (
    <Layout>
      <div css={headerStyles}>
        <h1 css={titleStyles}>회비 관리</h1>
      </div>

      <div css={statsStyles}>
        <div css={statCardStyles}>
          <div css={statNumberStyles}>{stats.total}</div>
          <div css={statLabelStyles}>전체</div>
        </div>
        <div css={statCardStyles}>
          <div css={statNumberStyles}>{stats.paid}</div>
          <div css={statLabelStyles}>납부</div>
        </div>
        <div css={statCardStyles}>
          <div css={statNumberStyles}>{stats.unpaid}</div>
          <div css={statLabelStyles}>미납부</div>
        </div>
      </div>

      <div css={uploadSectionStyles}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>CSV 파일 업로드</h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          회비 납부 명단이 포함된 CSV 파일을 업로드하세요
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          css={fileInputStyles}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <LoadingSpinner size={16} centered={false} />
              업로드 중...
            </>
          ) : (
            'CSV 파일 선택'
          )}
        </Button>
      </div>

      <div css={searchBarStyles}>
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          css={selectStyles}
        >
          <option value="studentName">이름</option>
          <option value="studentNumber">학번</option>
          <option value="depositorName">입금자명</option>
        </select>
        <Input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어 입력"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>

      <div css={toolbarStyles}>
        <div css={css`color: #64748b; font-size: 14px;`}>
          {selectedDues.length > 0 && `${selectedDues.length}개 항목 선택됨`}
        </div>
        <div>
          <Button
            size="small"
            onClick={() => window.location.href = '/admin/dues/create'}
          >
            개별 추가
          </Button>
        </div>
      </div>

      <Table<Dues>
        columns={columns}
        data={dues}
        loading={loading}
        selectable
        selectedRows={selectedDues}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />

      {/* Pagination */}
      <div css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 20px;
      `}>
        <Button
          size="small"
          variant="secondary"
          disabled={pagination.page === 0}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          이전
        </Button>
        <span css={css`color: #64748b;`}>
          {pagination.page + 1} / {pagination.totalPages}
        </span>
        <Button
          size="small"
          variant="secondary"
          disabled={pagination.page >= pagination.totalPages - 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          다음
        </Button>
      </div>
    </Layout>
  );
};