import React from "react";
import noImage from "../assets/noimage.png";
import "../styles/ProductCard.css"; // Import CSS riêng

// Định nghĩa kiểu dữ liệu cho product
type Product = {
  name: string;
  price: number;
  description: string;
  rating: number;
  image?: string;
};

// Định nghĩa props
type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="product-card-container">
    <div className="product-card">
      <img
        src={product.image || noImage}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = noImage;
        }}
      />
      <div className="product-info">
        <div className="product-header">
          <h5 className="product-name">{product.name}</h5>
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          <i className="fas fa-star"></i>
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <button className="product-add-btn">Thêm</button>
      </div>
    </div>
  </div>
);

export default ProductCard;
