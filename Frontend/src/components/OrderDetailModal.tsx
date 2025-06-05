// src/components/OrderDetailModal.tsx
import React from "react";

interface Order {
  orderId: string;
  date: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  details?: {
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    address: string;
    note: string;
  };
}

interface Props {
  order: Order;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hoàn thành":
      return "bg-green-100 text-green-800";
    case "Đang xử lý":
      return "bg-blue-100 text-blue-800";
    case "Hủy":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderDetailModal: React.FC<Props> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Chi tiết đơn hàng {order.orderId}
          </h3>

          <div className="mb-4">
            <p>
              <strong>Ngày đặt:</strong> {order.date}
            </p>
            <p>
              <strong>Hình thức thanh toán:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Tình trạng:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </p>
            <p className="mt-2 font-semibold text-red-600 text-lg">
              Tổng tiền:{" "}
              {order.totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-800">Món ăn:</h4>
            <ul className="list-disc list-inside space-y-1">
              {order.details?.items.map((item, index) => (
                <li key={index}>
                  {item.name} x{item.quantity} -{" "}
                  {(item.price * item.quantity).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p>
              <strong>Địa chỉ giao hàng:</strong> {order.details?.address}
            </p>
            <p>
              <strong>Ghi chú:</strong> {order.details?.note}
            </p>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
