import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTypingEffect from '../../hooks/useTypingEffect';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { login, } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/';
    
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
      await login(email, password); 

      
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;


      

      if (user) {
        
        const role = user.role?.toLowerCase();
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (role === 'manager') {
          navigate('/manager');
        } else {
          navigate(from);
        }
      } else {
        navigate(from);
      }
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
    }
  };

  const emailPlaceholder = useTypingEffect({ text: 'Nhập email của bạn ...', active: email === '' });
  const passwordPlaceholder = useTypingEffect({ text: 'Nhập mật khẩu ... ', active: password === '' });

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/background.png')" }}
    >
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
