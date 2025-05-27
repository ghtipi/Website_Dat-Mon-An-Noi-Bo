import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTypingEffect from '../hooks/useTypingEffect';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const isLoggedIn = user && user.name && token;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitials = (name: string) => {
  if (!name) return 'U';
  const words = name.trim().split(' ').filter(Boolean);

  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0][0].toUpperCase();

  const secondLast = words[words.length - 2][0].toUpperCase();
  const last = words[words.length - 1][0].toUpperCase();

  return secondLast + last;
};

  const getDisplayName = () => {
  return user.name || 'User';
};

  const sreachPlaceholder = useTypingEffect({
    text: 'Tìm kiếm món ăn...',
    active: searchQuery === '',
  });

  return (
    <header className="shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="block" style={{ marginLeft: '240px' }}>
            <img
              src="/src/assets/images/tenlogo.jpg"
              alt="Tipi Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder={sreachPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-gray-400 shadow-lg rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* User Menu hoặc Đăng nhập */}
          <div className="relative">
            {isLoggedIn ? (
              <>
               <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-teal-600"
              >
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-semibold">
                    {getInitials(user.name)}
                  </span>
                </div>

                <div className="hidden md:block text-left leading-tight">
                  <div className="font-medium text-gray-800">
                    {getDisplayName()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.role}
                  </div>
                </div>
              </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Trang cá nhân
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
