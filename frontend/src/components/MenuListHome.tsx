import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuData, getMenusHomepage } from '../services/MenuServie';
import Tooltip from './Tooltip'; // Giả sử file Tooltip nằm cùng thư mục

function stripHtmlAndTruncate(html: string, maxLength = 20) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

const MenuListHome = () => {
    const [menus, setMenus] = useState<MenuData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredMenu, setHoveredMenu] = useState<MenuData | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 }); // State lưu vị trí chuột

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
                setError('Không thể tải danh sách món ăn.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const handleAddToCart = (e: React.MouseEvent, menu: MenuData) => {
        e.stopPropagation();
        alert(`Đã thêm "${menu.name}" vào giỏ hàng!`);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // Cập nhật vị trí chuột
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                        <div className="h-48 bg-gray-100 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-8 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Danh Sách Món Ăn
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => (
                    <div
                        key={menu.id}
                        className="group bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer relative"
                        onClick={() => navigate(`/menu/${menu.slug}`)}
                        onMouseEnter={() => setHoveredMenu(menu)}
                        onMouseLeave={() => setHoveredMenu(null)}
                        onMouseMove={handleMouseMove} // Lắng nghe sự kiện di chuột
                    >
                        <div className="relative h-48">
                            <img
                                src={menu.image || 'https://via.placeholder.com/300'}
                                alt={menu.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1" title={menu.name}>
                                    {menu.name}
                                </h3>
                                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded">
                                    {menu.price.toLocaleString()} ₫
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-gray-600 text-sm line-clamp-1">
                                    {menu.description ? stripHtmlAndTruncate(menu.description, 20) : 'Không có mô tả'}
                                </p>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${menu.stock ? 'text-green-600' : 'text-red-600'}`}>
                                    {menu.stock ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                                <button
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        menu.stock
                                            ? 'bg-teal-500 hover:bg-teal-600 text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                    onClick={(e) => menu.stock && handleAddToCart(e, menu)}
                                    disabled={!menu.stock}
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tích hợp Tooltip */}
            {hoveredMenu && (
                <Tooltip
                    x={tooltipPos.x}
                    y={tooltipPos.y}
                    content={
                        <>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {hoveredMenu.name}
                            </h4>
                            <p className="text-sm text-gray-700">
                                {hoveredMenu.description
                                    ? stripHtmlAndTruncate(hoveredMenu.description, 200)
                                    : 'Không có mô tả'}
                            </p>
                        </>
                    }
                    visible={!!hoveredMenu}
                />
            )}
        </div>
    );
};

export default MenuListHome;