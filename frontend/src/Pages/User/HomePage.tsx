import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import CategoryList from '../../components/CategoryList';



const HomePage = () => {

  return (
    <Layout>
      <div className="flex gap-4 p-12">

        {/* CategoryList chiếm khoảng 80% chiều rộng */}
        <div className="flex-shrink-0 w-4/5">
          
          <div className='mt-12'>
            <CategoryList />
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Card Menu */}
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

            {/* Card Đặt Món */}
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

            {/* Card Theo Dõi Đơn Hàng */}
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

          {/* Thông tin liên hệ */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Liên Hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Địa Chỉ</h3>
                <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP. HCM</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Liên Hệ</h3>
                <p className="text-gray-600">Email: contact@example.com</p>
                <p className="text-gray-600">Phone: (012) 345-6789</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar chiếm khoảng 20% chiều rộng (bạn có thể thêm component tại đây) */}
        <div className="flex-grow w-1/5">
          {/* Ví dụ component Sidebar hoặc quảng cáo */}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
