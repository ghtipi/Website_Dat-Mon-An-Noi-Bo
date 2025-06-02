import { useState, useEffect } from 'react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import { getCategories, deleteCategory, CategoryData } from '../../../services/admin/Category';
import CreateCategory from '../../../components/Admin/Category/CreateCategory';
import EditCategory from '../../../components/Admin/Category/EditCategory';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

    const token = localStorage.getItem('token') || '';

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories(token);
            setCategories(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(token, id);
                await fetchCategories();
            } catch (err: any) {
                setError(err.message || 'Failed to delete category');
            }
        }
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchCategories();
    };

    const handleUpdateSuccess = () => {
        setEditingCategory(null);
        fetchCategories();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <LayoutAdmin>
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Category Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parent ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {category.image && (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="h-10 w-10 rounded-full mr-3 object-cover"
                                            />
                                        )}
                                        <div className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{category.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{category.parentId || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => setEditingCategory(category)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <CreateCategory
                    token={token}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateModal(false)}
                    refreshCategories={fetchCategories}
                />
            )}

            {editingCategory && (
                <EditCategory
                    category={editingCategory}
                    token={token}
                    onUpdate={handleUpdateSuccess}
                    onCancel={() => setEditingCategory(null)}
                    refreshCategories={fetchCategories}
                />
            )}
        </div>
        </LayoutAdmin>
    );
};

export default AdminCategoryPage;
