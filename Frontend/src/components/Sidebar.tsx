import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
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
          to="/saved" 
          isHovered={isHovered} 
          active={location.pathname === "/saved"} 
        />
        <SidebarItem 
          icon="bi bi-gear" 
          label="Cài đặt" 
          to="/setting" 
          isHovered={isHovered} 
          active={location.pathname === "/settings"} 
        />
      </div>

      {/* User Profile Mini */}
      <div className={`flex items-center ${isHovered ? "px-4" : "justify-center"} mt-auto pt-4 border-t border-gray-100`}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i className="bi bi-person text-blue-500"></i>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
        </div>
        {isHovered && (
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;