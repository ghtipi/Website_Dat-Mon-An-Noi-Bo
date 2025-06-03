import { useEffect, useState, useCallback } from 'react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import { getMenus, MenuData, updateMenu, getMenu, deleteMenu} from '../../../services/admin/Menu';
import { getCategories } from '../../../services/admin/Category';
import CreateMenu from '../../../components/Admin/Menu/CreateMenu';
import EditMenu from '../../../components/Admin/Menu/EditMenu';

// Định nghĩa giao diện CategoryData
export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  slug?: string;
}

// Định nghĩa giao diện MenuFilterParams
export interface MenuFilterParams {
  category_ids?: string[];
  price_min?: number;
  price_max?: number;
  status: string;
  search: string;
  price_range: string;
}

const AdminMenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMenu, setEditingMenu] = useState<MenuData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const token = localStorage.getItem('token') || '';
  const [filters, setFilters] = useState<MenuFilterParams>({
    category_ids: [],
    price_min: undefined,
    price_max: undefined,
    status: '',
    search: '',
    price_range: '',
  });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const fetchMenusAndCategories = useCallback(async () => {
    try {
      setLoading(true);
      const filterParams: MenuFilterParams = {
        status: '',
        search: '',
        price_range: '',
      };
      
      if (filters.category_ids && filters.category_ids.length > 0) {
        filterParams.category_ids = filters.category_ids;
      }
      if (filters.price_min !== undefined) filterParams.price_min = filters.price_min;
      if (filters.price_max !== undefined) filterParams.price_max = filters.price_max;
      if (filters.status) filterParams.status = filters.status;
      if (filters.search) filterParams.search = filters.search;

      const [menuData, categoryData] = await Promise.all([
        getMenus(token, filterParams),
        getCategories(token),
      ]);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Lấy dữ liệu thất bại');
      setMenuItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchMenusAndCategories();
  }, [fetchMenusAndCategories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category_id') {
      setFilters((prev) => ({
        ...prev,
        category_ids: value ? [value] : [],
      }));
    } else if (name === 'price_range') {
      const [min, max] = value.split('-').map(Number);
      setFilters((prev) => ({
        ...prev,
        price_min: min,
        price_max: max,
        price_range: value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      category_ids: categoryId ? [categoryId] : [],
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMenusAndCategories();
  };

  const handleStatusToggle = useCallback(async (menu: MenuData) => {
    try {
      const updatedStatus = menu.status === 'active' ? 'inactive' : 'active';
      const updatedMenu: MenuData = { ...menu, status: updatedStatus };
      await updateMenu(token, menu.id, updatedMenu);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === menu.id ? updatedMenu : item))
      );
    } catch (err: any) {
      setError(err.message || 'Cập nhật trạng thái món ăn thất bại');
    }
  }, [token]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này không?')) {
      try {
        await deleteMenu(token, id);
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err: any) {
        setError(err.message || 'Xóa món ăn thất bại');
      }
    }
  }, [token]);

  const handleEdit = useCallback(async (id: string) => {
    try {
      const menu = await getMenu(token, id);
      setEditingMenu(menu);
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy món để chỉnh sửa');
    }
  }, [token]);

  const handleUpdateSuccess = useCallback((updatedMenu: MenuData) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedMenu.id ? updatedMenu : item))
    );
    setEditingMenu(null);
  }, []);

  const handleCreateSuccess = useCallback((newMenu: MenuData) => {
    setMenuItems((prev) => [...prev, newMenu]);
    setShowCreateModal(false);
  }, []);

  const getCategoryName = useCallback(
    (category_ids: string[] | undefined) => {
      if (!Array.isArray(category_ids) || !Array.isArray(categories)) return 'Không có danh mục';
      return category_ids
        .map((id) => categories.find((cat) => cat.id === id)?.name || 'Không có danh mục')
        .join(', ');
    },
    [categories]
  );

  if (loading && menuItems.length === 0) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-red-100 text-red-800 p-6 rounded-xl shadow-lg max-w-md flex items-center gap-3">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
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

        <div className="bg-white shadow-xl rounded-2xl p-6 mx-auto mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Lọc và Tìm Kiếm
          </h2>
          {error && (
            <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm (Tên/Mô tả)</label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search || ''}
                  onChange={handleInputChange}
                  placeholder="Nhập tên hoặc mô tả món ăn..."
                  className="w-full p-4 pl-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <svg
                  className="w-6 h-6 text-gray-400 absolute left-4 top-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <span className="text-gray-700">
                    {filters.category_ids && filters.category_ids.length > 0 && filters.category_ids[0]
                      ? categories.find((cat) => cat.id === filters.category_ids![0])?.name || 'Không có danh mục'
                      : 'Chọn danh mục'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto">
                    <div
                      className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-all duration-200 flex items-center gap-3"
                      onClick={() => handleCategorySelect('')}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          !filters.category_ids || filters.category_ids.length === 0 ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                        }`}
                      >
                        {(!filters.category_ids || filters.category_ids.length === 0) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700">Tất cả danh mục</span>
                    </div>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-all duration-200 flex items-center gap-3"
                          onClick={() => handleCategorySelect(cat.id)}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                              filters.category_ids && filters.category_ids.includes(cat.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                            }`}
                          >
                            {filters.category_ids && filters.category_ids.includes(cat.id) && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-gray-700">{cat.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500">Không có danh mục</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
              <div className="relative">
                <select
                  name="price_range"
                  value={filters.price_range || ''}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 appearance-none transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="">Tất cả giá</option>
                  <option value="0-50000">0 - 50,000đ</option>
                  <option value="50000-100000">50,000đ - 100,000đ</option>
                  <option value="100000-200000">100,000đ - 200,000đ</option>
                  <option value="200000-500000">200,000đ - 500,000đ</option>
                  <option value="500000-1000000">500,000đ - 1,000,000đ</option>
                  <option value="1000000-9999999">Trên 1,000,000đ</option>
                </select>
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-4 top-4 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <div className="relative">
                <select
                  name="status"
                  value={filters.status || ''}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 appearance-none transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Kích Hoạt</option>
                  <option value="inactive">Không Kích Hoạt</option>
                </select>
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-4 top-4 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <button
                type="submit"
                disabled={loading}
                onClick={handleFilterSubmit}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {loading ? 'Đang tải...' : 'Tìm Kiếm & Lọc'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Món Ăn
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Mô Tả
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Giá
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Danh Mục
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Tồn Kho
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Trạng Thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
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
                            loading="lazy"
                          />
                        )}
                        <div className="text-base font-medium text-gray-900">{item.name}</div>
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
                        {getCategoryName(item.category_ids)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {item.stock !== undefined ? item.stock : 'Không giới hạn'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStatusToggle(item)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                            item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          aria-pressed={item.status === 'active'}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                              item.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                          <span className="sr-only">
                            {item.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoại'}
                          </span>
                        </button>
                        <span className="text-sm text-gray-700 font-medium">
                          {item.status === 'active' ? 'Kích Hoạt' : 'Không Kích Hoại'}
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
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-all duration-200 font-semibold flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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
                category_ids: [],
                slug: '',
                image: '',
                stock: undefined,
                status: 'inactive',
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