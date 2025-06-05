import React, { useState } from "react";
import {
  FiUser,
  FiEdit,
  FiCreditCard,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiLock,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
} from "react-icons/fi";

interface Transaction {
  id: number;
  date: string;
  type: "Nạp tiền" | "Thanh toán" | string;
  amount: number;
  status: "Thành công" | "Đang xử lý" | "Thất bại" | string;
}

interface User {
  avatarUrl: string;
  name: string;
  studentId: string;
  class: string;
  phone: string;
  email: string;
  address: string;
  transactionHistory: Transaction[];
  paymentMethod: string;
  balance: number;
  rewardPoints: number;
  notificationsEnabled: boolean;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    avatarUrl: "https://i.pravatar.cc/150",
    name: "Nguyễn Văn A",
    studentId: "HS2023-15A3",
    class: "12A3",
    phone: "0987654321",
    email: "nguyenvana@school.edu.vn",
    address: "Canteen số 1, tầng 2",
    transactionHistory: [
      { id: 1, date: "15/06/2023", type: "Nạp tiền", amount: 500000, status: "Thành công" },
      { id: 2, date: "14/06/2023", type: "Thanh toán", amount: 30000, status: "Thành công" },
      { id: 3, date: "13/06/2023", type: "Thanh toán", amount: 45000, status: "Đang xử lý" },
      { id: 4, date: "12/06/2023", type: "Nạp tiền", amount: 200000, status: "Thất bại" },
    ],
    paymentMethod: "Ví điện tử Momo",
    balance: 125000,
    rewardPoints: 250,
    notificationsEnabled: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email,
    address: user.address,
  });

  const toggleNotifications = () => {
    setUser(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = () => {
    setUser(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Thành công":
        return "bg-green-100 text-green-800";
      case "Đang xử lý":
        return "bg-amber-100 text-amber-800";
      case "Thất bại":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Thông tin cá nhân</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Thông tin cá nhân</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-white hover:text-indigo-200 flex items-center text-sm"
                >
                  <FiEdit className="mr-1" /> 
                  {isEditing ? "Hủy bỏ" : "Chỉnh sửa"}
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative group">
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-white bg-indigo-600 p-2 rounded-full">
                          <FiEdit className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full mb-2"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                    )}
                    <div className="text-gray-600 text-base">
                      <div className="flex items-center mt-2">
                        <FiCreditCard className="mr-2 text-indigo-600" />
                        <span>{user.studentId}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <FiUser className="mr-2 text-indigo-600" />
                        <span>Lớp: {user.class}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FiPhone className="mr-3 text-indigo-600 text-xl min-w-5" />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="text-lg border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                      />
                    ) : (
                      <span className="text-lg">{user.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiMail className="mr-3 text-indigo-600 text-xl min-w-5" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="text-lg border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                      />
                    ) : (
                      <span className="text-lg">{user.email}</span>
                    )}
                  </div>
                  <div className="flex items-start text-gray-700">
                    <FiMapPin className="mr-3 text-indigo-600 text-xl mt-1 min-w-5" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                        className="text-lg border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                      />
                    ) : (
                      <span className="text-lg">Địa chỉ nhận: {user.address}</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={saveChanges}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-800 flex items-center">
                  <FiClock className="mr-2 text-indigo-600" />
                  Lịch sử giao dịch
                </h2>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                  <FiPlus className="mr-1" /> Nạp tiền
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.transactionHistory.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.date}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.type}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {transaction.type === "Nạp tiền" ? (
                              <span className="text-green-600">+{transaction.amount.toLocaleString()}đ</span>
                            ) : (
                              <span className="text-red-600">-{transaction.amount.toLocaleString()}đ</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="w-full mt-4 text-indigo-600 text-base font-medium hover:text-indigo-800">
                  Xem tất cả
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment & Rewards */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b">
                <h2 className="font-bold text-lg text-gray-800 flex items-center">
                  <FiCreditCard className="mr-2 text-indigo-600" />
                  Thanh toán & Tích lũy
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-500 mb-3">
                    Phương thức thanh toán
                  </h3>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg mr-4">
                      <FiCreditCard className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-lg text-gray-800">{user.paymentMethod}</p>
                  </div>
                  <button className="mt-3 text-indigo-600 text-sm hover:text-indigo-800">
                    Thay đổi phương thức
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Số dư tài khoản</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {user.balance.toLocaleString()}đ
                    </p>
                    <button className="mt-2 text-indigo-600 text-xs hover:text-indigo-800">
                      Nạp thêm tiền
                    </button>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Điểm tích lũy</p>
                    <p className="text-xl font-bold text-amber-600">
                      {user.rewardPoints} điểm
                    </p>
                    <button className="mt-2 text-amber-600 text-xs hover:text-amber-800">
                      Đổi quà tặng
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings & Support */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b">
                <h2 className="font-bold text-lg text-gray-800">Cài đặt & Hỗ trợ</h2>
              </div>
              <div className="p-3">
                <button 
                  onClick={toggleNotifications}
                  className="w-full flex items-center px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <FiBell className="mr-3 text-indigo-600 text-xl" />
                  <span className="text-lg">Thông báo</span>
                  <div className="ml-auto">
                    <div
                      className={`w-12 h-7 rounded-full flex items-center transition duration-300 ${
                        user.notificationsEnabled
                          ? "bg-indigo-600 justify-end"
                          : "bg-gray-300 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white mx-1 shadow-sm"></div>
                    </div>
                  </div>
                </button>

                <button className="w-full flex items-center px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <FiLock className="mr-3 text-indigo-600 text-xl" />
                  <span className="text-lg">Đổi mật khẩu</span>
                </button>

                <button className="w-full flex items-center px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <FiHelpCircle className="mr-3 text-indigo-600 text-xl" />
                  <span className="text-lg">Trợ giúp & Hỗ trợ</span>
                </button>

                <button className="w-full flex items-center px-4 py-4 text-red-600 hover:bg-gray-50 rounded-lg">
                  <FiLogOut className="mr-3 text-xl" />
                  <span className="text-lg">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;