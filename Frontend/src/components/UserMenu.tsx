import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserMenuProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Đóng menu khi click bên ngoài hoặc scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      setIsOpen(false);
      localStorage.clear();
      navigate("/login");
    }
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
            width={32}
            height={32}
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-md shadow-lg z-50 border border-gray-100">
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
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-person mr-3 w-5 text-center"></i>
                <span>Trang cá nhân</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-cart3 mr-3 w-5 text-center"></i>
                <span>Giỏ hàng</span>
              </Link>
            </li>
            <li className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50 active:bg-gray-100 text-left"
              >
                <i className="bi bi-box-arrow-right mr-3 w-5 text-center"></i>
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;