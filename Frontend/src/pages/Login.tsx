import React, { useState } from "react";
import type { FormEvent } from "react";
import background from "../assets/backgroundv2.png";
import login from "../assets/login.png";
import { FaArrowLeft } from "react-icons/fa"; // <-- Thêm dòng này

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div
        className="p-12 rounded-3xl shadow-xl mx-[10px] h-[800px] w-full max-w-6xl"
        style={{ backgroundColor: "rgba(83, 80, 80, 0.9)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
          {/* Form Section */}
          <div className="flex flex-col justify-center">
            {/* Nút quay về */}
            <button
              className="flex items-center gap-2 text-white text-lg font-medium hover:underline mb-6"
              onClick={() => (window.location.href = '/')}
            >
              <FaArrowLeft />
              Quay về
            </button>

            <h2 className="text-4xl font-extrabold mb-8 text-center text-white">
              Welcome back
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-lg font-semibold text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 block w-full px-6 py-3 border border-black bg-white text-gray-700 rounded-xl shadow-sm text-lg focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-lg font-semibold text-white">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-2 block w-full px-6 py-3 border border-black bg-white text-gray-700 rounded-xl shadow-sm text-lg focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-3 block text-lg text-white select-none">
                  Ghi nhớ đăng nhập
                </label>
                <label htmlFor="remember" className="ml-3 block text-lg text-white select-none">
                  Quên mật khẩu?
                </label>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-4 px-6 rounded-xl hover:bg-blue-800 transition duration-300 text-xl font-semibold"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className="w-[400px] h-[500px] bg-gray-200 rounded-lg shadow-inner bg-center bg-cover"
              style={{ backgroundImage: `url(${login})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
