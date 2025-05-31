import React from "react";
import ProductCard from "../components/ProductCard";
import SliderBanner from "../components/SliderBanner";
import CategoryFilter from "../components/CategoryFilter";
import DefaultLayout from "../layouts/DefaultLayout";
import "../styles/Home.css";

// Định nghĩa kiểu Product
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  image?: string; // nếu có dùng image
};

const products: Product[] = [
  {
    id: 1,
    name: "Pizza Hải Sản",
    price: 12.99,
    description: "Pizza với tôm, mực và nghêu tươi ngon",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Burger Bò Phô Mai",
    price: 8.99,
    description: "Burger bò kèm phô mai tan chảy thơm ngon",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Mì Ramen",
    price: 10.5,
    description: "Mì Ramen truyền thống Nhật Bản",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Sushi Tổng Hợp",
    price: 15.99,
    description: "Đĩa sushi đa dạng với cá hồi, cá ngừ",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Gà Rán",
    price: 7.99,
    description: "Gà rán giòn với gia vị đặc biệt",
    rating: 4.3,
  },
  {
    id: 6,
    name: "Bánh Tiramisu",
    price: 5.5,
    description: "Bánh tráng miệng Ý thơm ngon",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Lẩu Hải Sản",
    price: 18.99,
    description: "Lẩu hải sản tươi ngon cho 2-3 người",
    rating: 4.9,
  },
  {
    id: 8,
    name: "Mì Xào Giòn",
    price: 9.25,
    description: "Mì xào giòn với thịt bò và rau củ",
    rating: 4.4,
  },
];

const Categories: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tìm kiếm món ăn ngon nhất</h2>
          <a href="#" className="text-blue-500 text-sm">
            View all
          </a>
        </div>

        <CategoryFilter />

        <SliderBanner />

        <div className="flex flex-wrap gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Categories;
