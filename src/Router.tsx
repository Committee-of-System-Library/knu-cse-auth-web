import { Route, Routes, Navigate, useSearchParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/common';

// Import pages
import { LoginPage } from '@/pages/LoginPage';
import { AdditionalInfoPage } from '@/pages/AdditionalInfoPage';
import { QRAuthPage } from '@/pages/QRAuthPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminCallback } from '@/pages/admin/AdminCallback';
import { StudentManagement } from '@/pages/admin/StudentManagement';
import { DuesManagement } from '@/pages/admin/DuesManagement';

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
      
      {/* Protected user routes */}
      <Route 
        path="/qr-auth" 
        element={
          <ProtectedRoute>
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
        path="/admin/dues" 
        element={
          <ProtectedRoute adminOnly>
            <DuesManagement />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};