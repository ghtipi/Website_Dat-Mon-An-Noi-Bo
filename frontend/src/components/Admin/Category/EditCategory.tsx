import { useState } from 'react';
import { updateCategory, CategoryData } from '../../../services/admin/Category';


type EditCategoryProps = {
  category: CategoryData;
  token: string;
  onUpdate: (updatedCategory: CategoryData) => void;
  onCancel: () => void;
  refreshCategories: () => Promise<void>;
};

const EditCategory: React.FC<EditCategoryProps> = ({ category, token, onUpdate, onCancel, refreshCategories }) => {
    const [formData, setFormData] = useState({
        id: category.id,
        name: category.name || '',
        description: category.description || '',
        parentId: category.parentId ?? null,
        slug: category.slug || '',
        image: category.image || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'parentId' ? (value ? Number(value) : null) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updatedData = await updateCategory(token, category.id, formData);
            onUpdate(updatedData);
            await refreshCategories(); // Gọi để làm mới danh sách
            setLoading(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update category');
            console.error('Update error:', err);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-gray-700">Image URL</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Updating...' : 'Update Category'}
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

export default EditCategory;