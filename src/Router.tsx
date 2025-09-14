import { Route, Routes, Navigate, useSearchParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/common';
import { LoginPage } from '@/pages/auth/LoginPage';
import { AdditionalInfoPage } from '@/pages/auth/AdditionalInfoPage';
import { QRAuthPage } from '@/pages/QRAuthPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminCallback } from '@/pages/admin/AdminCallback';
import { StudentManagement } from '@/pages/admin/StudentManagement';
import { StudentCreate } from '@/pages/admin/StudentCreate';
import { StudentEdit } from '@/pages/admin/StudentEdit';
import { DuesManagement } from '@/pages/admin/DuesManagement';
import { QrLogManagement } from '@/pages/admin/QrLogManagement';
import { ProviderManagement } from '@/pages/admin/ProviderManagement';
import { ProviderCreate } from '@/pages/admin/ProviderCreate';

const CallbackHandler = () => {
  return <LoadingSpinner />;
};

const HomePage = () => {
  return <Navigate to="/login" replace />;
};

const AdminRouteHandler = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    if (code) {
        return <AdminCallback />;
    }

    return (
        <ProtectedRoute adminOnly>
            <AdminDashboard />
        </ProtectedRoute>
    );
};

export const Router = () => {
  return (
    <Routes>
      {/* Home route */}
      <Route index element={<HomePage />} />
      
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/additional-info" element={<AdditionalInfoPage />} />
      <Route path="/callback" element={<CallbackHandler />} />
      
      {/* Admin QR Auth route */}
      <Route
        path="/qr-auth"
        element={
          <ProtectedRoute adminOnly>
            <QRAuthPage />
          </ProtectedRoute>
        }
      />
      
      {/* Admin routes */}
      <Route
        path="/admin"
        element={<AdminRouteHandler />}
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute adminOnly>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students/create"
        element={
          <ProtectedRoute adminOnly>
            <StudentCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students/:id/edit"
        element={
          <ProtectedRoute adminOnly>
            <StudentEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dues"
        element={
          <ProtectedRoute adminOnly>
            <DuesManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/qr-logs"
        element={
          <ProtectedRoute adminOnly>
            <QrLogManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/providers"
        element={
          <ProtectedRoute adminOnly>
            <ProviderManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/providers/create"
        element={
          <ProtectedRoute adminOnly>
            <ProviderCreate />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};