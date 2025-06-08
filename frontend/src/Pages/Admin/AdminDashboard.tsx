import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardService, { DashboardStats } from '../../services/DashboardService';
import LayoutAdmin from '../../components/Layout/LayoutAdmin';
import { 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaUsers, 
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { FiPackage, FiUser, FiDollarSign, FiShoppingBag } from 'react-icons/fi';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const data = await DashboardService.getAdminStats(token);
        setStats(data);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, timeRange]);

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tổng quan hệ thống</h1>
            <p className="text-gray-600 mt-1">Cập nhật lúc: {new Date().toLocaleString('vi-VN')}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Tuần
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Tháng
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'year' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Năm
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-blue-50 p-3">
                  <FiShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">So với {timeRange === 'week' ? 'tuần trước' : timeRange === 'month' ? 'tháng trước' : 'năm trước'}</span>
                  <div className="flex items-center justify-end mt-1">
                    {stats?.orderChangePercent && stats.orderChangePercent >= 0 ? (
                      <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${stats?.orderChangePercent && stats.orderChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats?.orderChangePercent || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Tổng đơn hàng</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats?.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-green-50 p-3">
                  <FiDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">So với {timeRange === 'week' ? 'tuần trước' : timeRange === 'month' ? 'tháng trước' : 'năm trước'}</span>
                  <div className="flex items-center justify-end mt-1">
                    {stats?.revenueChangePercent && stats.revenueChangePercent >= 0 ? (
                      <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${stats?.revenueChangePercent && stats.revenueChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats?.revenueChangePercent || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats?.totalRevenue?.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-purple-50 p-3">
                  <FiUser className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">So với {timeRange === 'week' ? 'tuần trước' : timeRange === 'month' ? 'tháng trước' : 'năm trước'}</span>
                  <div className="flex items-center justify-end mt-1">
                    {stats?.userChangePercent && stats.userChangePercent >= 0 ? (
                      <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${stats?.userChangePercent && stats.userChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats?.userChangePercent || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Tổng người dùng</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-amber-50 p-3">
                  <FiPackage className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">So với {timeRange === 'week' ? 'tuần trước' : timeRange === 'month' ? 'tháng trước' : 'năm trước'}</span>
                  <div className="flex items-center justify-end mt-1">
                    {stats?.productChangePercent && stats.productChangePercent >= 0 ? (
                      <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${stats?.productChangePercent && stats.productChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats?.productChangePercent || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Tổng sản phẩm</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2 text-gray-400" />
                {timeRange === 'week' ? 'Tuần này' : timeRange === 'month' ? 'Tháng này' : 'Năm nay'}
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaChartLine className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">Biểu đồ sẽ hiển thị tại đây</p>
                <p className="text-xs text-gray-400">(Chức năng đang phát triển)</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Thống kê nhanh</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Đơn hàng hôm nay</p>
                    <p className="text-gray-900 font-semibold">{stats?.todayOrders || 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                  <p className="text-gray-900 font-semibold">
                    {(stats?.todayRevenue || 0).toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <FaMoneyBillWave className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Đơn hàng trung bình</p>
                      <p className="text-gray-900 font-semibold">
                        {(stats?.avgOrderValue || 0).toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Tăng trưởng</p>
                    <div className="flex items-center justify-end">
                      {stats?.orderChangePercent && stats.orderChangePercent >= 0 ? (
                        <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${stats?.orderChangePercent && stats.orderChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(stats?.orderChangePercent || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FaUsers className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Người dùng mới</p>
                    <p className="text-gray-900 font-semibold">{stats?.newUsers || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.products}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status === 'completed'
                          ? 'Hoàn thành'
                          : order.status === 'processing'
                          ? 'Đang xử lý'
                          : order.status === 'pending'
                          ? 'Chờ xác nhận'
                          : 'Đã hủy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats?.recentOrders.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đơn hàng nào</h3>
              <p className="mt-1 text-sm text-gray-500">Chưa có đơn hàng nào được đặt gần đây.</p>
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AdminDashboard;