/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Input, Table, type Column } from '@/components/common';
import { providerApi } from '@/utils/api';
import { Provider, PageableResponse } from '@/types/auth';

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

const selectedCountStyles = css`
  color: #64748b;
  font-size: 14px;
`;

const providerBadgeStyles = css`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  &.google {
    background-color: #fef3c7;
    color: #92400e;
  }

  &.github {
    background-color: #f3f4f6;
    color: #374151;
  }

  &.kakao {
    background-color: #fef2f2;
    color: #dc2626;
  }
`;

export const ProviderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchColumn, setSearchColumn] = useState('email');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [sortKey, setSortKey] = useState('email');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadProviders = async () => {
    setLoading(true);
    try {
      const response = await providerApi.getProviders({
        page: pagination.page,
        size: pagination.size,
        sortBy: sortKey,
        direction: sortDirection,
        searchColumn: searchKeyword ? searchColumn : undefined,
        searchKeyword: searchKeyword || undefined,
      });

      if (response.status >= 200 && response.status < 300 && response.data.data) {
        const data = response.data.data as PageableResponse<Provider>;
        setProviders(data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, [pagination.page, pagination.size, sortKey, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    loadProviders();
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleRowSelect = (provider: Provider) => {
    setSelectedProviders(prev => {
      const isSelected = prev.some(p => p.id === provider.id);
      if (isSelected) {
        return prev.filter(p => p.id !== provider.id);
      } else {
        return [...prev, provider];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProviders.length === providers.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders([...providers]);
    }
  };

  const handleDelete = async () => {
    if (selectedProviders.length === 0) return;

    if (confirm(`선택된 ${selectedProviders.length}개의 Provider를 삭제하시겠습니까?`)) {
      try {
        const ids = selectedProviders.map(p => p.id);
        await providerApi.deleteProviders(ids);
        setSelectedProviders([]);
        loadProviders();
        alert('삭제되었습니다.');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getProviderBadgeClass = (providerName: string) => {
    switch (providerName.toLowerCase()) {
      case 'google':
        return 'google';
      case 'github':
        return 'github';
      case 'kakao':
        return 'kakao';
      default:
        return 'google';
    }
  };

  const columns: Column<Provider>[] = [
    {
      key: 'email',
      title: '이메일',
      sortable: true,
      width: '250px',
    },
    {
      key: 'providerName',
      title: 'Provider',
      render: (value: unknown) => {
        const providerName = value as string;
        return (
          <span css={providerBadgeStyles} className={getProviderBadgeClass(providerName)}>
            {providerName}
          </span>
        );
      },
      width: '120px',
    },
    {
      key: 'providerKey',
      title: 'Provider Key',
      render: (value: unknown) => {
        const key = value as string;
        return key.length > 20 ? `${key.substring(0, 20)}...` : key;
      },
      width: '200px',
    },
    {
      key: 'studentId',
      title: '학생 ID',
      render: (value: unknown) => value as number,
      sortable: true,
      width: '100px',
    },
    {
      key: 'actions',
      title: '작업',
      render: (_: unknown, record: Provider) => (
        <div css={css`display: flex; gap: 8px;`}>
          <Button
            size="small"
            variant="secondary"
            onClick={() => navigate(`/admin/providers/${record.id}/edit`)}
          >
            수정
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={async () => {
              if (confirm('이 Provider를 삭제하시겠습니까?')) {
                try {
                  await providerApi.deleteProviders([record.id]);
                  loadProviders();
                  alert('삭제되었습니다.');
                } catch (error) {
                  console.error('Delete failed:', error);
                  alert('삭제 중 오류가 발생했습니다.');
                }
              }
            }}
          >
            삭제
          </Button>
        </div>
      ),
      width: '140px',
    },
  ];

  return (
    <Layout>
      <div css={headerStyles}>
        <h1 css={titleStyles}>Provider 관리</h1>
        <Button onClick={() => navigate('/admin/providers/create')}>
          새 Provider 추가
        </Button>
      </div>

      <div css={searchBarStyles}>
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          css={selectStyles}
        >
          <option value="email">이메일</option>
          <option value="providerName">Provider 이름</option>
          <option value="providerKey">Provider Key</option>
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
        <div css={selectedCountStyles}>
          {selectedProviders.length > 0 && (
            <>
              {selectedProviders.length}개 항목 선택됨
            </>
          )}
        </div>
        <div>
          {selectedProviders.length > 0 && (
            <Button variant="danger" size="small" onClick={handleDelete}>
              선택된 항목 삭제
            </Button>
          )}
        </div>
      </div>

      <Table<Provider>
        columns={columns}
        data={providers}
        loading={loading}
        selectable
        selectedRows={selectedProviders}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />

      {/* Simple pagination */}
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