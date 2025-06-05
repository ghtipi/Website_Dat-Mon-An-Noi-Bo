import React from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
}

interface CartItemsProps {
  cartItems: CartItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({ cartItems, onQuantityChange, onRemoveItem }) => {
  if (cartItems.length === 0) {
    return <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống.</p>;
  }

  return (
    <div className="space-y-4 mb-8">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center border-b pb-4">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded mr-4"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600">{item.price.toLocaleString()} đ / cái</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                onQuantityChange(item.id, val);
              }}
              className="w-12 text-center border rounded"
            />
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              +
            </button>
          </div>
          <div className="ml-6 w-32 text-right font-semibold">
            {(item.price * item.quantity).toLocaleString()} đ
          </div>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="ml-4 text-red-500 hover:text-red-700"
            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
