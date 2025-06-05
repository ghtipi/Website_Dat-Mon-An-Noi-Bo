import React from "react";
import {
  FiEdit,
  FiStar,
  FiMapPin,
  FiShoppingBag,
  FiMail,
  FiUser,
} from "react-icons/fi";

interface UserProfileProps {
  name?: string;
  email?: string;
  favoriteDish?: string;
  address?: string;
  orderCount?: number;
  avatarUrl?: string;
  loyaltyPoints?: number;
  joinedDate?: string;
  onEdit?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name = "Nguyễn Văn A",
  email = "nguyenvana@gmail.com",
  favoriteDish = "Cơm gà xối mỡ",
  address = "123 Lê Lợi, Q.1, TP.HCM",
  orderCount = 12,
  avatarUrl = "https://i.pravatar.cc/150",
  loyaltyPoints = 450,
  joinedDate = "15/03/2022",
  onEdit,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Hồ sơ người dùng</h1>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-white hover:text-indigo-200 transition flex items-center space-x-1"
              aria-label="Edit profile"
            >
              <FiEdit className="w-5 h-5" />
              <span className="text-sm">Chỉnh sửa</span>
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="absolute -bottom-2 right-2 bg-indigo-500 text-white rounded-full p-1.5 shadow">
                  <FiUser className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
              <div className="mt-2 flex items-center text-gray-600">
                <FiMail className="w-4 h-4 mr-2" />
                <span>{email}</span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <FiShoppingBag className="w-5 h-5" />
                    <span className="font-medium">Đơn hàng</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{orderCount}</p>
                  <p className="text-sm text-gray-500">Tổng số đơn đã đặt</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <FiStar className="w-5 h-5" />
                    <span className="font-medium">Điểm tích lũy</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{loyaltyPoints}</p>
                  <p className="text-sm text-gray-500">Điểm thưởng của bạn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiết</h3>
            <div className="space-y-4">
              <DetailRow icon={<FiMapPin className="w-5 h-5 text-indigo-500" />} label="Địa chỉ" value={address} />
              <DetailRow icon={<FiStar className="w-5 h-5 text-yellow-500" />} label="Món yêu thích" value={favoriteDish} />
              <DetailRow
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                label="Thành viên từ"
                value={joinedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start">
    <div className="mt-1">{icon}</div>
    <div className="ml-3">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  </div>
);

export default UserProfile;
