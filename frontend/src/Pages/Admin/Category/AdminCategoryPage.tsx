import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory, CategoryData } from '../../../services/admin/Category';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import EditCategory from '../../../components/Admin/Category/EditCategory';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';

    // Hàm để làm mới danh sách danh mục
    const refreshCategories = async () => {
        try {
            const data = await getCategories(token);
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories. Please try again later.');
        }
    };

    useEffect(() => {
        if (!token) {
            console.log('No token found in localStorage');
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }
        console.log('Token:', token);

        const fetchCategories = async () => {
            try {
                const data = await getCategories(token);
                setCategories(data);
            } catch (err) {
                setError('Failed to fetch categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [token]);

    // Hàm để xóa danh mục
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(token, id);
                setCategories(categories.filter(category => category.id !== id));
                setError(null);
            } catch (err) {
                setError('Failed to delete category. Please try again.');
            }
        }
    };

    // Hàm để mở form chỉnh sửa
    const handleUpdate = (id: string) => {
        const categoryToUpdate = categories.find(category => category.id === id);
        if (categoryToUpdate) {
            setSelectedCategory(categoryToUpdate);
        } else {
            setError('Category not found.');
        }
    };

    // Hàm để cập nhật danh sách sau khi chỉnh sửa
    const handleCategoryUpdate = (updatedCategory: CategoryData) => {
        setCategories(categories.map(cat => 
            cat.id === updatedCategory.id ? updatedCategory : cat
        ));
        setSelectedCategory(null); // Đóng form sau khi cập nhật
    };

    // Hàm để đóng form chỉnh sửa
    const handleCancel = () => {
        setSelectedCategory(null);
    };

    // Hàm điều hướng đến trang tạo danh mục
    const handleCreate = () => {
        navigate('/categories/new');
    };

    return (
        <LayoutAdmin>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Admin Categories</h1>
                    <button
                        onClick={handleCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Add New Category
                    </button>
                </div>

                {loading && (
                    <p className="text-center text-gray-500">Loading categories...</p>
                )}
                {error && (
                    <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center">
                        {error}
                    </p>
                )}
                {!loading && !error && categories.length === 0 && (
                    <p className="text-center text-gray-500">
                        No categories found. Try adding a new one!
                    </p>
                )}
                {!loading && !error && categories.length > 0 && (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-left">Name</th>
                                <th className="px-4 py-2 border-b text-left">Image</th>
                                <th className="px-4 py-2 border-b text-left">Slug</th>
                                <th className="px-4 py-2 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{category.name}</td>
                                    <td className="px-4 py-2 border-b">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/64';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-gray-500">No image</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border-b">{category.slug}</td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => handleUpdate(category.id)}
                                            className="text-blue-500 hover:underline mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Hiển thị form chỉnh sửa khi có danh mục được chọn */}
                {selectedCategory && (
                    <EditCategory
                        category={selectedCategory}
                        token={token}
                        onUpdate={handleCategoryUpdate}
                        onCancel={handleCancel}
                        refreshCategories={refreshCategories} // Truyền hàm refresh
                    />
                )}
            </div>
        </LayoutAdmin>
    );
};

export default AdminCategoryPage;