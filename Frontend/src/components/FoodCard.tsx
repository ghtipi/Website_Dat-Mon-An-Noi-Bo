import React from "react";
import noImage from "../assets/noimage.png"; // ảnh fallback

interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  description?: string;
  rating?: number;
}

interface FoodCardProps {
  product: Product;
}

const FoodCard: React.FC<FoodCardProps> = ({ product }) => {
  return (
    <div className="food-card flex flex-col items-center bg-white shadow-md rounded-xl p-2 w-full max-w-[180px] sm:max-w-[200px] transition hover:shadow-lg">
      <img
        src={product.image || noImage}
        alt={product.name}
        className="rounded-md object-cover w-16 h-16 sm:w-20 sm:h-20 mb-2"
      />

      <h3 className="text-sm font-medium text-center text-gray-800 line-clamp-1">
        {product.name}
      </h3>

      <p className="text-red-600 font-semibold text-sm text-center mb-2">
        {product.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </p>

      <div className="flex justify-between items-center w-full px-2 mt-auto">
        <button
          className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-base font-bold hover:bg-green-600 transition"
          title="Thêm món"
        >
          +
        </button>

        <button
          className="text-gray-400 hover:text-red-500 transition text-lg"
          title="Yêu thích"
          aria-label="Yêu thích món ăn"
        >
          <i className="bi bi-heart"></i>
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
