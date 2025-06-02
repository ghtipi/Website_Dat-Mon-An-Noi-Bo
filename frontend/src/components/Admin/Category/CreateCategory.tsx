import { useState, useRef } from 'react';
import { createCategory } from '../../../services/admin/Category';
import { uploadImage } from '../../../services/admin/ImageService';

type CreateCategoryProps = {
    token: string;
    onSuccess: () => void;
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
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'parentId' ? (value ? Number(value) : null) : value,
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            setError(null);

            const uploadResult = await uploadImage(file);
            // Adjust the property name below to match the actual response (e.g., uploadResult.secure_url)
            const imageUrl = uploadResult.secure_url || '';
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));
            setImagePreview(URL.createObjectURL(file));
        } catch (err) {
            setError('Failed to upload image');
            console.error('Image upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: ''
        }));
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createCategory(token, { ...formData, id: '' });
            await refreshCategories();
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to create category');
            console.error('Create error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Create New Category</h2>
                {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Category Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Parent ID */}
                    <div className="mb-4">
                        <label htmlFor="parentId" className="block text-gray-700">Parent ID</label>
                        <input
                            type="number"
                            id="parentId"
                            name="parentId"
                            value={formData.parentId ?? ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter parent ID or leave empty"
                        />
                    </div>

                    {/* Slug */}
                    <div className="mb-4">
                        <label htmlFor="slug" className="block text-gray-700">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Category Image</label>
                        <div className="mt-2">
                            {imagePreview ? (
                                <div className="mb-2 relative w-fit">
                                    <img 
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        title="Remove Image"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500">No image selected</p>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 mt-2"
                            >
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Creating...' : 'Create Category'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;
