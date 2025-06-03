import React, { useState, useEffect, useRef } from 'react';
import { createMenu, MenuData } from '../../../services/admin/Menu';
import { getCategories, CategoryData } from '../../../services/admin/Category';
import { uploadImage } from '../../../services/admin/ImageService';

type CreateMenuProps = {
  menu: MenuData;
  token: string;
  onSuccess: (newMenu: MenuData) => void;
  onCancel: () => void;
  refreshMenus: () => Promise<void>;
};

const CreateMenu: React.FC<CreateMenuProps> = ({
  menu,
  token,
  onSuccess,
  onCancel,
  refreshMenus,
}) => {
  const [formData, setFormData] = useState({
    id: menu.id,
    name: menu.name || '',
    description: menu.description || '',
    price: menu.price || 0,
    category_ids: menu.category_ids || [], // Initialize with category_ids array
    image: menu.image || '',
    status: menu.status === 'active' ? 'active' : 'inactive',
    stock: menu.stock !== undefined ? menu.stock : '',
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(menu.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch {
        setError('Lấy danh sách danh mục thất bại');
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    setFormData({
      id: menu.id,
      name: menu.name || '',
      description: menu.description || '',
      price: menu.price || 0,
      category_ids: menu.category_ids || [], // Use category_ids directly
      image: menu.image || '',
      status: menu.status === 'active' ? 'active' : 'inactive',
      stock: menu.stock !== undefined ? menu.stock : '',
    });
    setImagePreview(menu.image || '');
  }, [menu]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price'
          ? Number(value)
          : name === 'stock'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({
      ...prev,
      category_ids: selectedOptions,
    }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active',
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError(null);

    try {
      const uploadResult = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: uploadResult.secure_url }));
      setImagePreview(uploadResult.secure_url);
    } catch {
      setError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Tên món ăn là bắt buộc.');
      return;
    }
    if (formData.price <= 0) {
      setError('Giá phải lớn hơn 0.');
      return;
    }
    if (formData.category_ids.length === 0) {
      setError('Vui lòng chọn ít nhất một danh mục.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        slug: menu.slug || '', 
        stock:
          formData.stock === '' || formData.stock === undefined
            ? undefined
            : Number(formData.stock),
      };
      const newMenu = await createMenu(token, payload);
      onSuccess(newMenu);
      await refreshMenus();
    } catch (err: any) {
      setError(err?.message || 'Tạo món ăn thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/40 to-indigo-900/40 flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-6 md:p-8 transform transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-6 tracking-tight text-center">
          {menu.id ? 'Chỉnh Sửa Món Ăn' : 'Tạo Món Ăn Mới'}
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded-xl mb-6 animate-fade-in flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-800">
              Tên Món Ăn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Nhập tên món ăn"
              required
              disabled={loading || imageUploading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-800">
              Mô Tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
              placeholder="Nhập mô tả món ăn"
              disabled={loading || imageUploading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-800">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min={0}
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Nhập giá món ăn"
              required
              disabled={loading || imageUploading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category_ids" className="block text-sm font-medium text-gray-800">
              Danh Mục <span className="text-red-500">*</span>
            </label>
            <select
              id="category_ids"
              name="category_ids"
              value={formData.category_ids}
              onChange={handleCategoryChange}
              multiple
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading || imageUploading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">Giữ Ctrl (hoặc Cmd) để chọn nhiều danh mục</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-800">
              Tồn Kho
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min={0}
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Số lượng tồn kho (để trống nếu không giới hạn)"
              disabled={loading || imageUploading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Ảnh Món Ăn</label>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={imagePreview}
                    alt="Ảnh món ăn"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
                    aria-label="Xóa ảnh"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 bg-gray-50">
                  Chưa có ảnh
                </div>
              )}
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  disabled={loading || imageUploading}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {imageUploading && (
                  <div className="flex items-center gap-2 text-indigo-600">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang tải ảnh...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="status" className="text-sm font-medium text-gray-800">
              Trạng Thái:
            </label>
            <button
              type="button"
              onClick={toggleStatus}
              className={`px-4 py-2 rounded-full font-semibold shadow-sm transition-all duration-200 ${
                formData.status === 'active'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              disabled={loading || imageUploading}
            >
              {formData.status === 'active' ? 'Đang hoạt động' : 'Đã tắt'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || imageUploading}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || imageUploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang lưu...</span>
                </div>
              ) : menu.id ? 'Cập Nhật' : 'Tạo Mới'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMenu;