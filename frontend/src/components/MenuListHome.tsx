import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuData, getMenusHomepage } from '../services/MenuServie';


// Utility function to strip HTML tags and truncate text
function stripHtmlAndTruncate(html: string, maxLength = 80) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

const MenuListHome = () => {
    const [menus, setMenus] = useState<MenuData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token') || '';
                const data = await getMenusHomepage(token);
                setMenus(data);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách món ăn. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const handleAddToCart = (menu: MenuData) => {
        console.log('Thêm vào giỏ hàng:', menu);
        alert(`Đã thêm "${menu.name}" vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 text-lg animate-pulse">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-8 text-lg font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {menus.map((menu) => (
                    <div
                        key={menu.id}
                        className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                        onClick={() => navigate(`/menu/${menu.slug}`)}
                    >
                        <div className="relative overflow-hidden h-60">
                            <img
                                src={menu.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                alt={menu.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-xl font-bold text-gray-800 truncate">
                                    {menu.name}
                                </h2>
                                <span className="bg-teal-100 text-teal-800 text-sm font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                                    {menu.price.toLocaleString()} VNĐ
                                </span>
                            </div>

                            {/* Đã thay <p> bằng <div> để tránh lỗi hydration */}
                            <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                                <div className="group inline-block relative">
                                    <div className="text-sm text-gray-700 truncate max-w-[200px]">
                                        {menu.description
                                            ? stripHtmlAndTruncate(menu.description)
                                            : 'Không có mô tả'}
                                    </div>
                                    {menu.description && (
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 hidden group-hover:block bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 text-sm rounded-lg p-3 shadow-lg w-max max-w-xs transition">
                                            <div dangerouslySetInnerHTML={{ __html: menu.description }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                {(menu.stock ?? 0) > 0 ? (
                                    <span className="text-green-600 font-medium text-sm">
                                        Còn hàng
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-medium text-sm">
                                        Hết hàng
                                    </span>
                                )}
                                <button
                                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-3 py-1 rounded shadow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(menu);
                                    }}
                                >
                                    + Giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuListHome;
