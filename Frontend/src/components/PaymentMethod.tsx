import React from "react";
import QRCode from "react-qr-code";

export interface Bank {
  code: string;
  name: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface PaymentMethodProps {
  paymentMethod: string;
  bankDetails: BankDetails;
  banks: Bank[];
  formErrors: Partial<Record<keyof BankDetails, string>>;
  onPaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBankSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showQR: boolean;
  qrData: string;
  timer: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  bankDetails,
  banks,
  formErrors,
  onPaymentMethodChange,
  onBankSelect,
  onInputChange,
  showQR,
  qrData,
  timer,
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chọn phương thức thanh toán</h2>
      <div className="flex space-x-6 mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={onPaymentMethodChange}
          />
          <span>Tiền mặt</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="bank"
            checked={paymentMethod === "bank"}
            onChange={onPaymentMethodChange}
          />
          <span>Chuyển khoản ngân hàng</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="momo"
            checked={paymentMethod === "momo"}
            onChange={onPaymentMethodChange}
          />
          <span>Ví Momo</span>
        </label>
      </div>

      {/* Bank transfer form */}
      {paymentMethod === "bank" && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-4">Thông tin chuyển khoản ngân hàng</h3>
          <div className="mb-4">
            <label htmlFor="bankName" className="block mb-1 font-medium">
              Ngân hàng
            </label>
            <select
              id="bankName"
              name="bankName"
              value={bankDetails.bankName}
              onChange={onBankSelect}
              className={`w-full border p-2 rounded ${
                formErrors.bankName ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Chọn ngân hàng --</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
            {formErrors.bankName && (
              <p className="text-red-500 mt-1">{formErrors.bankName}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="accountNumber" className="block mb-1 font-medium">
              Số tài khoản
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              value={bankDetails.accountNumber}
              onChange={onInputChange}
              className={`w-full border p-2 rounded ${
                formErrors.accountNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập số tài khoản"
            />
            {formErrors.accountNumber && (
              <p className="text-red-500 mt-1">{formErrors.accountNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="accountName" className="block mb-1 font-medium">
              Tên chủ tài khoản
            </label>
            <input
              id="accountName"
              name="accountName"
              type="text"
              value={bankDetails.accountName}
              onChange={onInputChange}
              className={`w-full border p-2 rounded ${
                formErrors.accountName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên chủ tài khoản"
            />
            {formErrors.accountName && (
              <p className="text-red-500 mt-1">{formErrors.accountName}</p>
            )}
          </div>
        </div>
      )}

      {/* QR Code for Momo payment */}
      {paymentMethod === "momo" && showQR && (
        <div className="mb-6 text-center">
          <h3 className="font-semibold mb-4">Quét mã QR để thanh toán</h3>
          <div className="inline-block p-4 bg-white shadow rounded-lg">
            <QRCode value={qrData} size={180} />
            <p className="mt-2 text-gray-700">
              Mã QR sẽ hết hạn sau: {formatTime(timer)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
