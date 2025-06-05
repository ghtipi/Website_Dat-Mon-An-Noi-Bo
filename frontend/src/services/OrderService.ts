import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface OrderItem {
    menu_id: string;
    quantity: number;
    note?: string;
}

export interface Order {
    id: number;
    user_id: number;
    items: OrderItem[];
    total_price: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    delivery_status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
    order_time: string;
    note?: string;
    created_at: string;
    updated_at: string;
}

class OrderService {
    static async createOrder(orderData: {
        items: OrderItem[];
        note?: string;
        total_price: number;
    }, token: string): Promise<Order> {
        try {
            const response = await axios.post(
                `${API_URL}/orders`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Create order error:', error.response?.data);
            if (error.response?.data?.errors) {
                throw new Error(Object.values(error.response.data.errors).flat().join(', '));
            }
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Không thể tạo đơn hàng');
        }
    }

    static async getOrders(token: string): Promise<Order[]> {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Không thể lấy danh sách đơn hàng');
        }
    }

    static async getOrder(id: number, token: string): Promise<Order> {
        try {
            const response = await axios.get(`${API_URL}/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Không thể lấy thông tin đơn hàng');
        }
    }
}

export default OrderService; 