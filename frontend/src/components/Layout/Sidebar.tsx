import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoSettingsOutline, 
  IoMailOutline, 
  IoInformationCircleOutline, 
  IoLogOutOutline 
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
    `flex items-center p-2 rounded pr-8  ${
      isActive(to) ? 'bg-teal-600' : 'hover:bg-teal-600'
    }`;

  return (
    <div
  className={`h-screen text-black fixed left-0 top-0 shadow-lg transition-all duration-200 ease-in-out mt-16 ${
    isExpanded ? 'w-64' : 'w-16'
  } overflow-hidden bg-transparent backdrop-blur-sm z-50`}
  onMouseEnter={() => setIsExpanded(true)}
  onMouseLeave={() => setIsExpanded(false)}
>
      <div className="p-4 flex flex-col h-full">
        
        

        <nav className="flex flex-col h-full">
          {/* Menu chính */}
          <ul className="space-y-2 mt-2 ">
            <li>
              <Link to="/" className={menuItemClass('/')} title="Home">
                <IoHomeOutline className="min-w-[24px] h-6 " size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  Trang Chủ
                </span>
              </Link>
            </li>

            <li>
              <Link to="/about" className={menuItemClass('/about')} title="About">
                <IoInformationCircleOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  About
                </span>
              </Link> 
            </li>
          </ul>

          <div className="flex-grow"></div>

          {/* Menu phụ */}
          <ul className="space-y-2 mb-16 ">
            <li>
              <Link to="/setting" className={menuItemClass('/setting')} title="Setting">
                <IoSettingsOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  Cài Đặt
                </span>
              </Link>
            </li>

            <li>
              <Link to="/contact" className={menuItemClass('/contact')} title="Contact">
                <IoMailOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  Liên Hệ
                </span>
              </Link>
            </li>

            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 hover:bg-red-400 rounded w-full text-left"
                  title="Logout"
                >
                  <IoLogOutOutline className="min-w-[24px] h-6" size={24} />
                  <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                    Đăng Xuất
                  </span>
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
