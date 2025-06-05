import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import CategoryList from '../../components/CategoryList';
import MenuListHome from '../../components/MenuListHome';
import PosterList from '../../components/Posterlist';

const HomePage = () => {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
        {/* Main Content - Takes 75% on desktop, full width on mobile */}
        <div className="w-full lg:w-3/4 space-y-8 z-10">
          {/* Hero Section - PosterList */}
          <section className="rounded-lg overflow-hidden shadow-md">
            <PosterList />
          </section>

          {/* Category Section */}
          <section>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <CategoryList />
            </div>
          </section>

          {/* Menu Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Món Ăn Nổi Bật</h2>
              <Link 
                to="/menu" 
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
              >
                Xem tất cả
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <MenuListHome />
          </section>

          {/* Feature Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card Menu */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="p-4">
                <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Xem Menu</h3>
                <p className="text-gray-600 text-sm mb-3">Khám phá menu đa dạng với nhiều món ăn ngon.</p>
                <Link
                  to="/menu"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Khám phá ngay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card Đặt Món */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="p-4">
                <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Đặt Món</h3>
                <p className="text-gray-600 text-sm mb-3">Đặt món ăn yêu thích nhanh chóng và dễ dàng.</p>
                <Link
                  to="/order"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Đặt món ngay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card Theo Dõi Đơn Hàng */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="p-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Theo Dõi Đơn Hàng</h3>
                <p className="text-gray-600 text-sm mb-3">Kiểm tra trạng thái đơn hàng của bạn.</p>
                <Link
                  to="/track-order"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Theo dõi ngay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-teal-600 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-semibold mb-4">Liên Hệ Với Chúng Tôi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Địa Chỉ
                  </h3>
                  <p className="text-teal-100 text-sm">123 Đường ABC, Quận XYZ, TP. HCM</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Liên Hệ
                  </h3>
                  <p className="text-teal-100 text-sm">Email: contact@example.com</p>
                  <p className="text-teal-100 text-sm">Điện thoại: (012) 345-6789</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Takes 25% on desktop, hidden on mobile unless toggled */}
        <div className="hidden lg:block w-1/4 space-y-4">
          {/* Promotion Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-orange-500 text-white p-3 text-center text-sm font-semibold">
              Ưu Đãi Đặc Biệt
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Giảm 20% cho đơn đầu tiên</h3>
              <p className="text-sm text-gray-600 mb-3">Nhập mã WELCOME20 khi thanh toán</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded text-sm font-medium transition-colors">
                Áp dụng ngay
              </button>
            </div>
          </div>

          {/* Popular Items */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Món Phổ Biến</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/100x100/?food-${item}`} 
                      alt="Popular food" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Tên món ăn {item}</h4>
                    <p className="text-xs text-gray-500">120.000 VNĐ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Nhận Ưu Đãi</h3>
            <p className="text-sm text-gray-600 mb-3">Đăng ký để nhận thông báo ưu đãi mới nhất</p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded text-sm font-medium transition-colors"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;