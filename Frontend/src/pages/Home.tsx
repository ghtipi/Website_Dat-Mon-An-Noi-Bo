import React from "react";
import FoodCard from "../components/FoodCard";
import CategoryFilter from "../components/CategoryFilter";
import SliderBanner from "../components/SliderBanner";
import DefaultLayout from "../layouts/DefaultLayout";
import CommentSidebar from "../components/CommentSidebar";
import FavoriteDishes from "../components/FavoriteDishes";
import "../styles/Home.css";

// Định nghĩa kiểu Product
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  image?: string; // nếu có hình ảnh
};

const products: Product[] = [
  {
    id: 1,
    name: "Pizza Hải Sản",
    price: 12.99,
    description: "Pizza với tôm, mực và nghêu tươi ngon",
    rating: 4.5,
    image: "/images/pizza_haisan.jpg",
  },
  {
    id: 2,
    name: "Burger Bò Phô Mai",
    price: 8.99,
    description: "Burger bò kèm phô mai tan chảy thơm ngon",
    rating: 4.2,
    image: "/images/burger_bophomai.jpg",
  },
  // ... các món khác tương tự
];


const Home: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Tiêu đề + link xem tất cả */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tìm kiếm món ăn ngon nhất</h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            View all
          </a>
        </div>

        {/* Bộ lọc danh mục */}
        <CategoryFilter />

        {/* Banner slider */}
        <SliderBanner />

        {/* Nội dung chính */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Sidebar bình luận - trên mobile chiếm full chiều rộng */}
          <div className="w-full lg:w-1/4">
            <CommentSidebar />
          </div>

          {/* Danh sách món ăn - full width trên mobile, 3 cột trên desktop */}
          <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <FoodCard key={product.id} product={product} />
            ))}
          </div>

          {/* FavoriteDishes - có thể ẩn trên mobile hoặc chuyển vị trí */}
          {/* Ví dụ ẩn trên mobile, hiện trên desktop */}
          <div className="hidden lg:block lg:w-full">
            <FavoriteDishes />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};


export default Home;
