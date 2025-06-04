

import LayoutManager from '../../components/Layout/LayoutManager';

const ManagerDashboard = () => {
  return (
    <LayoutManager>
    <main className=" mt-24  p-8 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thống kê tổng quan */}
            <div className="bg-blue-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Tổng đơn hàng</h3>
              <p className="text-3xl font-bold">150</p>
            </div>
            
            <div className="bg-green-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Doanh thu</h3>
              <p className="text-3xl font-bold">15.000.000đ</p>
            </div>
            
            <div className="bg-yellow-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Người dùng</h3>
              <p className="text-3xl font-bold">1,250</p>
            </div>
            
            <div className="bg-purple-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
              <p className="text-3xl font-bold">45</p>
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
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap">Nguyễn Văn A</td>
                    <td className="px-6 py-4 whitespace-nowrap">Cơm sườn, Trà sữa</td>
                    <td className="px-6 py-4 whitespace-nowrap">85.000đ</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Hoàn thành
                      </span>
                    </td>
                  </tr>
                  {/* Thêm các hàng khác tương tự */}
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