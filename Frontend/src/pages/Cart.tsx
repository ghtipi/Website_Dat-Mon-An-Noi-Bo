import React, { useEffect, useState } from "react";
import CartItems, { type CartItem } from "../components/CartItem";
import PaymentMethod, { type Bank, type BankDetails } from "../components/PaymentMethod";

const banks: Bank[] = [
  { code: "VCB", name: "Vietcombank" },
  { code: "BIDV", name: "BIDV" },
  { code: "ACB", name: "ACB" },
  { code: "VCB2", name: "VietinBank" },
];

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load from localStorage hoặc mặc định
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BankDetails, string>>>({});
  const [showQR, setShowQR] = useState(false);
  const [qrData] = useState("https://example.com/pay/momo");
  const [timer, setTimer] = useState(180);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderId?: string; message?: string } | null>(null);

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Đếm ngược thời gian QR
  useEffect(() => {
    if (!showQR) return;
    if (timer <= 0) {
      setShowQR(false);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showQR, timer]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
      )
    );
  };

  // Xóa sản phẩm
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
    setFormErrors({});
    setShowQR(false);
  };

  // Chọn ngân hàng
  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBankDetails((prev) => ({ ...prev, bankName: e.target.value }));
  };

  // Thay đổi input chuyển khoản
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form chuyển khoản
  const validateForm = (): boolean => {
    if (paymentMethod !== "bank") return true;
    const errors: Partial<Record<keyof BankDetails, string>> = {};
    if (!bankDetails.bankName) errors.bankName = "Vui lòng chọn ngân hàng";
    if (!bankDetails.accountNumber) errors.accountNumber = "Vui lòng nhập số tài khoản";
    if (!bankDetails.accountName) errors.accountName = "Vui lòng nhập tên chủ tài khoản";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Tính tổng tiền
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  // Reset giỏ hàng
  const resetCart = () => {
    setCartItems([]);
    setPaymentMethod("cash");
    setBankDetails({ bankName: "", accountNumber: "", accountName: "" });
    setFormErrors({});
    setShowQR(false);
    setTimer(180);
    setOrderResult(null);
  };

  // Xử lý đặt hàng giả lập
  const processOrder = async () => {
    setIsProcessing(true);
    setOrderResult(null);

    // Giả lập gọi API delay 2s
    await new Promise((r) => setTimeout(r, 2000));

    // Giả lập kết quả thành công với mã đơn ngẫu nhiên
    const success = true;
    if (success) {
      setOrderResult({ success: true, orderId: "DH" + Math.floor(Math.random() * 100000) });
      if (paymentMethod === "momo") {
        setShowQR(true);
        setTimer(180);
      } else {
        resetCart();
      }
    } else {
      setOrderResult({ success: false, message: "Đặt hàng thất bại. Vui lòng thử lại." });
    }

    setIsProcessing(false);
  };

  // Xử lý nút đặt hàng
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!validateForm()) return;

    processOrder();
  };

  if (orderResult?.success) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Đặt hàng thành công!</h2>
        <p className="mb-6">Mã đơn hàng của bạn: <span className="font-mono text-lg">{orderResult.orderId}</span></p>
        <button onClick={resetCart} className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Tiếp tục mua hàng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Giỏ hàng của bạn</h1>

      <CartItems
        cartItems={cartItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={removeItem}
      />

      <PaymentMethod
        paymentMethod={paymentMethod}
        bankDetails={bankDetails}
        banks={banks}
        formErrors={formErrors}
        onPaymentMethodChange={handlePaymentMethodChange}
        onBankSelect={handleBankSelect}
        onInputChange={handleInputChange}
        showQR={showQR}
        qrData={qrData}
        timer={timer}
      />

      <div className="border-t pt-4 mb-6 space-y-2 text-right font-semibold text-gray-700">
        <div>Tạm tính: {subtotal.toLocaleString()} đ</div>
        <div>Thuế VAT (8%): {tax.toLocaleString()} đ</div>
        <div className="text-lg text-blue-700">Tổng cộng: {total.toLocaleString()} đ</div>
      </div>

      <div className="text-center">
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || isProcessing}
          className={`px-8 py-3 rounded text-white font-semibold transition ${
            cartItems.length === 0 || isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
