import React from "react";
import FoodCard from "../components/FoodCard";
import CategoryFilter from "../components/CategoryFilter";
import SliderBanner from "../components/SliderBanner";
import DefaultLayout from "../layouts/DefaultLayout";
import CommentSidebar from "../components/CommentSidebar";
import FavoriteDishes from "../components/FavoriteDishes";
import "../styles/Home.css";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  image?: string;
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
  {
    id: 3,
    name: "Mì Ý Sốt Bò Bằm",
    price: 10.99,
    description: "Mì Ý với sốt bò bằm thơm ngon đậm đà",
    rating: 4.3,
    image: "/images/miy_sotbobam.jpg",
  },
  {
    id: 4,
    name: "Salad Cá Ngừ",
    price: 7.99,
    description: "Salad tươi với cá ngừ và rau củ theo mùa",
    rating: 4.0,
    image: "/images/salad_cangu.jpg",
  },
];

const Home: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header section with better mobile spacing */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Tìm kiếm món ăn ngon nhất
          </h2>
          <a 
            href="#" 
            className="text-blue-600 text-xs sm:text-sm hover:underline font-medium"
            aria-label="Xem tất cả món ăn"
          >
            Xem tất cả
          </a>
        </div>

        {/* Category filter with horizontal scroll on mobile */}
        <div className="mb-4 overflow-x-auto pb-2">
          <div className="w-max">
            <CategoryFilter />
          </div>
        </div>

        {/* Banner slider with better aspect ratio */}
        <div className="mb-4 sm:mb-6 rounded-xl overflow-hidden">
          <SliderBanner />
        </div>

        {/* Mobile view - Favorite dishes at top */}
        <div className="lg:hidden mb-6">
          <FavoriteDishes />
        </div>

        {/* Main content with improved layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Comment sidebar - hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <CommentSidebar />
          </div>

          {/* Food cards grid with better responsive behavior */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <FoodCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
            
            {/* View more button for mobile */}
            <div className="mt-6 text-center sm:hidden">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Xem thêm món ăn
              </button>
            </div>
          </div>

          {/* Favorite dishes for desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <FavoriteDishes />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;