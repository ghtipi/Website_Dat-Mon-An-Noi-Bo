import React from 'react';
import { Link } from 'react-router-dom';

const UserSidebar: React.FC = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Menu</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700">
                <span className="material-icons mr-2">home</span>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/menu" className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700">
                <span className="material-icons mr-2">restaurant_menu</span>
                Thực đơn
              </Link>
            </li>
            <li>
              <Link to="/orders" className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700">
                <span className="material-icons mr-2">receipt_long</span>
                Đơn hàng của tôi
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700">
                <span className="material-icons mr-2">person</span>
                Thông tin cá nhân
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700">
                <span className="material-icons mr-2">contact_support</span>
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default UserSidebar; 