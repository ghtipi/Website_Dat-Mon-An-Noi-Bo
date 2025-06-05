import axios from 'axios';

export const API_BASE = 'http://localhost:8000/api';


const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  },
});

export interface MenuData {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_ids: string[];
  slug: string;
  image?: string;
  status?: string;
  stock?: number;
}

export interface MenuFilterParams {
  category_ids?: string[];
  price_min?: number;
  price_max?: number;
  status?: string;
  search?: string;
  price_range?: string;
}

//lấy danh sách menu cho trang chủ
export const getMenusHomepage = async (token: string): Promise<MenuData[]> => {
    try {
        const response = await axios.get(`${API_BASE}/menu/random`, authHeaders(token));
        
        if (!response.data) {
        throw new Error('Không có dữ liệu trả về từ server');
        }

        const data = response.data;
        if (!Array.isArray(data)) {
        throw new Error('Dữ liệu trả về không phải là danh sách món ăn');
        }
    
        return data.map((item: any) => ({
        ...item,
        image: item.image || 'https://via.placeholder.com/300',
        description: item.description || '',
        status: item.status || 'active',
        stock: item.stock ?? 0,
        }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách menu:', error);
        throw error;
    }
    }



