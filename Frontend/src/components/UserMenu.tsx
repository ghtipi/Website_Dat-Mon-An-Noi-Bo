import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface UserMenuProps {
  user?: {
    name: string;
    avatar?: string;
    // thêm các thông tin khác nếu có
  };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
        aria-label="Menu người dùng"
        aria-expanded={isOpen}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="bi bi-person text-gray-600"></i>
          </div>
        )}
        <span className="font-medium text-gray-700 hidden md:inline-block">
          {user?.name || "Tài khoản"}
        </span>
        <i
          className={`bi bi-chevron-down text-xs text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500">Đã đăng nhập với</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "Người dùng"}
            </p>
          </div>
          <ul className="py-1">
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-person mr-2"></i>
                Trang cá nhân
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-cart3 mr-2"></i>
                Giỏ hàng
              </Link>
            </li>
            <li className="border-t border-gray-100 mt-1">
              <button
                onClick={() => {
                  alert("Đăng xuất");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                <i className="bi bi-box-arrow-right mr-2"></i>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;