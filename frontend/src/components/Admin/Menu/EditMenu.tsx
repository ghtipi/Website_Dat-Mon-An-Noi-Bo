import { useState, useRef, useEffect } from 'react';
import { updateMenu, MenuData } from '../../../services/admin/Menu';
import { uploadImage } from '../../../services/ImageService';
import { getCategories, CategoryData } from '../../../services/admin/Category';

type EditMenuProps = {
  menu: MenuData;
  token: string;
  onUpdate: (updatedMenu: MenuData) => void;
  onCancel: () => void;
  refreshMenus: () => Promise<void>;
};

const EditMenu: React.FC<EditMenuProps> = ({
  menu,
  token,
  onUpdate,
  onCancel,
  refreshMenus,
}) => {
  const [formData, setFormData] = useState({
    id: menu.id,
    name: menu.name || '',
    description: menu.description || '',
    price: menu.price || 0,
    category_ids: menu.category_ids || [], // Initialize with category_ids from MenuData
    slug: menu.slug || '',
    image: menu.image || '',
    status: menu.status === 'active' ? 'active' : 'inactive',
    stock: menu.stock !== undefined ? menu.stock : '',
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>(menu.image || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (err: any) {
        setError('Lấy danh sách danh mục thất bại');
      }
    };
    fetchCategories();

    setFormData({
      id: menu.id,
      name: menu.name || '',
      description: menu.description || '',
      price: menu.price || 0,
      category_ids: menu.category_ids || [], // Use category_ids from MenuData
      slug: menu.slug || '',
      image: menu.image || '',
      status: menu.status === 'active' ? 'active' : 'inactive',
      stock: menu.stock !== undefined ? menu.stock : '',
    });
    setImagePreview(menu.image || '');
  }, [menu, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : name === 'stock' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({
      ...prev,
      category_ids: selectedOptions,
    }));
  };

  const handleStatusToggle = () => {
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
      const imageUrl = uploadResult.secure_url;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    } catch (err) {
      setError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
      console.error('Lỗi tải ảnh:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: ''
    }));
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Tên món ăn là bắt buộc');
      setLoading(false);
      return;
    }
    if (formData.price <= 0) {
      setError('Giá phải lớn hơn 0');
      setLoading(false);
      return;
    }
    if (formData.category_ids.length === 0) {
      setError('Vui lòng chọn ít nhất một danh mục');
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      stock: formData.stock !== '' ? Number(formData.stock) : undefined,
    };

    try {
      const updatedMenu = await updateMenu(token, menu.id, submitData);
      onUpdate(updatedMenu);
      await refreshMenus();
    } catch (err: any) {
      setError(err.message || 'Cập nhật món ăn thất bại');
      console.error('Lỗi cập nhật:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/40 to-indigo-900/40 flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-6 md:p-8 transform transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-6 tracking-tight text-center">
          Chỉnh Sửa Món Ăn
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
          {/* Tên món ăn */}
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

          {/* Mô tả */}
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

          {/* Giá */}
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-800">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Nhập giá món ăn"
              required
              min="0"
              disabled={loading || imageUploading}
            />
          </div>

          {/* Danh mục */}
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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">Giữ Ctrl (hoặc Cmd) để chọn nhiều danh mục</p>
          </div>

          {/* Tồn kho */}
          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-800">
              Tồn Kho
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Nhập số lượng tồn kho (để trống nếu không giới hạn)"
              min="0"
              disabled={loading || imageUploading}
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Trạng Thái
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStatusToggle}
                disabled={loading || imageUploading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                } ${loading || imageUploading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                    formData.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-gray-700 font-medium">
                {formData.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
              </span>
            </div>
          </div>

          {/* Ảnh món ăn */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Ảnh Món Ăn
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={imagePreview}
                    alt="Ảnh món ăn"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
                    title="Xóa ảnh"
                    disabled={loading || imageUploading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 bg-gray-50">
                  Chưa chọn ảnh
                </div>
              )}
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={loading || imageUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-indigo-100 text-indigo-700 rounded-xl font-semibold shadow-sm hover:bg-indigo-200 transition-all duration-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={loading || imageUploading}
                >
                  {imageUploading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Đang tải ảnh...</span>
                    </div>
                  ) : imagePreview ? 'Thay Đổi Ảnh' : 'Tải Ảnh Lên'}
                </button>
              </div>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex flex-col md:flex-row gap-4 pt-2">
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
                  <span>Đang Cập Nhật...</span>
                </div>
              ) : 'Cập Nhật Món Ăn'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || imageUploading}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenu;