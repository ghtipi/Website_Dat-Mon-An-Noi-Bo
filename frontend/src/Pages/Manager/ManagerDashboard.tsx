import React, { useEffect, useState } from 'react';
import LayoutManager from '../../components/Layout/LayoutManager';
import DashboardService, { DashboardStats } from '../../services/DashboardService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const data = await DashboardService.getManagerStats(token);
        setStats(data);
      } catch (error: any) {
        toast.error(error.message || 'Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <LayoutManager>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </LayoutManager>
    );
  }

  return (
    <LayoutManager>
      <main className="mt-24 p-8 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thống kê tổng quan */}
            <div className="bg-blue-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Tổng đơn hàng</h3>
              <p className="text-3xl font-bold">{stats?.totalOrders.toLocaleString() || 0}</p>
            </div>
            
            <div className="bg-green-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Doanh thu</h3>
              <p className="text-3xl font-bold">{stats?.totalRevenue.toLocaleString() || 0}đ</p>
            </div>
            
            <div className="bg-yellow-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Người dùng</h3>
              <p className="text-3xl font-bold">{stats?.totalUsers.toLocaleString() || 0}</p>
            </div>
            
            <div className="bg-purple-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
              <p className="text-3xl font-bold">{stats?.totalProducts.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Bảng đơn hàng gần đây */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Đơn hàng gần đây</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.products}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.totalAmount.toLocaleString()}đ</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'completed' 
                            ? 'Hoàn thành'
                            : order.status === 'pending'
                            ? 'Đang xử lý'
                            : 'Đã hủy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </LayoutManager>
  );
};

export default ManagerDashboard; 