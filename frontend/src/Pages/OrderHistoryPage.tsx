import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import OrderService, { Order } from '../services/OrderService';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';

    useEffect(() => {
        if (!token) {
            setError('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await OrderService.getOrders(token);
                setOrders(data);
                setError(null);
            } catch (err: any) {
                setError('Không thể tải lịch sử đơn hàng: ' + (err.message || 'Lỗi không xác định'));
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'processing':
                return 'bg-blue-50 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'processing':
                return (
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'cancelled':
                return (
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'processing':
                return 'Đang xử lý';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getDeliveryStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'preparing':
                return 'Đang chuẩn bị';
            case 'delivering':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-medium text-gray-700">Đang tải lịch sử đơn hàng...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-3 text-lg font-medium text-gray-900">{error}</h3>
                            {!token && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Đăng nhập ngay
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    style={{ zIndex: 10000, top: '80px' }}
                />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
                        <p className="mt-1 text-gray-600">Xem lại các đơn hàng bạn đã đặt</p>
                    </div>
                    <button
                        onClick={() => navigate('/menus')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Xem thực đơn
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có đơn hàng nào</h3>
                            <p className="mt-2 text-gray-600">
                                Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món ngay!
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/menus')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Xem thực đơn ngay
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(order.created_at).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusIcon(order.status)}
                                                {getStatusText(order.status)}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    order.delivery_status
                                                )}`}
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                {getDeliveryStatusText(order.delivery_status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Chi tiết đơn hàng</h4>
                                        
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-start"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                                                            {item.menu_item?.image ? (
                                                                <img 
                                                                    src={item.menu_item.image} 
                                                                    alt={item.menu_item.name}
                                                                    className="h-full w-full object-cover object-center"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h5 className="text-sm font-medium text-gray-900">
                                                                {item.menu_item?.name || `Món #${item.menu_id}`}
                                                            </h5>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {item.menu_item?.price?.toLocaleString()} ₫ × {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {(item.quantity * (item.menu_item?.price || 0)).toLocaleString()} ₫
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {order.note && (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Ghi chú</h4>
                                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                                                    {order.note}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-medium text-gray-600">Tổng tiền:</span>
                                                <span className="text-xl font-bold text-teal-600">
                                                    {order.total_price.toLocaleString()} ₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default OrderHistoryPage;