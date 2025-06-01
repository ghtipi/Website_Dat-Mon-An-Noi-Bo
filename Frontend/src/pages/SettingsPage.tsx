import React, { useState } from "react";
import SettingToggle from "../components/SettingToggle";
import DefaultLayout from "../layouts/DefaultLayout";
import "../styles/Home.css";

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("Tiếng Việt");
  const [editMode, setEditMode] = useState({
    address: false,
    password: false,
  });

  const [userData, setUserData] = useState<UserData>({
    name: "Nguyễn Văn A",
    email: "example@email.com",
    phone: "0123456789",
    address: "123 Đường ABC, Q1, TP.HCM",
    paymentMethod: "Visa •••• 1234",
  });

  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode({ ...editMode, address: false });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.new === newPassword.confirm) {
      setEditMode({ ...editMode, password: false });
      setNewPassword({ current: "", new: "", confirm: "" });
    }
  };

  return (
    <DefaultLayout>
      <div className={`container mx-auto px-4 py-6`}>
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Cài Đặt
          </h1>

          {/* Thông tin tài khoản */}
          <section className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong className="w-24 inline-block">Họ tên:</strong>
                {userData.name}
              </p>
              <p>
                <strong className="w-24 inline-block">Email:</strong>
                {userData.email}
              </p>
              <p>
                <strong className="w-24 inline-block">SĐT:</strong>
                {userData.phone}
              </p>

              {editMode.password ? (
                <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
                  <div>
                    <label className="block mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={newPassword.current}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, current: e.target.value })
                      }
                      className="w-full md:w-64 border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={newPassword.new}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, new: e.target.value })
                      }
                      className="w-full md:w-64 border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      value={newPassword.confirm}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, confirm: e.target.value })
                      }
                      className="w-full md:w-64 border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode({ ...editMode, password: false })}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setEditMode({ ...editMode, password: true })}
                  className="text-blue-600 hover:underline font-medium mt-2"
                >
                  Đổi mật khẩu
                </button>
              )}
            </div>
          </section>

          {/* Địa chỉ giao hàng */}
          <section className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h2>
            {editMode.address ? (
              <form onSubmit={handleAddressUpdate}>
                <textarea
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode({ ...editMode, address: false })}
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-gray-700 mb-2">{userData.address}</p>
                <button
                  onClick={() => setEditMode({ ...editMode, address: true })}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </button>
              </div>
            )}
          </section>

          {/* Phương thức thanh toán */}
          <section className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-700">{userData.paymentMethod}</p>
              <button className="text-red-600 hover:underline">Xóa</button>
            </div>
            <button className="mt-4 text-blue-600 hover:underline">
              + Thêm phương thức thanh toán
            </button>
          </section>

          {/* Thông báo */}
          <section className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Thông báo</h2>
            <SettingToggle
              label="Nhận thông báo khuyến mãi"
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <div className="mt-4">
              <SettingToggle
                label="Thông báo qua email"
                enabled={true}
                onToggle={() => {}}
              />
            </div>
            <div className="mt-4">
              <SettingToggle
                label="Thông báo qua SMS"
                enabled={false}
                onToggle={() => {}}
              />
            </div>
          </section>

          {/* Giao diện */}
          <section className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Giao diện</h2>
            <SettingToggle
              label="Chế độ tối"
              enabled={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
            <div className="mt-4">
              <label className="block font-medium mb-2">Ngôn ngữ:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full md:w-64 border border-gray-300 rounded px-3 py-2"
              >
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="English">English</option>
              </select>
            </div>
          </section>

          {/* Xóa tài khoản */}
          <section className="bg-white rounded-2xl shadow-md p-6 w-full border border-red-300">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Xóa tài khoản
            </h2>
            <p className="text-gray-700 mb-3">
              Thao tác này sẽ xóa vĩnh viễn tất cả dữ liệu tài khoản của bạn.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Vô hiệu hoá hoặc xóa tài khoản
            </button>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
