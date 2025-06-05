import React from "react";

interface HistoryItemProps {
  orderId: string;
  date: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress?: string;
  customerName?: string;
  phoneNumber?: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  orderId,
  date,
  paymentMethod,
  status,
  totalAmount,
  items = [],
  shippingAddress = "",
  customerName = "",
  phoneNumber = "",
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "đã hoàn thành":
        return "bg-green-100 text-green-800";
      case "đang giao":
        return "bg-blue-100 text-blue-800";
      case "đã hủy":
        return "bg-red-100 text-red-800";
      case "chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Summary View */}
      <button
        type="button"
        onClick={toggleExpand}
        className="w-full p-4 grid grid-cols-2 sm:grid-cols-5 gap-2 items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <div>
          <p className="text-gray-500 text-xs">Mã đơn</p>
          <p className="font-medium truncate max-w-[100px] sm:max-w-full break-words">{orderId}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Ngày đặt</p>
          <p>{date}</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-gray-500 text-xs">Thanh toán</p>
          <p className="truncate max-w-[120px]">{paymentMethod}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Tình trạng</p>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
            {status}
          </span>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs">Tổng tiền</p>
          <p className="text-red-600 font-semibold">
            {totalAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
      </button>

      {/* Detail View */}
      {isExpanded && (
        <div className="border-t p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Items */}
            <div>
              <h3 className="font-medium mb-3">Chi tiết đơn hàng</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start border-b pb-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded mr-3 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.productName}</p>
                      <p className="text-gray-500 text-sm">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}/sp
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h3 className="font-medium mb-3">Thông tin giao hàng</h3>
              <div className="bg-white p-4 rounded-lg shadow-xs">
                <p className="font-medium truncate">{customerName}</p>
                <p className="text-gray-600 truncate">{phoneNumber}</p>
                <p className="mt-2 text-gray-600 break-words">{shippingAddress}</p>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Thông tin thanh toán</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="truncate">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-medium text-red-600">
                      {totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={toggleExpand}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default HistoryItem;
