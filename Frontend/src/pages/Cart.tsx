import React, { useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
interface CartItemData {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(300); // 5 phút cho thanh toán
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  // Cart items data
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      name: "Phở Bò",
      description: "Phở truyền thống với thịt bò tái, bò viên",
      price: 50000,
      quantity: 1,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
      name: "Bánh Mì Thịt",
      description: "Bánh mì chảo với thịt nướng, pate và rau",
      price: 35000,
      quantity: 1,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
      name: "Gỏi Cuốn",
      description: "2 cuốn với tôm, thịt, rau sống và bún",
      price: 40000,
      quantity: 2,
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% thuế
  const total = subtotal + tax;

  // Timer effect for QR code
  useEffect(() => {
    let countdown: ReturnType<typeof setInterval>;
    if (showQR && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setShowQR(false);
      setTimer(300);
    }
    return () => clearInterval(countdown);
  }, [showQR, timer]);

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (paymentMethod === "bank") {
      if (!bankDetails.bankName.trim())
        errors.bankName = "Vui lòng chọn ngân hàng";
      if (
        !bankDetails.accountNumber.trim() ||
        !/^\d{8,16}$/.test(bankDetails.accountNumber)
      ) {
        errors.accountNumber = "Số tài khoản không hợp lệ";
      }
      if (!bankDetails.accountName.trim()) {
        errors.accountName = "Vui lòng nhập tên chủ tài khoản";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    if (paymentMethod === "momo") {
      setShowQR(true);
    } else {
      // Simulate API call for bank transfer
      setTimeout(() => {
        alert(
          `Đặt hàng thành công! Tổng số tiền: ${total.toLocaleString()}₫\nVui lòng chuyển khoản theo thông tin sau:\nNgân hàng: ${
            bankDetails.bankName
          }\nSố tài khoản: ${bankDetails.accountNumber}\nChủ tài khoản: ${
            bankDetails.accountName
          }\nSố tiền: ${total.toLocaleString()}₫`
        );
        setIsProcessing(false);
      }, 1500);
    }
  };

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Danh sách món ăn */}
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Giỏ Hàng Của Bạn</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống</p>
            <Link
              to="/"
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 inline-block text-center"
            >
              Tiếp tục đặt món
            </Link>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                description={item.description}
                price={item.price}
                quantity={item.quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <Link
                to="/"
                className="text-orange-500 hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Tiếp tục đặt món
              </Link>
              <button
                className="text-red-500 hover:underline flex items-center"
                onClick={() => setCartItems([])}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Xóa tất cả
              </button>
            </div>
          </>
        )}
      </div>

      {/* Thanh toán */}
      {cartItems.length > 0 && (
        <div className="w-full lg:w-[400px] bg-white p-6 rounded-2xl space-y-4 relative border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Thanh Toán</h2>

          {/* Phương thức thanh toán */}
          <div className="space-y-3">
            <h3 className="font-medium">Phương thức thanh toán</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border border-gray-200">
                <input
                  type="radio"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="h-5 w-5 text-orange-500"
                />
                <div className="flex-1">
                  <p className="font-medium">Chuyển khoản ngân hàng</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán qua tài khoản ngân hàng
                  </p>
                </div>
                <img src="/bank-icon.png" alt="Ngân hàng" className="h-8" />
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border border-gray-200">
                <input
                  type="radio"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                  className="h-5 w-5 text-orange-500"
                />
                <div className="flex-1">
                  <p className="font-medium">Ví điện tử Momo</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán qua ứng dụng Momo
                  </p>
                </div>
                <img src="/momo-icon.png" alt="Momo" className="h-8" />
              </label>
            </div>
          </div>

          {/* Thông tin ngân hàng */}
          {paymentMethod === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngân hàng
                </label>
                <select
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={(e) => handleInputChange(e as any)}
                  className={`w-full p-3 rounded-lg border ${
                    formErrors.bankName ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="VietinBank">VietinBank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Agribank">Agribank</option>
                  <option value="Techcombank">Techcombank</option>
                </select>
                {formErrors.bankName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.bankName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className={`w-full p-3 rounded-lg border ${
                    formErrors.accountNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên chủ tài khoản
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={bankDetails.accountName}
                  onChange={handleInputChange}
                  placeholder="NGUYEN VAN A"
                  className={`w-full p-3 rounded-lg border ${
                    formErrors.accountName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.accountName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.accountName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Thông tin đơn hàng */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <h3 className="font-medium">Thông tin đơn hàng</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Tạm tính ({cartItems.length} món)
              </span>
              <span>{subtotal.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thuế (8%)</span>
              <span>{tax.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Tổng cộng</span>
              <span className="text-orange-500">{total.toLocaleString()}₫</span>
            </div>
          </div>

          {/* Nút thanh toán */}
          <button
            className={`w-full py-3 rounded-lg font-semibold mt-4 ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Đặt Món Ngay"}
          </button>

          {/* Thông tin bảo mật */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Thông tin thanh toán được bảo mật</span>
          </div>

          {/* Popup QR Momo */}
          {showQR && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg space-y-4 w-full max-w-sm text-center relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowQR(false);
                    setTimer(300);
                    setIsProcessing(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <img src="/momo-icon.png" alt="Momo" className="h-8" />
                  <h2 className="text-xl font-semibold">Thanh toán với Momo</h2>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                  <img
                    src="/momo-qr-sample.png"
                    alt="Momo QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <p>
                    Số tiền:{" "}
                    <strong className="text-orange-500">
                      {total.toLocaleString()}₫
                    </strong>
                  </p>
                  <p className="text-sm">
                    Nội dung:{" "}
                    <span className="font-medium">
                      FOODAPP {new Date().getTime().toString().slice(-6)}
                    </span>
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center justify-center gap-2 text-yellow-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">
                        Thời gian còn lại: {formatTime(timer)}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      Vui lòng thanh toán trong thời gian trên
                    </p>
                  </div>
                </div>

                <button
                  className="mt-4 text-orange-500 hover:underline text-sm flex items-center justify-center gap-1 mx-auto"
                  onClick={() => {
                    setShowQR(false);
                    setTimer(300);
                    setIsProcessing(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Chọn phương thức khác
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
