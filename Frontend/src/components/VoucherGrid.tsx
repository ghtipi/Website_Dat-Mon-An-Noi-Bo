import React from "react";
import VoucherCard from "./VoucherCard";

export interface VoucherData {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  value: string;
  expiryDate?: string;
  minOrder?: number;
  category?: string;
  isSaved?: boolean;
}

interface VoucherGridProps {
  vouchers: VoucherData[];
  onSave: (id: number) => void;
  className?: string;  // thêm prop className tùy chọn
}

const VoucherGrid: React.FC<VoucherGridProps> = ({
  vouchers,
  onSave,
  className = "grid grid-cols-1 md:grid-cols-3 gap-6", // giá trị mặc định nếu không truyền className
}) => (
  <div className={className}>
    {vouchers.map((voucher) => (
      <VoucherCard
        key={voucher.id}
        imageUrl={voucher.imageUrl}
        title={voucher.title}
        description={voucher.description}
        value={voucher.value}
        expiryDate={voucher.expiryDate}
        minOrder={voucher.minOrder}
        category={voucher.category}
        isSaved={voucher.isSaved}
        onSave={() => onSave(voucher.id)}
      />
    ))}
  </div>
);

export default VoucherGrid;
