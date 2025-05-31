import React, { useState } from 'react';
import type { FormEvent } from 'react';  // <-- sửa chỗ này
import background from '../assets/backgroundv2.png';

const Login: React.FC = () => {
  // State để quản lý input (nếu muốn dùng controlled inputs)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    console.log({ email, password, remember });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome back</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Ghi nhớ đăng nhập</label>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className="w-full h-64 bg-gray-200 rounded-lg shadow-inner bg-center bg-cover"
              style={{ backgroundImage: `url(${background})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
