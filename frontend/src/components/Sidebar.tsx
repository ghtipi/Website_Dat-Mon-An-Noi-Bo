import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoSettingsOutline, IoMailOutline, IoInformationCircleOutline } from "react-icons/io5";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const path = location.pathname.replace('/', '') || 'home';
  const pageTitle = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <div
      className={`h-screen text-black fixed left-0 top-0 shadow-lg transition-all duration-200 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } overflow-hidden bg-transparent backdrop-blur-sm`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4">
        <h2
          className={`text-2xl font-bold mb-8 transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } whitespace-nowrap`}
        >
          {pageTitle}
        </h2>

        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 hover:bg-gray-100 rounded" title="Home">
                <IoHomeOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  Home
                </span>
              </Link>
            </li>

            <li>
              <Link to="/setting" className="flex items-center p-2 hover:bg-gray-100 rounded" title="Setting">
                <IoSettingsOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  Setting
                </span>
              </Link>
            </li>

            <li>
              <Link to="/contact" className="flex items-center p-2 hover:bg-gray-100 rounded" title="Contact">
                <IoMailOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  Contact
                </span>
              </Link>
            </li>

            <li>
              <Link to="/about" className="flex items-center p-2 hover:bg-gray-100 rounded" title="About">
                <IoInformationCircleOutline className="min-w-[24px] h-6" size={24} />
                <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                  About
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
