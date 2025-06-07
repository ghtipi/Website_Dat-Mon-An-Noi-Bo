import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { getMenuPage, MenuFilterParams, PaginatedMenuResponse, MenuData } from '../services/MenuServie';
import { categoryService, Category } from '../services/categoryService';
import CartItemService from '../services/CartItemService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '../components/Tooltip';

// Utility function to strip HTML and truncate text
const stripHtmlAndTruncate = (html: string, maxLength = 20) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const MenuPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [menuData, setMenuData] = useState<PaginatedMenuResponse>({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    data: [],
  });
  const [filteredMenuData, setFilteredMenuData] = useState<PaginatedMenuResponse | null>(null);
  const [filters, setFilters] = useState<MenuFilterParams>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<MenuData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  const hasFilters = searchQuery || filters.price_min || filters.price_max || (filters.category_ids && filters.category_ids.length > 0);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await categoryService.getAllCategoriesMenuPage();
        setCategories(categoryData);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await getMenuPage(menuData.current_page, menuData.per_page, {
          ...filters,
          search: searchQuery,
        });
        if (hasFilters) {
          setFilteredMenuData(response);
        } else {
          setMenuData(response);
          setFilteredMenuData(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [menuData.current_page, menuData.per_page, searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'category_ids') {
      setFilters((prev) => ({
        ...prev,
        category_ids: value ? [value] : undefined,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value || undefined,
      }));
    }
    setMenuData((prev) => ({ ...prev, current_page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setMenuData((prev) => ({ ...prev, current_page: page }));
  };

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent, menu: MenuData) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) {
        navigate('/login');
        return;
      }
      if (!menu.id) {
        throw new Error('menu_id không hợp lệ.');
      }

      const cartItem = {
        menu_id: menu.id,
        quantity: 1,
        note: '',
      };

      await CartItemService.addToCart(cartItem, token);
      toast.success(`Đã thêm "${menu.name}" vào giỏ hàng!`);
    } catch (error: any) {
      console.error('Lỗi khi thêm vào giỏ:', error);
      if (error.response?.data) {
        const errorMessage =
          error.response.data.errors?.menu_id?.[0] ||
          error.response.data.errors?.quantity?.[0] ||
          error.response.data.message ||
          'Dữ liệu không hợp lệ.';
        toast.error(`Không thể thêm vào giỏ hàng: ${errorMessage}`);
      } else {
        toast.error(`Lỗi: ${error.message || 'Không thể kết nối tới server.'}`);
      }
    }
  };

  // Handle mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  // Render pagination buttons
  const renderPagination = (data: PaginatedMenuResponse) => {
    const { current_page, last_page } = data;
    const pages = [];
    
    if (current_page > 2) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 mx-1 rounded-full transition-all duration-300 ${
            current_page === 1 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
          }`}
        >
          1
        </button>
      );
      if (current_page > 3) {
        pages.push(<span key="start-ellipsis" className="px-2 py-2 text-gray-400">...</span>);
      }
    }

    for (let i = Math.max(1, current_page - 1); i <= Math.min(last_page, current_page + 1); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-full transition-all duration-300 ${
            current_page === i 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
          }`}
        >
          {i}
        </button>
      );
    }

    if (current_page < last_page - 1) {
      if (current_page < last_page - 2) {
        pages.push(<span key="end-ellipsis" className="px-2 py-2 text-gray-400">...</span>);
      }
      pages.push(
        <button
          key={last_page}
          onClick={() => handlePageChange(last_page)}
          className={`px-4 py-2 mx-1 rounded-full transition-all duration-300 ${
            current_page === last_page 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
          }`}
        >
          {last_page}
        </button>
      );
    }

    return (
      <div className="flex flex-wrap justify-center mt-12 gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, current_page - 1))}
          disabled={current_page === 1}
          className="px-4 py-2 mx-1 rounded-full bg-gray-50 text-teal-700 border border-teal-200 hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          «
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(last_page, current_page + 1))}
          disabled={current_page === last_page}
          className="px-4 py-2 mx-1 rounded-full bg-gray-50 text-teal-700 border border-teal-200 hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          »
        </button>
      </div>
    );
  };

  // Render menu items in grid (unchanged as per request)
  const renderMenuItems = (data: MenuData[]) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((menu) => (
          <div
            key={menu.id}
            className="group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-teal-100 cursor-pointer relative"
            onClick={() => navigate(`/menu/${menu.slug}`)}
            onMouseEnter={() => setHoveredMenu(menu)}
            onMouseLeave={() => setHoveredMenu(null)}
            onMouseMove={handleMouseMove}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={menu.image || 'https://via.placeholder.com/300'}
                alt={menu.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1" title={menu.name}>
                  {menu.name}
                </h3>
                <span className="bg-teal-50 text-teal-700 text-sm font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                  {menu.price.toLocaleString()} ₫
                </span>
              </div>
              <div className="mb-3 min-h-[40px]">
                <p className="text-gray-500 text-sm line-clamp-2">
                  {menu.description ? stripHtmlAndTruncate(menu.description, 40) : 'Không có mô tả'}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded ${menu.stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {menu.stock ? 'Còn hàng' : 'Hết hàng'}
                </span>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    menu.stock
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => menu.stock && handleAddToCart(e, menu)}
                  disabled={!menu.stock}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      {/* Enhanced Hero Section with Overlay and CTA */}
      <div className="relative bg-gradient-to-r from-teal-600 to-blue-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight animate-fade-in-down">
            Thực Đơn Đặc Biệt
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto mb-6 animate-fade-in-up">
            Khám phá những món ăn được chế biến tinh tế từ nguyên liệu tươi ngon nhất, mang đến trải nghiệm ẩm thực tuyệt vời.
          </p>
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-teal-100 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Xem thực đơn ngay
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        {/* Enhanced Filter Section with Improved Glassmorphism */}
        <div className="mb-12 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/50 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
            <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Lọc & Tìm Kiếm
          </h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-grow">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Khoảng giá (₫)</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    name="price_min"
                    placeholder="Từ"
                    value={filters.price_min || ''}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white/80 text-sm transition-all duration-200 hover:border-teal-300"
                  />
                  <input
                    type="number"
                    name="price_max"
                    placeholder="Đến"
                    value={filters.price_max || ''}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white/80 text-sm transition-all duration-200 hover:border-teal-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Danh mục</label>
                <select
                  name="category_ids"
                  value={filters.category_ids?.[0] || ''}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white/80 text-sm transition-all duration-200 hover:border-teal-300"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setFilters({})}
              className="px-6 py-3 bg-white border border-teal-200 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="mb-10 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md animate-slide-in">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-semibold text-red-800">Có lỗi xảy ra</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse shadow-sm">
                <div className="h-48 bg-gray-200/80"></div>
                <div className="p-4 space-y-4">
                  <div className="h-5 bg-gray-200/80 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200/80 rounded w-full"></div>
                  <div className="h-4 bg-gray-200/80 rounded w-1/2"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-6 bg-gray-200/80 rounded w-16"></div>
                    <div className="h-8 bg-gray-200/80 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-12">
          {/* Filtered Results */}
          {hasFilters && !loading && filteredMenuData && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filters.category_ids?.[0] 
                      ? `${categories.find(cat => cat.id.toString() === filters.category_ids?.[0])?.name}`
                      : 'Kết quả tìm kiếm'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Tìm thấy {filteredMenuData.total} món ăn phù hợp
                  </p>
                </div>
                <span className="text-sm text-gray-600 bg-teal-50 px-4 py-1.5 rounded-full">
                  Trang {filteredMenuData.current_page}/{filteredMenuData.last_page}
                </span>
              </div>
              {filteredMenuData.data.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-md animate-slide-in">
                  <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">Không tìm thấy món ăn</h3>
                  <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                    Không có món ăn nào phù hợp với tiêu chí của bạn. Hãy thử thay đổi bộ lọc.
                  </p>
                  <button
                    onClick={() => setFilters({})}
                    className="mt-6 px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-full hover:bg-teal-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  {renderMenuItems(filteredMenuData.data)}
                  {filteredMenuData.last_page > 1 && (
                    <div className="mt-12">
                      {renderPagination(filteredMenuData)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Main Menu Grid */}
          {!loading && menuData.data.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tất cả món ăn</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {menuData.total} món ăn đa dạng cho bạn lựa chọn
                  </p>
                </div>
                <span className="text-sm text-gray-600 bg-teal-50 px-4 py-1.5 rounded-full">
                  Trang {menuData.current_page}/{menuData.last_page}
                </span>
              </div>
              {renderMenuItems(menuData.data)}
              {menuData.last_page > 1 && (
                <div className="mt-12">
                  {renderPagination(menuData)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tooltip */}
        {hoveredMenu && (
          <Tooltip
            x={tooltipPos.x}
            y={tooltipPos.y}
            content={
              <div className="max-w-xs p-4 bg-white rounded-xl shadow-xl border border-gray-100/50">
                <h4 className="text-base font-bold text-gray-900 mb-2">{hoveredMenu.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {hoveredMenu.description
                    ? stripHtmlAndTruncate(hoveredMenu.description, 200)
                    : 'Không có mô tả'}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded ${hoveredMenu.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {hoveredMenu.stock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                  <span className="text-teal-600 font-semibold">
                    {hoveredMenu.price.toLocaleString()} ₫
                  </span>
                </div>
              </div>
            }
            visible={!!hoveredMenu}
          />
        )}
      </div>
    </Layout>
  );
};

export default MenuPage;