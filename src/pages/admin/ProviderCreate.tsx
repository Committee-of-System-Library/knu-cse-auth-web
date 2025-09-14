/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Input } from '@/components/common';
import { providerApi } from '@/utils/api';

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

interface ProviderFormData {
  email: string;
  providerName: string;
  providerKey: string;
  studentId: string;
}

interface FormErrors {
  email?: string;
  providerName?: string;
  providerKey?: string;
  studentId?: string;
}

export const ProviderCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProviderFormData>({
    email: '',
    providerName: 'GOOGLE',
    providerKey: '',
    studentId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.providerName) {
      newErrors.providerName = 'Provider를 선택해주세요.';
    }

    if (!formData.providerKey.trim()) {
      newErrors.providerKey = 'Provider Key를 입력해주세요.';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = '학생 ID를 입력해주세요.';
    } else if (!/^\d+$/.test(formData.studentId.trim())) {
      newErrors.studentId = '학생 ID는 숫자여야 합니다.';
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
      await providerApi.createProvider({
        email: formData.email.trim(),
        providerName: formData.providerName,
        providerKey: formData.providerKey.trim(),
        studentId: Number(formData.studentId.trim()),
      });

      alert('Provider가 성공적으로 추가되었습니다.');
      navigate('/admin/providers');
    } catch (error) {
      console.error('Failed to create provider:', error);
      if ((error as { response?: { status?: number } }).response?.status === 409) {
        setErrors({ email: '이미 존재하는 이메일입니다.' });
      } else {
        alert('Provider 추가 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProviderFormData, value: string) => {
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
          <h1 css={titleStyles}>새 Provider 추가</h1>
        </div>

        <div css={formStyles}>
          <form onSubmit={handleSubmit}>
            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="email">
                이메일 *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="예: user@example.com"
              />
              {errors.email && (
                <div css={errorStyles}>{errors.email}</div>
              )}
            </div>

            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="providerName">
                Provider *
              </label>
              <select
                id="providerName"
                css={selectStyles}
                value={formData.providerName}
                onChange={(e) => handleInputChange('providerName', e.target.value)}
              >
                <option value="GOOGLE">Google</option>
                <option value="GITHUB">GitHub</option>
                <option value="KAKAO">Kakao</option>
              </select>
              {errors.providerName && (
                <div css={errorStyles}>{errors.providerName}</div>
              )}
            </div>

            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="providerKey">
                Provider Key *
              </label>
              <Input
                id="providerKey"
                type="text"
                value={formData.providerKey}
                onChange={(e) => handleInputChange('providerKey', e.target.value)}
                placeholder="Provider에서 제공하는 고유 키"
              />
              {errors.providerKey && (
                <div css={errorStyles}>{errors.providerKey}</div>
              )}
            </div>

            <div css={fieldStyles}>
              <label css={labelStyles} htmlFor="studentId">
                학생 ID *
              </label>
              <Input
                id="studentId"
                type="text"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="예: 1"
              />
              {errors.studentId && (
                <div css={errorStyles}>{errors.studentId}</div>
              )}
            </div>

            <div css={buttonRowStyles}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/providers')}
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