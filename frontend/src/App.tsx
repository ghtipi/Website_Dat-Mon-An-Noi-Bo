import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
//layout
import Header from './components/Layout/Header';
import HeaderAdmin from './components/Layout/HeaderAdmin';
import HeaderManager from './components/Layout/HeaderManager';
import UserSidebar from './components/Layout/Sidebar';
import AdminSidebar from './components/Layout/SidebarAdmin';
import ManagerSidebar from './components/Layout/SidebarManager';


import ProtectedRoute from './components/ProtectedRoute';
//pages Admin
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminCategoryPage from './Pages/Admin/Category/AdminCategoryPage';
import AdminMenuPage from './Pages/Admin/Menu/AdminMenuPage';
import AdminUserPage from './Pages/Admin/User/AdminUserPage';
//pages Auth
import LoginPage from './Pages/Auth/LoginPage';
//pages Manager
import ManagerDashboard from './Pages/Manager/ManagerDashboard';
import ManagerCategoryPage from './Pages/Manager/Category/ManagerCategoryPage';
import ManagerMenuPage from './Pages/Manager/Menu/ManagerMenuPage';


//pages User
import HomePage from './Pages/User/HomePage';




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
                <HeaderAdmin />
                <AdminSidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="categories" element={<AdminCategoryPage />} />
                    <Route path="products" element={<AdminMenuPage />} />
                    <Route path="users" element={<AdminUserPage />} />

                    {/* các route quản lý khác */}
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
                <HeaderManager />
                <ManagerSidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<ManagerDashboard />} />
                    <Route path="categories" element={<ManagerCategoryPage />} />
                    <Route path="products" element={<ManagerMenuPage />} />
                    {/* các route quản lý  */}
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
                <Header />
                <UserSidebar />
                <div className="flex-1">
                  <Routes>
                    {/*  các route user  */}
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