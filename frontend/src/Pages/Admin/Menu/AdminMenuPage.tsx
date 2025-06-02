import { useEffect, useState } from 'react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import { getMenus, MenuData, updateMenu, getMenu, deleteMenu } from '../../../services/admin/Menu';
import { getCategories, CategoryData } from '../../../services/admin/Category';
import EditMenu from '../../../components/Admin/Menu/EditMenu';
import CreateMenu from '../../../components/Admin/Menu/CreateMenu';

const AdminMenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMenu, setEditingMenu] = useState<MenuData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const token = localStorage.getItem('token') || '';

  const fetchMenusAndCategories = async () => {
    try {
      setLoading(true);
      const [menuData, categoryData] = await Promise.all([
        getMenus(token),
        getCategories(token),
      ]);
      setMenuItems(menuData);
      setCategories(categoryData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Lấy dữ liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenusAndCategories();
  }, [token]);

  const handleStatusToggle = async (menu: MenuData) => {
    try {
      const updatedStatus = menu.status === 'active' ? 'inactive' : 'active';
      const updatedMenu: MenuData = { ...menu, status: updatedStatus };
      await updateMenu(token, menu.id, updatedMenu);
      setMenuItems(menuItems.map(item => 
        item.id === menu.id ? updatedMenu : item
      ));
    } catch (err: any) {
      setError(err.message || 'Cập nhật trạng thái món ăn thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này không?')) {
      try {
        await deleteMenu(token, id);
        setMenuItems(menuItems.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message || 'Xóa món ăn thất bại');
      }
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const menu = await getMenu(token, id);
      setEditingMenu(menu);
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy món để chỉnh sửa');
    }
  };

  const handleUpdateSuccess = (updatedMenu: MenuData) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedMenu.id ? updatedMenu : item
    ));
    setEditingMenu(null);
  };

  const handleCreateSuccess = (newMenu: MenuData) => {
    setMenuItems([...menuItems, newMenu]);
    setShowCreateModal(false);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không có danh mục';
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
            Quản Lý Món Ăn
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm Món Ăn Mới</span>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Món Ăn
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Mô Tả
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Danh Mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Tồn Kho
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
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500 text-base">
                    Không có món ăn nào.
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                          />
                        )}
                        <div className="text-base font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {item.description || 'Không có mô tả'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {item.price.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {getCategoryName(item.category_id)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {item.stock || 'Không giới hạn'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStatusToggle(item)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                            item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                              item.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                          <span className="sr-only">
                            {item.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
                          </span>
                        </button>
                        <span className="text-sm text-gray-700 font-medium">
                          {item.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoạt'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-indigo-600 hover:text-indigo-800 transition-all duration-200 font-semibold flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
            <CreateMenu
              menu={{
                id: '',
                name: '',
                description: '',
                price: 0,
                category_id: '',
                image: '',
                stock: 0,
                status: 'inactive'
              }}
              token={token}
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateModal(false)}
              refreshMenus={fetchMenusAndCategories}
            />
          </div>
        )}

        {editingMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <EditMenu
              menu={editingMenu}
              token={token}
              onUpdate={handleUpdateSuccess}
              onCancel={() => setEditingMenu(null)}
              refreshMenus={fetchMenusAndCategories}
            />
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

export default AdminMenuPage;