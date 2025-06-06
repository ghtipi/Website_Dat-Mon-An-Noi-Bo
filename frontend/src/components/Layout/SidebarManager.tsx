import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory2,
  MdSettings,
  MdLogout,
  MdCategory
} from 'react-icons/md';

const ManagerSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/manager', label: 'Dashboard', icon: MdDashboard },
    { to: '/manager/categories', label: 'Categories', icon: MdCategory },
    { to: '/manager/products', label: 'Products', icon: MdInventory2 },
    { to: '/manager/settings', label: 'Settings', icon: MdSettings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`mt-20 h-screen bg-gray-800 text-white fixed left-0 top-0 transition-all duration-300 ease-in-out shadow-lg z-50
        ${isExpanded ? 'w-64 backdrop-blur-md bg-opacity-90' : 'w-16'} overflow-hidden flex flex-col`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4">
        <h2
          className={`text-2xl font-bold mb-8 transition-all duration-300 transform ${
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } whitespace-nowrap`}
        >
          Manager
        </h2>
      </div>

      {/* Menu chính */}
      <nav className="flex-grow ">
        <ul className="space-y-2 px-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors duration-200"
                title={label}
              >
                <Icon className="min-w-[24px] h-6" />
                <span
                  className={`ml-3 transition-all duration-300 transform ${
                    isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } whitespace-nowrap`}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}

          {/* Nút Đăng xuất */}
          {user && (
            <li>
      <button
        onClick={handleLogout}
        className="flex items-center p-2 hover:bg-red-400 rounded w-full text-left transition-colors duration-200"
        title="Logout"
      >
        <MdLogout className="min-w-[24px] h-6" size={24} />
        <span
          className={`ml-3 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0' 
          } whitespace-nowrap`}
        >
          Đăng Xuất
        </span>
      </button>
    </li>
   )} 
        </ul>
      </nav>
    </div>
  );
};

export default ManagerSidebar;
