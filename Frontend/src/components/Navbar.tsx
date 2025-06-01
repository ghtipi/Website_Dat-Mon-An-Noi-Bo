import React from "react";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";

const handleSearch = (query: string) => {
  console.log("Đã tìm kiếm:", query);
  // TODO: Gọi API hoặc lọc dữ liệu tại đây
};

const Navbar: React.FC = () => {
  // Get current date in Vietnamese format
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <nav className="bg-transparent backdrop-blur-lg border-b border-gray-200">


      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo & Date */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg">
            <i className="bi bi-shop text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Căn tin nội bộ Tipi</h1>
            <p className="text-sm text-gray-500 flex items-center">
              <i className="bi bi-calendar3 mr-1"></i>
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Search and User Section */}
        <div className="flex items-center space-x-6">
          {/* SearchBar - Made wider */}
          <div className="w-[900px]">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Notification with badge */}
          <div className="relative">
            <i className="bi bi-bell text-gray-600 text-xl cursor-pointer hover:text-blue-500 transition-colors"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </div>

          {/* UserMenu */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;