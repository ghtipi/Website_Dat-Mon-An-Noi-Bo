import React, { useState } from "react";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  const [notificationCount] = useState(3);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isCompact = notificationCount > 0;

  return (
    <nav
      className={`bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
        isCompact ? "py-1" : "py-2"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Hamburger + logo */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <button className="md:hidden text-gray-600 focus:outline-none p-1">
              <i className="bi bi-list text-xl sm:text-2xl"></i>
            </button>

            <div
              className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                isCompact ? "p-1.5" : "p-2"
              }`}
              style={{ width: isCompact ? 36 : 40, height: isCompact ? 36 : 40 }}
            >
              <i
                className={`bi bi-shop transition-all duration-300 ${
                  isCompact ? "text-lg" : "text-xl"
                }`}
              ></i>
            </div>

            {/* Tiêu đề + ngày - ẩn trên mobile nhỏ (<=375px) */}
            <div className="hidden sm:flex flex-col min-w-0 max-w-[180px] truncate">
              <h1
                className="text-lg md:text-xl font-bold text-gray-800 truncate"
                title="Căn tin nội bộ Tipi"
              >
                Căn tin nội bộ Tipi
              </h1>
              <p
                className="text-xs md:text-sm text-gray-500 flex items-center truncate"
                title={formattedDate}
              >
                <i className="bi bi-calendar3 mr-1"></i>
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="flex-1 max-w-full sm:max-w-2xl mx-2 sm:mx-4 min-w-0">
            <SearchBar onSearch={(query) => console.log("Tìm kiếm:", query)} />
          </div>

          {/* Icon bên phải */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {/* Notification */}
            <div className="relative hidden xs:block flex-shrink-0">
              <i
                className={`bi bi-bell cursor-pointer transition-transform duration-300 ${
                  isCompact ? "text-lg" : "text-xl"
                } text-gray-600 hover:text-blue-500`}
              ></i>

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>

            {/* User menu */}
            <UserMenu />
          </div>
        </div>

        {/* Tiêu đề + ngày cho màn hình <=375px (mobile) */}
        <div className="sm:hidden mt-1 text-center px-1">
          <h1
            className="text-base font-bold text-gray-800 truncate"
            title="Căn tin nội bộ Tipi"
          >
            Căn tin nội bộ Tipi
          </h1>
          <p
            className="text-xs text-gray-500 flex items-center justify-center truncate"
            title={formattedDate}
          >
            <i className="bi bi-calendar3 mr-1"></i>
            {formattedDate}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
