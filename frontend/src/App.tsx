import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './Pages/Auth/LoginPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ManagerDashboard from './Pages/Admin/ManagerDashboard';
import HomePage from './Pages/User/HomePage';
import UserSidebar from './components/UserSidebar';
import AdminSidebar from './components/AdminSidebar';
import ManagerSidebar from './components/ManagerSidebar';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="flex">
                <AdminSidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* Thêm các route admin khác ở đây */}
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Protected Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <div className="flex">
                <ManagerSidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    {/* Thêm các route quản lý khác ở đây */}
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <div className="flex">
                <UserSidebar />
                <div className="flex-1">
                  <Routes>
                    {/* Thêm các route user ở đây */}
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;