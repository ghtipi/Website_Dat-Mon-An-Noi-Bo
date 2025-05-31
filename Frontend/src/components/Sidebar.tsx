import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

type SidebarItemProps = {
  icon: string;
  label: string;
  to?: string;
  isHovered: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to = "#", isHovered }) => (
  <Link
    to={to}
    className="flex items-center space-x-4 text-gray-700 hover:text-blue-600 mb-6 transition-colors duration-200"
  >
    <i className={`${icon} text-xl`}></i>
    {isHovered && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

const Sidebar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-5 left-2 bg-white shadow-md z-50 transition-all duration-300
        ${isHovered ? "w-56" : "w-16"} h-[90vh] overflow-hidden
        rounded-tr-xl rounded-br-xl px-4 py-6 flex flex-col`}
    >
      <SidebarItem icon="bi bi-house" label="Trang chủ" to="/" isHovered={isHovered} />
      <SidebarItem icon="bi bi-border-all" label="Danh mục" to="/categories" isHovered={isHovered} />
      <SidebarItem icon="bi bi-egg-fried" label="Món ăn" to="/foods" isHovered={isHovered} />
      <SidebarItem icon="bi bi-clock" label="Lịch sử" to="/history" isHovered={isHovered} />
      <SidebarItem icon="bi bi-tags-fill" label="Khuyến mãi" to="/promotions" isHovered={isHovered} />
      <SidebarItem icon="bi bi-bookmark" label="Đã lưu" to="/saved" isHovered={isHovered} />
      <SidebarItem icon="bi bi-gear" label="Cài đặt" to="/settings" isHovered={isHovered} />
    </nav>
  );
};

export default Sidebar;
