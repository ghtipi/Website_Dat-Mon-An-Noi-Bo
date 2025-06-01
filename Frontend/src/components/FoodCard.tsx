import React from "react";
import noImage from "../assets/noimage.png";  // import ảnh mặc định
import "../styles/FoodCard.css";

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
    <div className="food-card rounded-lg shadow-md p-1 flex flex-col bg-white max-w-[200px] max-h-[200px] items-center">
      <img
        src={product.image || noImage}  // dùng ảnh import làm fallback
        alt={product.name}
        className="food-image rounded-[10px] object-cover w-12 h-12"
      />
      <h3 className="text-xs font-semibold text-center truncate">{product.name}</h3>
      <p className="text-red-600 font-semibold text-xs text-center truncate">
        {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
      </p>

      <div className="flex justify-between w-full px-1">
        <button
          className="bg-green-500 text-white rounded-full w-5 h-5 flex justify-center text-sm font-bold hover:bg-green-600 transition"
          title="Thêm món"
        >
          +
        </button>

        <button
          className="text-gray-400 hover:text-red-500 transition text-sm"
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
