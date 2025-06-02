import { useState, useEffect } from 'react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import { getCategories, deleteCategory, updateCategory, CategoryData } from '../../../services/admin/Category';
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
            setError(err.message || 'Lấy danh sách danh mục thất bại');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await deleteCategory(token, id);
                setCategories(categories.filter(category => category.id !== id));
            } catch (err: any) {
                setError(err.message || 'Xóa danh mục thất bại');
            }
        }
    };

    const handleStatusToggle = async (category: CategoryData) => {
        try {
            const updatedStatus = category.status === 'active' ? 'inactive' : 'active';
            const updatedCategory: CategoryData = { ...category, status: updatedStatus };
            await updateCategory(token, category.id, updatedCategory);
            setCategories(categories.map(cat => 
                cat.id === category.id ? updatedCategory : cat
            ));
        } catch (err: any) {
            setError(err.message || 'Cập nhật trạng thái danh mục thất bại');
        }
    };

    const handleCreateSuccess = (newCategory: CategoryData) => {
        setCategories([...categories, newCategory]);
        setShowCreateModal(false);
    };

    const handleUpdateSuccess = (updatedCategory: CategoryData) => {
        setCategories(categories.map(cat => 
            cat.id === updatedCategory.id ? updatedCategory : cat
        ));
        setEditingCategory(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-red-50 text-red-700 p-6 rounded-lg shadow-lg max-w-md">
                {error}
            </div>
        </div>
    );

    return (
        <LayoutAdmin>
            <div className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                        Quản Lý Danh Mục
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                        + Thêm Danh Mục Mới
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Tên Danh Mục
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Mô Tả
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Đường Dẫn Tĩnh
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Trạng Thái
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Hành Động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {category.image && (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="h-12 w-12 rounded-full mr-4 object-cover border border-gray-200 shadow-sm"
                                                />
                                            )}
                                            <div className="text-base font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm text-gray-700 line-clamp-2">
                                            {category.description || 'Không có mô tả'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">
                                            {category.slug || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleStatusToggle(category)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                                                    category.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                                                        category.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                                                    }`}
                                                />
                                                <span className="sr-only">
                                                    {category.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
                                                </span>
                                            </button>
                                            <span className="ml-3 text-gray-700 font-medium">
                                                {category.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => setEditingCategory(category)}
                                            className="text-indigo-600 hover:text-indigo-800 mr-4 transition-colors duration-200 font-semibold"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200 font-semibold"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <CreateCategory
                            token={token}
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setShowCreateModal(false)}
                            refreshCategories={fetchCategories}
                        />
                    </div>
                )}

                {editingCategory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <EditCategory
                            category={editingCategory}
                            token={token}
                            onUpdate={handleUpdateSuccess}
                            onCancel={() => setEditingCategory(null)}
                            refreshCategories={fetchCategories}
                        />
                    </div>
                )}
            </div>
        </LayoutAdmin>
    );
};

export default AdminCategoryPage;