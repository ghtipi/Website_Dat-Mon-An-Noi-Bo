import React from "react";

export interface VoucherCardProps {
  imageUrl: string;
  title: string;
  description: string;
  value: string;
  expiryDate?: string;
  minOrder?: number;
  category?: string;
  isSaved?: boolean;
  onSave: () => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  imageUrl,
  title,
  description,
  value,
  expiryDate,
  minOrder,
  category,
  isSaved = false,
  onSave,
}) => {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition bg-white">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-32 object-contain mb-4"
      />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-red-500 font-bold mt-2">{value}</p>

      {expiryDate && (
        <p className="text-xs text-gray-500">HSD: {expiryDate}</p>
      )}

      {minOrder !== undefined && (
        <p className="text-xs text-gray-500">
          Đơn tối thiểu: {minOrder.toLocaleString()}đ
        </p>
      )}

      {category && <p className="text-xs text-gray-500">Danh mục: {category}</p>}

      <button
        onClick={onSave}
        style={{
          backgroundColor: isSaved ? "#D1D5DB" : "#EF4444",
        }}
        className={`mt-3 px-4 py-1 rounded-full text-sm font-medium
          ${
            isSaved
              ? "text-gray-700 border border-gray-400 cursor-pointer"
              : "text-white border border-red-600 hover:bg-red-600 cursor-pointer"
          }
          transition-colors duration-200
        `}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Đã lưu voucher" : "Lưu voucher"}
      >
        {isSaved ? "Đã lưu" : "Lưu"}
      </button>
    </div>
  );
};

export default VoucherCard;
