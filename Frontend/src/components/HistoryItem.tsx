import React from "react";

interface HistoryItemProps {
  orderId: string;
  date: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  orderId,
  date,
  paymentMethod,
  status,
  totalAmount,
}) => (
  <div className="border rounded p-3 bg-white shadow-sm ms-2 text-sm">
    <p><strong>Mã đơn:</strong> {orderId}</p>
    <p><strong>Ngày đặt:</strong> {date}</p>
    <p><strong>Thanh toán:</strong> {paymentMethod}</p>
    <p><strong>Tình trạng:</strong> {status}</p>
    <p className="text-red-600 font-semibold">
      {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
    </p>
  </div>
);

export default HistoryItem;
