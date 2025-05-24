import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdPeople, MdInventory2, MdShoppingCart, MdSettings, MdBarChart } from 'react-icons/md';

const AdminSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`h-screen bg-gray-800 text-white fixed left-0 top-0 transition-all duration-200 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } overflow-hidden`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4">
        <h2
          className={`text-2xl font-bold mb-8 transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } whitespace-nowrap`}
        >
          Admin Dashboard
        </h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                title="Dashboard"
              >
                <MdDashboard className="min-w-[24px] h-6" size={24} />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}
                >
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                title="Users"
              >
                <MdPeople className="min-w-[24px] h-6" size={24} />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}
                >
                  Users
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                title="Products"
              >
                <MdInventory2 className="min-w-[24px] h-6" size={24} />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}
                >
                  Products
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                title="Orders"
              >
                <MdShoppingCart className="min-w-[24px] h-6" size={24} />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}
                >
                  Orders
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reports"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                title="Reports"
              >
                <MdBarChart className="min-w-[24px] h-6" size={24} />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}
                >
                  Reports
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                title="Settings"
              >
                <MdSettings className="min-w-[24px] h-6" size={24} />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } whitespace-nowrap`}
                >
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;