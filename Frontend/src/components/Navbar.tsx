import React from "react";

const Navbar: React.FC = () => (
  <nav>
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Căn tin nội bộ Tipi</h1>
        <p className="text-sm text-gray-500">09/06/2025</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center border rounded px-3 py-1 bg-gray-100">
          <i className="bi bi-search text-gray-500"></i>
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none text-sm"
          />
          <i className="bi bi-funnel text-gray-500 ml-3"></i>
        </div>
        <i className="bi bi-bell-fill text-gray-500 text-4xl"></i>
        <i className="bi bi-person-circle text-gray-500 text-4xl"></i>
      </div>
    </div>
  </nav>
);

export default Navbar;
