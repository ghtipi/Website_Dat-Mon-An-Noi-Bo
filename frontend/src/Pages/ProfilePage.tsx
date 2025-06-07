import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import UserService, { UserProfile } from '../services/UserService';
import { toast } from 'react-toastify';
import { eventBus } from '../utils/eventBus';
import { uploadImage } from '../services/ImageService';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    default_address: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await UserService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        default_address: data.default_address || '',
        avatar: data.avatar || '',
      });
    } catch (error) {
      toast.error('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        avatar: result.secure_url
      }));
      toast.success('Upload ảnh đại diện thành công');
    } catch (error) {
      toast.error('Không thể upload ảnh đại diện');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await UserService.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        default_address: formData.default_address,
        avatar: formData.avatar
      });
      setProfile(updatedProfile);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserData = {
        ...currentUser,
        ...updatedProfile
      };
      localStorage.setItem('user', JSON.stringify(newUserData));
      eventBus.emit('userUpdated', newUserData);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    try {
      await UserService.changePassword(
        passwordData.current_password,
        passwordData.new_password
      );
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast.success('Đổi mật khẩu thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
                  <div className="h-8 bg-gray-300 rounded-lg w-24"></div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                      <div className="h-10 bg-gray-100 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6 p-6 bg-white rounded-xl shadow-lg">
                <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                      <div className="h-10 bg-gray-100 rounded-lg"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className=" min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar and Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-8 sm:p-10">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Avatar"
                          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-5xl font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                          {getInitials(profile?.name)}
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all shadow-md transform hover:scale-110">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                      )}
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-gray-800">{profile?.name}</h2>
                    <p className="text-teal-600 font-medium">{profile?.email}</p>
                    
                    {isEditing && (
                      <p className="mt-2 text-sm text-gray-500 text-center">
                        Nhấn vào biểu tượng camera để cập nhật ảnh đại diện
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                      isEditing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hủy chỉnh sửa
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa thông tin
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Thống kê tài khoản</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-teal-500 rounded-lg p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-600">Thành viên từ</dt>
                          <dd>
                            <div className="text-lg font-semibold text-gray-800">Tháng 6, 2023</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-600">Đơn hàng</dt>
                          <dd>
                            <div className="text-lg font-semibold text-gray-800">12 đơn</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information Form */}
              <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-blue-50">
    <h3 className="text-xl font-bold text-gray-800 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Thông tin cá nhân
    </h3>
  </div>
  
  <div className="px-6 py-8">
    {isEditing ? (
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Các trường chỉnh sửa giữ nguyên như cũ */}
          <div className="sm:col-span-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Họ và tên
            </label>
            <div className="mt-1.5">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-4 border transition-all duration-200 hover:border-teal-400"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <div className="mt-1.5">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="default_address" className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <div className="mt-1.5">
              <input
                type="text"
                name="default_address"
                id="default_address"
                value={formData.default_address}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <div className="mt-1.5">
              <input
                type="url"
                name="avatar"
                id="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    ) : (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{profile?.name}</h4>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-6 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Số điện thoại</label>
                <div className="text-sm text-gray-800 font-medium">
                  {profile?.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Địa chỉ</label>
                <div className="text-sm text-gray-800 font-medium">
                  {profile?.default_address || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    )}
  </div>
</div>
              {/* Change Password Form */}
              <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Đổi mật khẩu</h3>
                </div>
                <div className="px-6 py-8">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                          Mật khẩu hiện tại
                        </label>
                        <div className="mt-1.5">
                          <input
                            type="password"
                            name="current_password"
                            id="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                          Mật khẩu mới
                        </label>
                        <div className="mt-1.5">
                          <input
                            type="password"
                            name="new_password"
                            id="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="mt-1.5">
                          <input
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 border transition-all duration-200 hover:border-teal-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0][0].toUpperCase();
  const secondLast = words[words.length - 2][0].toUpperCase();
  const last = words[words.length - 1][0].toUpperCase();
  return secondLast + last;
};

export default ProfilePage;