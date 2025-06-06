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
                return 'bg-yellow-100 text-yellow-800 ring-yellow-500';
            case 'processing':
                return 'bg-blue-100 text-blue-800 ring-blue-500';
            case 'completed':
                return 'bg-green-100 text-green-800 ring-green-500';
            case 'cancelled':
                return 'bg-red-100 text-red-800 ring-red-500';
            default:
                return 'bg-gray-100 text-gray-800 ring-gray-500';
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h2>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h2>
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-base text-red-700 font-medium">{error}</p>
                        </div>
                        {!token && (
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-6 bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium"
                            >
                                Đăng nhập ngay
                            </button>
                        )}
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
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-teal-500 hover:text-teal-600 font-medium transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Xem thực đơn
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-lg shadow-md">
                        <div className="mx-auto w-40 h-40 text-gray-300 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chưa có đơn hàng nào</h3>
                        <p className="text-gray-600 mb-6 text-base">
                            Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món ngay!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2 mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Xem thực đơn ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleString('vi-VN', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${getStatusColor(
                                                    order.delivery_status
                                                )}`}
                                            >
                                                {getDeliveryStatusText(order.delivery_status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">
                                                            {item.quantity}x
                                                        </span>
                                                        <span className="text-gray-700">
                                                            {item.menu_item?.name || `Món #${item.menu_id}`}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-900 font-medium">
                                                        {(item.quantity * (item.menu_item?.price || 0)).toLocaleString()} ₫
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {order.note && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Ghi chú:</span> {order.note}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                            <span className="text-lg font-semibold text-teal-600">
                                                {order.total_price.toLocaleString()} ₫
                                            </span>
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