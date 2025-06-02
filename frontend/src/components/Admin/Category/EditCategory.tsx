import { useState, useRef, useEffect } from 'react';
import { updateCategory, CategoryData } from '../../../services/admin/Category';
import { uploadImage } from '../../../services/admin/ImageService';

type EditCategoryProps = {
  category: CategoryData;
  token: string;
  onUpdate: (updatedCategory: CategoryData) => void;
  onCancel: () => void;
  refreshCategories: () => Promise<void>;
};

const EditCategory: React.FC<EditCategoryProps> = ({
  category,
  token,
  onUpdate,
  onCancel,
  refreshCategories,
}) => {
  const [formData, setFormData] = useState({
    id: category.id,
    name: category.name || '',
    description: category.description || '',
    parentId: category.parentId ?? '',
    slug: category.slug || '',
    image: category.image || '',
    status: category.status === 'active' ? 'active' : 'inactive', // Chuẩn hóa thành 'active' hoặc 'inactive'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(category.image || '');

  useEffect(() => {
    setFormData({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      parentId: category.parentId ?? '',
      slug: category.slug || '',
      image: category.image || '',
      status: category.status === 'active' ? 'active' : 'inactive',
    });
    setImagePreview(category.image || '');
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'parentId' ? value : value,
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
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = {
      ...formData,
      parentId: formData.parentId ? Number(formData.parentId) : null,
    };

    try {
      const updatedCategory = await updateCategory(token, category.id, submitData);
      onUpdate(updatedCategory);
      await refreshCategories();
    } catch (err: any) {
      setError(err.message || 'Cập nhật danh mục thất bại');
      console.error('Lỗi cập nhật:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 transition-all duration-300 transform">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight text-center">Chỉnh Sửa Danh Mục</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Tên danh mục */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Tên Danh Mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 disabled:bg-gray-200"
              placeholder="Nhập tên danh mục"
              required
              disabled={loading || imageUploading}
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Mô Tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 disabled:bg-gray-200 resize-y"
              placeholder="Nhập mô tả danh mục"
              disabled={loading || imageUploading}
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              Đường Dẫn Tĩnh (Slug)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 disabled:bg-gray-200"
              placeholder="Nhập slug (ví dụ: mon-khai-vi)"
              disabled={loading || imageUploading}
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trạng Thái
            </label>
            <div className="flex items-center">
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
              <span className="ml-3 text-gray-700 font-medium">
                {formData.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
              </span>
            </div>
          </div>

          {/* Ảnh danh mục */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ảnh Danh Mục
            </label>
            <div className="mt-2 space-y-4">
              {imagePreview ? (
                <div className="relative w-fit">
                  <img
                    src={imagePreview}
                    alt="Ảnh danh mục"
                    className="w-48 h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg disabled:bg-gray-400"
                    title="Xóa ảnh"
                    disabled={loading || imageUploading}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Chưa chọn ảnh</p>
              )}

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
                className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-lg hover:bg-indigo-200 transition-colors duration-200 text-sm font-semibold shadow-sm disabled:bg-gray-300 disabled:text-gray-500"
                disabled={loading || imageUploading}
              >
                {imageUploading
                  ? 'Đang tải ảnh...'
                  : imagePreview
                  ? 'Thay Đổi Ảnh'
                  : 'Tải Ảnh Lên'}
              </button>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || imageUploading}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200 font-semibold shadow-md"
            >
              {loading ? 'Đang Cập Nhật...' : 'Cập Nhật Danh Mục'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-md disabled:bg-gray-300 disabled:text-gray-500"
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

export default EditCategory;