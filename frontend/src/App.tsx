import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import ProtectedRoute from './components/ProtectedRoute';
//pages Admin
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminCategoryPage from './Pages/Admin/Category/AdminCategoryPage';
import AdminMenuPage from './Pages/Admin/Menu/AdminMenuPage';
import AdminUserPage from './Pages/Admin/User/AdminUserPage';
import AdminPosterPage from './Pages/Admin/Poster/AdminPosterPage';

//pages Auth
import LoginPage from './Pages/Auth/LoginPage';
//pages Manager
import ManagerDashboard from './Pages/Manager/ManagerDashboard';
import ManagerCategoryPage from './Pages/Manager/Category/ManagerCategoryPage';
import ManagerMenuPage from './Pages/Manager/Menu/ManagerMenuPage';

//pages User
import HomePage from './Pages/HomePage';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import OrderHistoryPage from './Pages/OrderHistoryPage';
import MenuPage from './Pages/MenuPage';
import ProfilePage from './Pages/ProfilePage';
import ContactPage from './Pages/ContactPage';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/menus" element={<MenuPage />} />
          

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posters"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPosterPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/categories"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/products"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerMenuPage />
              </ProtectedRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager']}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager']}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;