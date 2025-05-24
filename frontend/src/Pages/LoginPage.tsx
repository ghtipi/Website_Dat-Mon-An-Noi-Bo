import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTypingEffect from '../hooks/useTypingEffect';
import apiCall from '../Api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn trước đó từ state
  const from = (location.state as any)?.from?.pathname || '/';

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from);
      }
    }
  }, [navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Sending login request with:', { email, password });
      const data = await apiCall('post', '/auth/login', { email, password });
      console.log('Login response:', data);
      
      // Kiểm tra response có chứa thông tin user không
      if (!data.user) {
        throw new Error('Không nhận được thông tin người dùng');
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role || 'user', // Mặc định là user nếu không có role
      };
      
      console.log('User data:', userData); // Log để kiểm tra role
      
      // Lưu thông tin user
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Lưu token nếu có
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Chuyển hướng dựa trên role
      const role = userData.role.toLowerCase();
      if (role === 'admin') {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin/dashboard');
      } else if (role === 'manager') {
        console.log('Redirecting to manager dashboard...');
        navigate('/manager/dashboard');
      } else {
        console.log('Redirecting to user page...');
        navigate(from);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.error || 'Email hoặc mật khẩu không đúng');
    }
  };

  const emailPlaceholder = useTypingEffect({ text: 'Nhập email của bạn ...', active: email === '' });
  const passwordPlaceholder = useTypingEffect({ text: 'Nhập mật khẩu ... ', active: password === '' });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/images/background.png')" }}>
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-4xl flex flex-col lg:flex-row overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-black/20 backdrop-blur-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white bg-teal-600 hover:bg-teal-700 font-semibold rounded-lg px-4 py-2 shadow-lg transition duration-300 transform hover:scale-105 mb-4 max-w-[120px]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back!</h2>

          {error && (
            <div className="bg-red-100/80 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-b mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 shadow-xl"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-b mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={passwordPlaceholder}
                className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 shadow-xl"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-white">Ghi nhớ đăng nhập</label>
              </div>
              <a href="#" className="text-teal-400 hover:text-teal-300 font-medium transition duration-200">
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              className="w-full p-3 rounded-lg text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50 transition duration-500 ease-in-out transform hover:scale-105 active:scale-95 shadow-xl"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-center text-sm text-white mt-6">
            Liên hệ với quản trị viên để tạo tài khoản.
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-black/20 backdrop-blur-sm flex-col justify-center items-center p-10">
          <img
            src="src/assets/images/banhmi.jpg"
            alt="Banh Mi"
            className="w-full h-104 object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
