import React from "react";
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
    <div className="food-card">
      <img src={product.image || "/assets/food/default.jpg"} alt={product.name} className="food-image" />
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
      {product.description && <p>{product.description}</p>}
      {product.rating && <p>Đánh giá: {product.rating}</p>}
    </div>
  );
};

export default FoodCard;
