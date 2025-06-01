import React, { useState } from "react";
import Background from "../components/BackGround";
import SideBar from "../components/Sidebar";

interface Order {
  orderId: string;
  date: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  details?: {
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    address: string;
    note: string;
  };
}

const History: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const historyData: Order[] = [
    {
      orderId: "DH001",
      date: "01/06/2025",
      paymentMethod: "Tiền mặt",
      status: "Hoàn thành",
      totalAmount: 90000,
      details: {
        items: [
          { name: "Phở bò", quantity: 1, price: 50000 },
          { name: "Nước ngọt", quantity: 2, price: 20000 },
        ],
        address: "123 Đường ABC, Quận 1, TP.HCM",
        note: "Không hành, ít cay",
      },
    },
    {
      orderId: "DH002",
      date: "30/05/2025",
      paymentMethod: "Chuyển khoản",
      status: "Đang xử lý",
      totalAmount: 40000,
      details: {
        items: [
          { name: "Bánh mì thịt", quantity: 2, price: 20000 },
        ],
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        note: "Thêm pate",
      },
    },
    {
      orderId: "DH003",
      date: "28/05/2025",
      paymentMethod: "Ví điện tử",
      status: "Hủy",
      totalAmount: 105000,
      details: {
        items: [
          { name: "Cơm gà", quantity: 1, price: 45000 },
          { name: "Canh rau", quantity: 1, price: 20000 },
          { name: "Trà đá", quantity: 2, price: 20000 },
        ],
        address: "789 Đường DEF, Quận 5, TP.HCM",
        note: "Giao giờ nghỉ trưa",
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang xử lý":
        return "bg-blue-100 text-blue-800";
      case "Hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDropdown = (orderId: string) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    setActiveDropdown(null);
  };

  const handleReorder = (order: Order) => {
    // Logic để đặt lại đơn hàng
    alert(`Đặt lại đơn hàng ${order.orderId}`);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setShowDetailModal(false);
  };

  return (
    <Background>
      <div className="flex h-screen overflow-hidden">
        <SideBar />

        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lịch sử đặt món</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {historyData.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có lịch sử đặt món</h3>
                <p className="mt-1 text-gray-500">Bạn chưa có đơn hàng nào được ghi nhận.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Mã đơn", "Ngày đặt", "Hình thức TT", "Tình trạng", "Giá tiền", "Thao tác"].map(
                          (title, i) => (
                            <th
                              key={i}
                              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                i === 0 ? "rounded-tl-xl" : i === 5 ? "rounded-tr-xl" : ""
                              }`}
                            >
                              {title}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historyData.map((order) => (
                        <tr
                          key={order.orderId}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {order.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">
                            {order.totalAmount.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                            <button 
                              onClick={() => toggleDropdown(order.orderId)}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                              </svg>
                            </button>
                            
                            {activeDropdown === order.orderId && (
                              <div className="origin-top-right absolute right-10 top-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  <button
                                    onClick={() => handleViewDetail(order)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    <div className="flex items-center">
                                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      Xem chi tiết
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleReorder(order)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    <div className="flex items-center">
                                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      Đặt lại
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Phân trang giữ nguyên như trước */}
              </div>
            )}
          </div>

          {/* Modal chi tiết đơn hàng */}
          {showDetailModal && selectedOrder && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Chi tiết đơn hàng #{selectedOrder.orderId}
                          </h3>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={closeModal}
                          >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-4">
                          <div className="border-b border-gray-200 pb-4 mb-4">
                            <h4 className="font-medium text-gray-900">Thông tin đơn hàng</h4>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-gray-500">Ngày đặt</p>
                                <p className="text-sm font-medium text-gray-900">{selectedOrder.date}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Hình thức thanh toán</p>
                                <p className="text-sm font-medium text-gray-900">{selectedOrder.paymentMethod}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Tình trạng</p>
                                <p className="text-sm font-medium text-gray-900">
                                  <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Tổng tiền</p>
                                <p className="text-sm font-medium text-red-600">
                                  {selectedOrder.totalAmount.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {selectedOrder.details && (
                            <>
                              <div className="border-b border-gray-200 pb-4 mb-4">
                                <h4 className="font-medium text-gray-900">Chi tiết món ăn</h4>
                                <div className="mt-2">
                                  {selectedOrder.details.items.map((item, index) => (
                                    <div key={index} className="flex justify-between py-2">
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                      </div>
                                      <p className="text-sm text-gray-900">
                                        {(item.price * item.quantity).toLocaleString("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        })}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="border-b border-gray-200 pb-4 mb-4">
                                <h4 className="font-medium text-gray-900">Thông tin giao hàng</h4>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-900">{selectedOrder.details.address}</p>
                                  <p className="text-sm text-gray-500 mt-1">Ghi chú: {selectedOrder.details.note || "Không có ghi chú"}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={() => handleReorder(selectedOrder)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Đặt lại đơn hàng
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Background>
  );
};

export default History;