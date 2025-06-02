import { useState, useRef } from 'react';
import { createCategory, CategoryData } from '../../../services/admin/Category';
import { uploadImage } from '../../../services/admin/ImageService';

type CreateCategoryProps = {
    token: string;
    onSuccess: (newCategory: CategoryData) => void;
    onCancel: () => void;
    refreshCategories: () => Promise<void>;
};

const CreateCategory: React.FC<CreateCategoryProps> = ({ token, onSuccess, onCancel, refreshCategories }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: null as number | null,
        slug: '',
        image: '',
        status: 'active' // Mặc định là 'active'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'parentId' ? (value ? Number(value) : null) : value,
        }));
    };

    const handleStatusToggle = () => {
        setFormData(prev => ({
            ...prev,
            status: prev.status === 'active' ? 'inactive' : 'active',
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            setError(null);
            setUploadProgress(0);

            const uploadResult = await uploadImage(file);
            const imageUrl = uploadResult.secure_url || '';
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));
            setImagePreview(URL.createObjectURL(file));
        } catch (err) {
            setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
            console.error('Lỗi tải ảnh:', err);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: ''
        }));
        setImagePreview(null);
        setUploadProgress(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newCategory = await createCategory(token, { ...formData, id: '' });
            await refreshCategories();
            onSuccess(newCategory);
        } catch (err: any) {
            setError(err.message || 'Tạo danh mục thất bại');
            console.error('Lỗi tạo danh mục:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 transition-all duration-300 transform">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight text-center">Tạo Danh Mục Mới</h2>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Tên danh mục */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên Danh Mục <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 disabled:bg-gray-200"
                            placeholder="Nhập tên danh mục"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 disabled:bg-gray-200 resize-y"
                            placeholder="Nhập mô tả danh mục"
                            rows={4}
                            disabled={loading}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">Đường Dẫn Tĩnh (Slug)</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 disabled:bg-gray-200"
                            placeholder="Nhập slug (ví dụ: mon-khai-vi)"
                            disabled={loading}
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng Thái</label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={handleStatusToggle}
                                disabled={loading}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                                    formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                                } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
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

                    {/* Tải ảnh */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Danh Mục</label>
                        <div className="mt-2 space-y-4">
                            {imagePreview ? (
                                <div className="relative w-fit">
                                    <img 
                                        src={imagePreview}
                                        alt="Xem trước"
                                        className="w-48 h-48 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg disabled:bg-gray-400"
                                        title="Xóa ảnh"
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Chưa chọn ảnh</p>
                            )}

                            {loading && uploadProgress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-indigo-600 h-3 rounded-full transition-all duration-300 ease-in-out" 
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                    <p className="text-sm text-gray-600 mt-2">Đang tải: {uploadProgress}%</p>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-lg hover:bg-indigo-200 transition-colors duration-200 text-sm font-semibold shadow-sm disabled:bg-gray-300 disabled:text-gray-500"
                                disabled={loading}
                            >
                                {imagePreview ? 'Thay Đổi Ảnh' : 'Tải Ảnh Lên'}
                            </button>
                        </div>
                    </div>

                    {/* Nút điều khiển */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200 font-semibold shadow-md"
                        >
                            {loading ? 'Đang Tạo...' : 'Tạo Danh Mục'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-md disabled:bg-gray-300 disabled:text-gray-500"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;