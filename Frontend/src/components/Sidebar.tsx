import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

type SidebarItemProps = {
  icon: string;
  label: string;
  to?: string;
  isHovered: boolean;
  active: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to = "#", isHovered, active }) => (
  <Link
    to={to}
    className={`flex items-center transition-all duration-300 ease-out
      ${isHovered ? "justify-start space-x-4 px-4" : "justify-center px-2"}
      ${active 
        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border-l-4 border-blue-500 font-medium" 
        : "text-gray-600 hover:bg-gray-50 hover:text-blue-500"
      }
      py-3 rounded-r-lg mx-2 mb-1`}
  >
    <i className={`${icon} text-xl ${active ? "text-blue-500" : "text-gray-500"}`}></i>
    {isHovered && (
      <span className="text-sm whitespace-nowrap transition-opacity duration-200">
        {label}
      </span>
    )}
  </Link>
);

const Sidebar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example: navigate to login page after logout
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center mb-4">
              <i className="bi bi-exclamation-triangle-fill text-yellow-500 text-xl mr-2"></i>
              <h3 className="text-lg font-medium text-gray-900">Xác nhận đăng xuất</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 bg-white shadow-lg z-40 transition-all duration-300 ease-in-out
          ${isHovered ? "w-56" : "w-20"} h-screen overflow-y-auto
          border-r border-gray-100 flex flex-col py-6`}
      >
        {/* Logo/App Name */}
        <div className={`flex items-center ${isHovered ? "px-4 mb-8" : "justify-center mb-10"}`}>
          <div className="bg-blue-500 text-white p-2 rounded-lg">
            <i className="bi bi-cup-hot-fill text-xl"></i>
          </div>
          {isHovered && (
            <h1 className="ml-3 text-xl font-bold text-gray-800">FoodApp</h1>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1">
          <SidebarItem 
            icon="bi bi-house" 
            label="Trang chủ" 
            to="/" 
            isHovered={isHovered} 
            active={location.pathname === "/"} 
          />
          <SidebarItem 
            icon="bi bi-grid" 
            label="Danh mục" 
            to="/categories" 
            isHovered={isHovered} 
            active={location.pathname === "/categories"} 
          />
          <SidebarItem 
            icon="bi bi-clock-history" 
            label="Lịch sử" 
            to="/history" 
            isHovered={isHovered} 
            active={location.pathname === "/history"} 
          />
          <SidebarItem 
            icon="bi bi-tag" 
            label="Khuyến mãi" 
            to="/voucher" 
            isHovered={isHovered} 
            active={location.pathname === "/voucher"} 
          />
          <SidebarItem 
            icon="bi bi-bookmark" 
            label="Đã lưu" 
            to="/favorites" 
            isHovered={isHovered} 
            active={location.pathname === "/favorites"} 
          />
          <SidebarItem 
            icon="bi bi-gear" 
            label="Cài đặt" 
            to="/setting" 
            isHovered={isHovered} 
            active={location.pathname === "/settings"} 
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`flex items-center transition-all duration-300 ease-out
            ${isHovered ? "justify-start space-x-4 px-4" : "justify-center px-2"}
            text-gray-600 hover:bg-gray-50 hover:text-red-500
            py-3 rounded-r-lg mx-2 mb-1 mt-auto`}
        >
          <i className="bi bi-box-arrow-right text-xl text-gray-500"></i>
          {isHovered && (
            <span className="text-sm whitespace-nowrap transition-opacity duration-200">
              Đăng xuất
            </span>
          )}
        </button>
      </nav>
    </>
  );
};

export default Sidebar;