import React from 'react';
import { Link } from 'react-router-dom';
import MenuList from '../../components/MenuList';
import Layout from '../../components/Layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-indigo-900 text-white">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Hero background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative container mx-auto px-4 py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Khám Phá Hương Vị Ẩm Thực
              </h1>
              <p className="text-xl mb-8">
                Thưởng thức những món ăn ngon nhất được chế biến bởi các đầu bếp chuyên nghiệp
              </p>
              <div className="flex gap-4">
                <a
                  href="#menu"
                  className="inline-block bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Xem Menu
                </a>
                <Link
                  to="/order"
                  className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Đặt Món Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Xem Menu</h2>
                <p className="text-gray-600 mb-4">Khám phá menu đa dạng của chúng tôi với nhiều món ăn ngon.</p>
                <Link
                  to="/menu"
                  className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Xem Menu
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Đặt Món</h2>
                <p className="text-gray-600 mb-4">Đặt món ăn yêu thích của bạn một cách nhanh chóng và dễ dàng.</p>
                <Link
                  to="/order"
                  className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Đặt Món Ngay
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Theo Dõi Đơn Hàng</h2>
                <p className="text-gray-600 mb-4">Kiểm tra trạng thái đơn hàng của bạn.</p>
                <Link
                  to="/track-order"
                  className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Theo Dõi
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Thực Đơn Của Chúng Tôi
            </h2>
            <MenuList />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Giao Hàng Nhanh Chóng</h3>
                <p className="text-gray-600">Đặt hàng và nhận món ăn trong thời gian ngắn nhất</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Chất Lượng Đảm Bảo</h3>
                <p className="text-gray-600">Nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Đa Dạng Món Ăn</h3>
                <p className="text-gray-600">Nhiều lựa chọn món ăn phù hợp với mọi khẩu vị</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Liên Hệ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Địa Chỉ</h3>
                  <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP. HCM</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Liên Hệ</h3>
                  <p className="text-gray-600">Email: contact@example.com</p>
                  <p className="text-gray-600">Phone: (012) 345-6789</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 