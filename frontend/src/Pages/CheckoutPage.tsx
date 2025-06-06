import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import CartItemService, { CartItem } from '../services/CartItemService';
import PaymentService from '../services/PaymentService';
import OrderService from '../services/OrderService';

const CheckoutPage = () => {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('cash');
    const [orderNote, setOrderNote] = useState('');
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const items = await CartItemService.getCartItems(token);
                setCartItems(items);
                if (items.length === 0) {
                    toast.error('Giỏ hàng của bạn đang trống');
                    navigate('/cart');
                }
            } catch (error: any) {
                toast.error(error.message || 'Không thể tải giỏ hàng');
                navigate('/cart');
            }
        };

        fetchCart();
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.menu_item?.price || 0) * item.quantity, 0);
    };

    const handlePayment = async () => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            
            // Create order first
            const orderData = {
                items: cartItems.map(item => ({
                    menu_id: item.menu_id,
                    quantity: item.quantity,
                    note: item.note
                })),
                note: orderNote,
                total_price: calculateTotal()
            };

            console.log('Order data:', orderData);
            const order = await OrderService.createOrder(orderData, token);
            
            if (!order || !order.id) {
                throw new Error('Không thể tạo đơn hàng');
            }

            // Then process payment
            const payment = await PaymentService.pay(order.id, paymentMethod, token);
            
            if (payment) {
                // Clear cart after successful payment
                await CartItemService.clearCart(token);
                setIsPaymentSuccess(true);
                toast.success('Thanh toán thành công! Cảm ơn bạn đã đặt hàng.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error instanceof Error ? error.message : 'Không thể thực hiện thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {isPaymentSuccess ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
                        <h1 className="text-3xl font-bold mb-4 text-green-600">Thanh toán thành công!</h1>
                        <p className="text-lg mb-6">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.</p>
                        <button
                            onClick={handleContinueShopping}
                            className="px-8 py-3 bg-teal-600 text-black rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 mx-auto text-lg font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Tiếp tục chọn món</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                                        className="form-radio text-primary"
                                    />
                                    <span>Tiền mặt</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                                        className="form-radio text-primary"
                                    />
                                    <span>Thẻ tín dụng/ghi nợ</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        value="bank_transfer"
                                        checked={paymentMethod === 'bank_transfer'}
                                        onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
                                        className="form-radio text-primary"
                                    />
                                    <span>Chuyển khoản ngân hàng</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Ghi chú đơn hàng</h2>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                rows={3}
                                placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">{item.menu_item?.name}</h3>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                        <span className="font-medium">
                                            {((item.menu_item?.price || 0) * item.quantity).toLocaleString()} ₫
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-primary">{calculateTotal().toLocaleString()} ₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => navigate('/cart')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Quay lại giỏ hàng
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="px-8 py-3 bg-teal-600 text-black rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-lg font-medium"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span>Thanh toán ngay</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default CheckoutPage;