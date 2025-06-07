import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoSettingsOutline, 
  IoMailOutline, 
  IoLogOutOutline,
  IoReceiptOutline,
  IoCartOutline,
  IoMenuOutline
} from "react-icons/io5";
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (to: string) => {
    if (to === '/' && location.pathname === '/') return true;
    return location.pathname === to;
  };

  const menuItemClass = (to: string) => 
    `flex items-center p-3 rounded-lg transition-all duration-300 pr-8  ${
      isActive(to) 
        ? 'bg-teal-600 ' 
        : 'text-gray-700 hover:bg-teal-100 hover:text-teal-700'
    } group relative`;

  return (
    <div
      className={`h-screen fixed left-0 top-0 shadow-xl transition-all duration-300 ease-in-out mt-16  ${
        isExpanded ? 'w-64' : 'w-16'
      } bg-transparent backdrop-blur-sm border-r border-gray-100/50 z-50 overflow-hidden`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-6 flex flex-col h-full pl-3">
        <nav className="flex flex-col h-full">
          {/* Menu chính */}
          <ul className="space-y-2 mt-2 ">
            <li>
              <Link to="/" className={menuItemClass('/')} title="Trang Chủ">
                <IoHomeOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } whitespace-nowrap`}>
                  Trang Chủ
                </span>
                {!isExpanded && (
                  <span className=" absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                    Trang Chủ
                  </span>
                )}
              </Link>
            </li>
            
            <li>
              <Link to="/Menus" className={menuItemClass('/Menus')} title="Menu">
                <IoMenuOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } whitespace-nowrap`}>
                  Menu
                </span>
                {!isExpanded && (
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Menu
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/orders" className={menuItemClass('/orders')} title="Lịch Sử Giao Dịch">
                <IoReceiptOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } whitespace-nowrap`}>
                  Lịch Sử Giao Dịch
                </span>
                {!isExpanded && (
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Lịch Sử Giao Dịch
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/cart" className={menuItemClass('/cart')} title="Giỏ Hàng">
                <IoCartOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } whitespace-nowrap`}>
                  Giỏ Hàng
                </span>
                {!isExpanded && (
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Giỏ Hàng
                  </span>
                )}
              </Link>
            </li>
          </ul>

          <div className="flex-grow"></div>

          {/* Menu phụ */}
          <ul className="space-y-2 mb-16 ">
            <li>
              <Link to="/setting" className={menuItemClass('/setting')} title="Cài Đặt">
                <IoSettingsOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } whitespace-nowrap`}>
                  Cài Đặt
                </span>
                {!isExpanded && (
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Cài Đặt
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/contact" className={menuItemClass('/contact')} title="Liên Hệ">
                <IoMailOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } whitespace-nowrap`}>
                  Liên Hệ
                </span>
                {!isExpanded && (
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Liên Hệ
                  </span>
                )}
              </Link>
            </li>
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-all duration-300 w-full text-left group relative"
                  title="Đăng Xuất"
                >
                  <IoLogOutOutline className="min-w-[24px] h-6" size={24} />
                  <span className={`ml-3 text-sm font-semibold transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}>
                    Đăng Xuất
                  </span>
                  {!isExpanded && (
                    <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Đăng Xuất
                    </span>
                  )}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;