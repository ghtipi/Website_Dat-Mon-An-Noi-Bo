import { useState, useEffect } from 'react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import { getCategories, deleteCategory, updateCategory, CategoryData } from '../../../services/admin/Category';
import CreateCategory from '../../../components/Admin/Category/CreateCategory';
import EditCategory from '../../../components/Admin/Category/EditCategory';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{id: string, name: string} | null>(null);

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

    const handleDeleteClick = (id: string, name: string) => {
        setCategoryToDelete({id, name});
        setDeleteModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(token, id);
            setCategories(categories.filter(category => category.id !== id));
            setDeleteModalOpen(false);
            toast.success('Xóa danh mục thành công!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err: any) {
            setError(err.message || 'Xóa danh mục thất bại');
            toast.error(err.message || 'Xóa danh mục thất bại', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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

    // Helper function to strip HTML tags and get first 3 words
    const stripHtmlAndTruncate = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        const words = text.trim().split(/\s+/);
        return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-red-100 text-red-800 p-6 rounded-xl shadow-lg max-w-md flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
            </div>
        </div>
    );

    return (
        <LayoutAdmin>
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 tracking-tight">
                        Quản Lý Danh Mục
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Thêm Danh Mục Mới</span>
                        </div>
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Tên Danh Mục
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Mô Tả
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Đường Dẫn Tĩnh
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Trạng Thái
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hành Động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500 text-base">
                                        Không có danh mục nào.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-all duration-200">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                {category.image && (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="h-14 w-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                                                    />
                                                )}
                                                <div className="text-base font-medium text-gray-900">
                                                    {category.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 relative z-0">
                                            <div className="group inline-block relative">
                                                <div className="text-sm text-gray-700 truncate max-w-[200px]">
                                                {category.description
                                                    ? stripHtmlAndTruncate(category.description)
                                                    : 'Không có mô tả'}
                                                </div>

                                                {category.description && (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 hidden group-hover:block bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 text-sm rounded-lg p-3 shadow-lg w-max max-w-xs transition">
                                                    <div dangerouslySetInnerHTML={{ __html: category.description }} />
                                                </div>
                                                )}
                                            </div>
                                            </td>

                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">
                                                {category.slug || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
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
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {category.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setEditingCategory(category)}
                                                    className="text-indigo-600 hover:text-indigo-800 transition-all duration-200 font-semibold flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category.id, category.name)}
                                                    className="text-red-600 hover:text-red-800 transition-all duration-200 font-semibold flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <CreateCategory
                            token={token}
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setShowCreateModal(false)}
                            refreshCategories={fetchCategories}
                        />
                    </div>
                )}

                {editingCategory && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <EditCategory
                            category={editingCategory}
                            token={token}
                            onUpdate={handleUpdateSuccess}
                            onCancel={() => setEditingCategory(null)}
                            refreshCategories={fetchCategories}
                        />
                    </div>
                )}

                {deleteModalOpen && categoryToDelete && (
                    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/40 to-indigo-900/40 flex items-center justify-center z-50 p-4 md:p-6">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa danh mục</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Bạn có chắc chắn muốn xóa <span className="font-semibold">{categoryToDelete.name}</span> không?
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        handleDelete(categoryToDelete.id);
                                    }}
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setDeleteModalOpen(false)}
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LayoutAdmin>
    );
};

export default AdminCategoryPage;