import { useEffect, useState } from 'react';
import CartItemService, { CartItem } from '../services/CartItemService';
import Layout from '../components/Layout/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [cartNote, setCartNote] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token') || '';

    // Fetch cart items
    useEffect(() => {
        if (!token) {
            setError('Vui lòng đăng nhập để xem giỏ hàng.');
            setLoading(false);
            return;
        }

        const fetchCart = async () => {
            try {
                setLoading(true);
                const cartItems = await CartItemService.getCartItems(token);
                setCart(cartItems);
                if (cartItems.length > 0 && cartItems[0].note) {
                    setCartNote(cartItems[0].note);
                }
                setError(null);
            } catch (err: any) {
                setError('Không thể tải giỏ hàng: ' + (err.message || 'Lỗi không xác định'));
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Update quantity
    const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
        if (!item._id) {
            toast.error('Sản phẩm không tồn tại.');
            return;
        }

        if (newQuantity === 0) {
            await handleDeleteItem(item);
            return;
        }

        if (newQuantity < 0) {
            toast.error('Số lượng không hợp lệ.');
            return;
        }

        try {
            setCart(prevCart => prevCart.map(cartItem => 
                cartItem._id === item._id ? { ...cartItem, quantity: newQuantity } : cartItem
            ));

            setUpdatingItems(prev => ({ ...prev, [item._id]: true }));
            const updatedItem = await CartItemService.updateCartItem(item._id, { quantity: newQuantity }, token);
            
            setCart(prevCart => prevCart.map(cartItem => 
                cartItem._id === item._id ? updatedItem : cartItem
            ));
            
            toast.success(`Cập nhật số lượng "${item.menu_item?.name}" thành công!`);
        } catch (error: any) {
            setCart(prevCart => prevCart.map(cartItem => 
                cartItem._id === item._id ? { ...cartItem, quantity: item.quantity } : cartItem
            ));
            toast.error(error.message || 'Không thể cập nhật số lượng.');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [item._id]: false }));
        }
    };

    // Handle quantity change from input
    const handleQuantityChange = (item: CartItem, value: string) => {
        const newQuantity = parseInt(value) || 0;
        handleUpdateQuantity(item, newQuantity);
    };

    // Delete item
    const handleDeleteItem = async (item: CartItem) => {
        if (!item._id) {
            toast.error('Sản phẩm không tồn tại.');
            return;
        }

        try {
            setUpdatingItems(prev => ({ ...prev, [item._id]: true }));
            await CartItemService.deleteCartItem(item._id, token);
            setCart(prevCart => prevCart.filter(cartItem => cartItem._id !== item._id));
            toast.success(`Đã xóa "${item.menu_item?.name}" khỏi giỏ hàng!`);
        } catch (error: any) {
            toast.error(error.message || 'Không thể xóa sản phẩm.');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [item._id]: false }));
        }
    };

    // Clear cart
    const handleClearCart = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            return;
        }

        try {
            setLoading(true);
            await CartItemService.clearCart(token);
            setCart([]);
            setCartNote('');
            toast.success('Đã xóa toàn bộ giỏ hàng!');
        } catch (error: any) {
            toast.error(error.message || 'Không thể xóa giỏ hàng.');
        } finally {
            setLoading(false);
        }
    };

    // Update note for all items
    const updateAllItemsNote = async () => {
        try {
            setLoading(true);
            const updatePromises = cart.map(item => 
                item._id ? CartItemService.updateCartItem(item._id, { note: cartNote }, token) : Promise.resolve()
            );
            await Promise.all(updatePromises);
            const updatedCart = await CartItemService.getCartItems(token);
            setCart(updatedCart);
            toast.success('Cập nhật ghi chú thành công!');
        } catch (error: any) {
            toast.error(error.message || 'Không thể cập nhật ghi chú.');
        } finally {
            setLoading(false);
        }
    };

    // Proceed to checkout
    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error('Giỏ hàng của bạn đang trống.');
            return;
        }

        if (!token) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            await updateAllItemsNote();
            navigate('/checkout');
        } catch (error: any) {
            toast.error(error.message || 'Không thể tiến hành thanh toán.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate total
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.menu_item?.price || 0) * item.quantity, 0);
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Giỏ hàng của bạn</h2>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Giỏ hàng của bạn</h2>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                    {!token && (
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Đăng nhập ngay
                        </button>
                    )}
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h2>
                    <button
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span>Tiến hành thanh toán</span>
                            </>
                        )}
                    </button>
                </div>
                
                {cart.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h3>
                        <p className="text-gray-500 mb-6">Hãy khám phá thực đơn và thêm món ngon vào giỏ hàng nhé!</p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Xem thực đơn
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items - Left Side */}
                        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                <div className="col-span-5">Sản phẩm</div>
                                <div className="col-span-2 text-center">Đơn giá</div>
                                <div className="col-span-2 text-center">Số lượng</div>
                                <div className="col-span-2 text-center">Thành tiền</div>
                                <div className="col-span-1"></div>
                            </div>
                            
                            <div className="divide-y divide-gray-200">
                                {cart.map((item) => (
                                    <div key={`${item._id}-${item.menu_id}`} className="grid grid-cols-12 px-4 py-6 md:px-6 hover:bg-gray-50 transition-colors">
                                        {/* Product Info */}
                                        <div className="col-span-12 md:col-span-5 mb-4 md:mb-0">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                                                    <img
                                                        src={item.menu_item?.image || 'https://via.placeholder.com/80'}
                                                        alt={item.menu_item?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-sm font-medium text-gray-900">{item.menu_item?.name || 'Unknown Item'}</h3>
                                                    <div className="mt-1 text-sm text-gray-500 md:hidden">{(item.menu_item?.price || 0).toLocaleString()} ₫</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Price - Desktop */}
                                        <div className="hidden md:flex col-span-2 items-center justify-center">
                                            <div className="text-sm text-gray-900">{(item.menu_item?.price || 0).toLocaleString()} ₫</div>
                                        </div>
                                        
                                        {/* Quantity */}
                                        <div className="col-span-7 md:col-span-2 flex items-center">
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updatingItems[item._id]}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="w-12 text-center border-t border-b border-gray-300 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                                                    min="0"
                                                    max="99"
                                                    disabled={updatingItems[item._id]}
                                                />
                                                <button
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    disabled={item.quantity >= 99 || updatingItems[item._id]}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Total */}
                                        <div className="col-span-3 md:col-span-2 flex items-center justify-end md:justify-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                {((item.menu_item?.price || 0) * item.quantity).toLocaleString()} ₫
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="col-span-2 md:col-span-1 flex items-center justify-end">
                                            <button
                                                onClick={() => handleDeleteItem(item)}
                                                disabled={updatingItems[item._id]}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                                                title="Xóa sản phẩm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Order Summary - Right Side */}
                        <div className="lg:w-1/3 bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div>
                                    <label htmlFor="cartNote" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng</label>
                                    <textarea
                                        id="cartNote"
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Ghi chú cho toàn bộ đơn hàng (nếu có)"
                                        value={cartNote}
                                        onChange={(e) => setCartNote(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="text-gray-900">{calculateTotal().toLocaleString()} ₫</span>
                                </div>
                                
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="text-gray-900">0 ₫</span>
                                </div>
                                
                                <div className="flex justify-between text-lg font-medium">
                                    <span>Tổng cộng:</span>
                                    <span className="text-primary">{calculateTotal().toLocaleString()} ₫</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading || cart.length === 0}
                                    className="w-full px-6 py-3 bg-teal-600 text-black rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span>Tiến hành thanh toán</span>
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={handleClearCart}
                                    disabled={loading}
                                    className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Xóa toàn bộ giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CartPage;