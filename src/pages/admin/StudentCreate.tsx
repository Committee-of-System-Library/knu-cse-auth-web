/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Input } from '@/components/common';
import { studentApi } from '@/utils/api';
import { MAJORS, ROLES } from '@/config/constants';

const containerStyles = css`
  max-width: 600px;
  margin: 0 auto;
`;

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

const formStyles = css`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const fieldStyles = css`
  margin-bottom: 20px;
`;

const labelStyles = css`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
`;

const selectStyles = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  background: white;
`;

const buttonRowStyles = css`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const errorStyles = css`
  color: #dc2626;
  font-size: 14px;
  margin-top: 4px;
`;

interface StudentFormData {
  studentNumber: string;
  name: string;
  major: string;
  role: string;
}

interface FormErrors {
  studentNumber?: string;
  name?: string;
  major?: string;
  role?: string;
}

export const StudentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentFormData>({
    studentNumber: '',
    name: '',
    major: 'COMPUTER_SCIENCE',
    role: 'ROLE_STUDENT',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = '학번을 입력해주세요.';
    } else if (!/^\d{10}$/.test(formData.studentNumber.trim())) {
      newErrors.studentNumber = '학번은 10자리 숫자여야 합니다.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 최소 2글자 이상이어야 합니다.';
    }

    if (!formData.major) {
      newErrors.major = '전공을 선택해주세요.';
    }

    if (!formData.role) {
      newErrors.role = '역할을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await studentApi.createStudent({
        studentNumber: formData.studentNumber.trim(),
        name: formData.name.trim(),
        major: formData.major,
        role: formData.role,
      });

      alert('학생이 성공적으로 추가되었습니다.');
      navigate('/admin/students');
    } catch (error) {
      console.error('Failed to create student:', error);
      if ((error as { response?: { status?: number } }).response?.status === 409) {
        setErrors({ studentNumber: '이미 존재하는 학번입니다.' });
      } else {
        alert('학생 추가 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Layout>
      <div css={containerStyles}>
        <div css={headerStyles}>
          <h1 css={titleStyles}>새 학생 추가</h1>
        </div>

        <div css={formStyles}>
          <form onSubmit={handleSubmit}>
            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="studentNumber">
                학번 *
              </label>
              <Input
                id="studentNumber"
                type="text"
                value={formData.studentNumber}
                onChange={(e) => handleInputChange('studentNumber', e.target.value)}
                placeholder="예: 2024012345"
                maxLength={10}
              />
              {errors.studentNumber && (
                <div css={errorStyles}>{errors.studentNumber}</div>
              )}
            </div>

            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="name">
                이름 *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="홍길동"
              />
              {errors.name && (
                <div css={errorStyles}>{errors.name}</div>
              )}
            </div>

            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="major">
                전공 *
              </label>
              <select
                id="major"
                css={selectStyles}
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
              >
                {Object.entries(MAJORS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.major && (
                <div css={errorStyles}>{errors.major}</div>
              )}
            </div>

            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="role">
                역할 *
              </label>
              <select
                id="role"
                css={selectStyles}
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <option value={ROLES.STUDENT}>학생</option>
                <option value={ROLES.FINANCE}>재정부</option>
                <option value={ROLES.EXECUTIVE}>집행부</option>
                <option value={ROLES.ADMIN}>관리자</option>
              </select>
              {errors.role && (
                <div css={errorStyles}>{errors.role}</div>
              )}
            </div>

            <div css={buttonRowStyles}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/students')}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};