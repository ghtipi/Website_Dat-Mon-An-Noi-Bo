import axios from 'axios';
import { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api';

interface ApiError {
    message: string;
    errors?: {
        [key: string]: string[];
    };
}

interface Menu {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    is_active: boolean;
}

export interface CartItem {
    _id: string;
    menu_id: string;
    quantity: number;
    note?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    menu_item: Menu;
}

interface AddToCartItem {
    menu_id: string;
    quantity: number;
    note?: string;
}

class CartItemService {
    private static handleError(error: AxiosError<ApiError>): never {
        if (error.response) {
            throw new Error(error.response.data.message || 'Có lỗi xảy ra');
        }
        throw new Error('Không thể kết nối tới server');
    }

    static async getCartItems(token: string): Promise<CartItem[]> {
        try {
            const response = await axios.get(`${API_URL}/cart`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError<ApiError>);
        }
    }

    static async addToCart(item: AddToCartItem, token: string): Promise<CartItem> {
        try {
            const response = await axios.post(
                `${API_URL}/cart`,
                item,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError<ApiError>);
        }
    }

    static async updateCartItem(id: string, updates: Partial<CartItem>, token: string): Promise<CartItem> {
        try {
            const response = await axios.put(
                `${API_URL}/cart/${id}`,
                updates,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError<ApiError>);
        }
    }

    static async deleteCartItem(id: string, token: string): Promise<{ message: string }> {
        try {
            const response = await axios.delete(
                `${API_URL}/cart/${id}`,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError<ApiError>);
        }
    }

    static async clearCart(token: string): Promise<{ message: string }> {
        try {
            const response = await axios.delete(
                `${API_URL}/cart`,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError<ApiError>);
        }
    }

    static async getMenuItem(menuId: string, token: string): Promise<Menu> {
        try {
            const response = await axios.get(`${API_URL}/menu-items/${menuId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return {
                _id: response.data._id,
                name: response.data.name,
                price: response.data.price,
                image: response.data.image,
                description: response.data.description,
                is_active: response.data.is_active
            };
        } catch (error) {
            return this.handleError(error as AxiosError<ApiError>);
        }
    }
}

export default CartItemService;