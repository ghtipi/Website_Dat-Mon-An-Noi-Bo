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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ ảnh preview với formData.image
  const [imagePreview, setImagePreview] = useState<string>(category.image || '');

  useEffect(() => {
    setFormData({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      parentId: category.parentId ?? '',
      slug: category.slug || '',
      image: category.image || '',
    });
    setImagePreview(category.image || '');
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // ParentId kiểu string cho input, convert sang number khi submit
      [name]: name === 'parentId' ? value : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError(null);

    try {
        const uploadResult = await uploadImage(file);
        const imageUrl = uploadResult.secure_url;  // Sửa đây
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
    } catch (err) {
        setError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
        console.error('Upload failed:', err);
    } finally {
        setImageUploading(false);
    }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Chuẩn hóa dữ liệu trước khi gửi
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
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập tên danh mục"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập mô tả danh mục"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="parentId" className="block text-gray-700 font-semibold mb-1">
              ID danh mục cha
            </label>
            <input
              type="number"
              id="parentId"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập ID danh mục cha hoặc để trống"
              disabled={loading}
              min={1}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block text-gray-700 font-semibold mb-1">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập slug (đường dẫn tĩnh)"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Ảnh danh mục
            </label>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Ảnh danh mục"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
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
              disabled={loading || imageUploading}
              className={`px-4 py-2 rounded ${
                imageUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {imageUploading
                ? 'Đang tải ảnh...'
                : imagePreview
                ? 'Thay đổi ảnh'
                : 'Tải ảnh lên'}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || imageUploading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật danh mục'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading || imageUploading}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCategory;
