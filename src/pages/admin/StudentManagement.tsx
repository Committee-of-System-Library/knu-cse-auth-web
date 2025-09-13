/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Input, Table, type Column } from '@/components/common';
import { studentApi } from '@/utils/api';
import { Student, PageableResponse } from '@/types/auth';
import { MAJORS } from '@/config/constants';

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

export const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchColumn, setSearchColumn] = useState('name');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [sortKey, setSortKey] = useState('studentNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getStudents({
        page: pagination.page,
        size: pagination.size,
        sortBy: sortKey,
        direction: sortDirection,
        searchColumn: searchKeyword ? searchColumn : undefined,
        searchKeyword: searchKeyword || undefined,
      });

      if (response.status >= 200 && response.status < 300 && response.data.data) {
        const data = response.data.data as PageableResponse<Student>;
        setStudents(data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [pagination.page, pagination.size, sortKey, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    loadStudents();
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleRowSelect = (student: Student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s.studentId === student.studentId);
      if (isSelected) {
        return prev.filter(s => s.studentId !== student.studentId);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...students]);
    }
  };

  const handleDelete = async () => {
    if (selectedStudents.length === 0) return;
    
    if (confirm(`선택된 ${selectedStudents.length}명의 학생을 삭제하시겠습니까?`)) {
      try {
        const ids = selectedStudents.map(s => s.studentId);
        await studentApi.deleteStudents(ids);
        setSelectedStudents([]);
        loadStudents();
        alert('삭제되었습니다.');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const columns: Column<Student>[] = [
    {
      key: 'studentNumber',
      title: '학번',
      sortable: true,
      width: '120px',
    },
    {
      key: 'name',
      title: '이름',
      sortable: true,
      width: '100px',
    },
    {
      key: 'major',
      title: '전공',
      render: (value: unknown) => {
        const major = value as string;
        return MAJORS[major as keyof typeof MAJORS] || major;
      },
      width: '150px',
    },
    {
      key: 'role',
      title: '역할',
      render: (value: unknown) => value as string,
      width: '100px',
    },
    {
      key: 'actions',
      title: '작업',
      render: (_: unknown, record: Student) => (
        <Button
          size="small"
          variant="secondary"
          onClick={() => navigate(`/admin/students/${record.studentId}/edit`)}
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
        <h1 css={titleStyles}>학생 관리</h1>
        <Button onClick={() => navigate('/admin/students/create')}>
          새 학생 추가
        </Button>
      </div>

      <div css={searchBarStyles}>
        <select 
          value={searchColumn} 
          onChange={(e) => setSearchColumn(e.target.value)}
          css={selectStyles}
        >
          <option value="name">이름</option>
          <option value="studentNumber">학번</option>
          <option value="email">이메일</option>
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
          {selectedStudents.length > 0 && (
            <>
              {selectedStudents.length}개 항목 선택됨
            </>
          )}
        </div>
        <div>
          {selectedStudents.length > 0 && (
            <Button variant="danger" size="small" onClick={handleDelete}>
              선택된 항목 삭제
            </Button>
          )}
        </div>
      </div>

      <Table<Student>
        columns={columns}
        data={students}
        loading={loading}
        selectable
        selectedRows={selectedStudents}
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