import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import CategoryList from '../components/CategoryList';
import MenuListHome from '../components/MenuListHome';
import PosterList from '../components/Posterlist';

const HomePage = () => {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
        {/* Main Content - Takes 75% on desktop, full width on mobile */}
        <div className="w-full lg:w-3/4 space-y-8 z-10">
          {/* Hero Section - PosterList with improved styling */}
          <section className="rounded-xl overflow-hidden shadow-lg relative">
            <PosterList />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Khám phá ẩm thực tuyệt vời</h1>
              <p className="text-white/90 mt-2 max-w-lg">Hương vị đặc biệt - Chất lượng hàng đầu - Phục vụ tận tâm</p>
            </div>
          </section>

          {/* Category Section with enhanced design */}
          <section>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Danh Mục Món Ăn</h2>
                <Link 
                  to="/categories" 
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center transition-colors"
                >
                  Xem tất cả
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4">
                <CategoryList />
              </div>
            </div>
          </section>

          {/* Menu Section with more prominent design */}
          <section>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-4 text-white">
                <h2 className="text-2xl font-bold text-center">Món Ăn Nổi Bật</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Những món ăn được yêu thích nhất</p>
                  <Link 
                    to="/menu" 
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center transition-colors"
                  >
                    Xem tất cả
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <MenuListHome />
              </div>
            </div>
          </section>

          {/* Feature Cards with improved styling */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card Menu */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
              <div className="p-6">
                <div className="bg-gradient-to-br from-teal-100 to-teal-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Xem Menu</h3>
                <p className="text-gray-600 text-sm mb-4">Khám phá menu đa dạng với nhiều món ăn ngon.</p>
                <Link
                  to="/menu"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium group"
                >
                  Khám phá ngay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card Đặt Món */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
              <div className="p-6">
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Đặt Món</h3>
                <p className="text-gray-600 text-sm mb-4">Đặt món ăn yêu thích nhanh chóng và dễ dàng.</p>
                <Link
                  to="/order"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium group"
                >
                  Đặt món ngay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card Theo Dõi Đơn Hàng */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Theo Dõi Đơn Hàng</h3>
                <p className="text-gray-600 text-sm mb-4">Kiểm tra trạng thái đơn hàng của bạn.</p>
                <Link
                  to="/cart"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium group"
                >
                  Theo dõi ngay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Contact Section with gradient background */}
<section className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg overflow-hidden">
  <div className="p-8 text-white">
    <h2 className="text-3xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Địa chỉ */}
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Địa Chỉ
        </h3>
        <p className="text-white/90">123 Đường ABC, Quận XYZ, TP. HCM</p>
      </div>

      {/* Thông tin liên hệ */}
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Liên Hệ
        </h3>
        <p className="text-white/90 mb-2">Email: contact@example.com</p>
        <p className="text-white/90 mb-4">Điện thoại: (012) 345-6789</p>

        <h4 className="text-lg font-medium mt-6 mb-3">Giờ mở cửa</h4>
        <div className="space-y-2">
          <p className="text-white/90 text-sm">Thứ 2 - Thứ 6: 8:00 - 22:00</p>
          <p className="text-white/90 text-sm">Thứ 7 - CN: 9:00 - 23:00</p>
        </div>
      </div>
    </div>
  </div>
</section>
        </div>

        {/* Sidebar - Takes 25% on desktop, hidden on mobile unless toggled */}
        <div className="hidden lg:block w-1/4 space-y-6">
          {/* Promotion Card with better styling */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 text-center font-bold text-lg">
              Ưu Đãi Đặc Biệt
            </div>
            <div className="p-5 text-center">
              <div className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-3">
                Mới
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Giảm 20% cho đơn đầu tiên</h3>
              <p className="text-sm text-gray-600 mb-4">Nhập mã <span className="font-mono bg-gray-100 px-2 py-1 rounded">WELCOME20</span> khi thanh toán</p>
              <div className="flex items-center justify-center mb-4">
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-sm font-bold transition-colors shadow-md hover:shadow-lg">
                Áp dụng ngay
              </button>
              <p className="text-xs text-gray-500 mt-3">Áp dụng đến 31/12/2025</p>
            </div>
          </div>

          {/* Popular Items with enhanced design */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Món Phổ Biến</h3>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Hot</span>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="relative w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={`https://source.unsplash.com/random/200x200/?food-${item}`} 
                      alt="Popular food" 
                      className="w-full h-full object-cover"
                    />
                    {item === 1 && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 rounded-br-lg">Bán chạy</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">Tên món ăn {item}</h4>
                    <p className="text-xs text-gray-500 mb-1">Phân loại {item}</p>
                    <p className="text-sm font-bold text-orange-600">120.000 VNĐ</p>
                  </div>
                  <button className="text-teal-600 hover:text-teal-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter with improved design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white text-center">
              <h3 className="text-lg font-bold">Nhận Ưu Đãi</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4 text-center">Đăng ký để nhận thông báo ưu đãi mới nhất</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button 
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-3 rounded-lg text-sm font-bold transition-colors shadow-md hover:shadow-lg"
                >
                  Đăng ký ngay
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Chúng tôi cam kết không spam email của bạn</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;