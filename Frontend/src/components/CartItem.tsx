import React from "react";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  image: string;
  name: string;
  description: string;
  price: number;
}

const CartItem: React.FC<CartItemProps> = ({ image, name, description, price }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
      <div className="flex items-center gap-4">
        <img src={image} alt={name} className="w-16 h-16 object-cover rounded-md" />
        <div>
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button className="px-2 text-lg">+</button>
          <span className="px-3">1</span>
          <button className="px-2 text-lg">−</button>
        </div>
        <div className="text-lg font-medium">${price.toFixed(2)}</div>
        <button>
          <Trash2 className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
