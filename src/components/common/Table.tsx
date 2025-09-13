/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactNode } from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectedRows?: T[];
  onRowSelect?: (record: T) => void;
  onSelectAll?: () => void;
  selectable?: boolean;
}

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const headerStyles = css`
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const headerCellStyles = css`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const rowStyles = css`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const cellStyles = css`
  padding: 12px 16px;
  font-size: 14px;
  color: #334155;
`;

const emptyStateStyles = css`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
`;

const checkboxStyles = css`
  margin-right: 8px;
`;

export function Table<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  selectable = false,
}: TableProps<T>) {
  const isRowSelected = (record: T) => {
    return selectedRows.some(row => JSON.stringify(row) === JSON.stringify(record));
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div css={emptyStateStyles}>
        Loading...
      </div>
    );
  }

  return (
    <table css={tableStyles}>
      <thead css={headerStyles}>
        <tr>
          {selectable && (
            <th css={headerCellStyles}>
              <input
                type="checkbox"
                css={checkboxStyles}
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={onSelectAll}
              />
            </th>
          )}
          {columns.map((column) => (
            <th
              key={String(column.key)}
              css={headerCellStyles}
              style={{ width: column.width }}
              onClick={() => column.sortable && handleSort(String(column.key))}
            >
              {column.title}
              {column.sortable && (
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                  {renderSortIcon(String(column.key))}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0)} css={emptyStateStyles}>
              데이터가 없습니다
            </td>
          </tr>
        ) : (
          data.map((record, index) => (
            <tr key={index} css={rowStyles}>
              {selectable && (
                <td css={cellStyles}>
                  <input
                    type="checkbox"
                    checked={isRowSelected(record)}
                    onChange={() => onRowSelect?.(record)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={String(column.key)} css={cellStyles}>
                  {column.render
                    ? column.render(record[column.key as keyof T], record, index)
                    : String(record[column.key as keyof T] || '')
                  }
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}