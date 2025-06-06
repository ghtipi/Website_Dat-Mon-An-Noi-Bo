import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Payment {
    id: number;
    order_id: number;
    amount: number;
    method: 'cash' | 'card' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed';
    paid_at: string | null;
    created_at: string;
    updated_at: string;
}

class PaymentService {
    static async pay(orderId: number, method: 'cash' | 'card' | 'bank_transfer', token: string): Promise<Payment> {
        try {
            const response = await axios.post(
                `${API_URL}/payments/${orderId}/pay`,
                { method },
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
            console.error('Payment error:', error.response?.data);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Không thể thực hiện thanh toán');
        }
    }

    static async getPayments(token: string): Promise<Payment[]> {
        try {
            const response = await axios.get(`${API_URL}/payments`, {
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
            throw new Error('Không thể lấy danh sách thanh toán');
        }
    }

    static async getPayment(id: number, token: string): Promise<Payment> {
        try {
            const response = await axios.get(`${API_URL}/payments/${id}`, {
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
            throw new Error('Không thể lấy thông tin thanh toán');
        }
    }
}

export default PaymentService; 