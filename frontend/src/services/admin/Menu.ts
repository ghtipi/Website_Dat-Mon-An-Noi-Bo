import axios from 'axios';

export const API_BASE = 'http://localhost:8000/api/admin';

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
  category_id: string;
  image?: string;
  status?: string;
  stock?: number;
}


export const getMenus = async (token: string): Promise<MenuData[]> => {
  try {
    const response = await axios.get(`${API_BASE}/menu-items`, authHeaders(token));
    if (!response.data) {
      throw new Error('Không có dữ liệu trả về từ server');
    }
    return response.data as MenuData[];
  } catch (error: any) {
    const message = error.response?.data?.message || 'Lấy danh sách món ăn thất bại';
    console.error('Lỗi khi lấy danh sách món ăn:', error);
    throw new Error(message);
  }
};

export const getMenu = async (token: string, id: string): Promise<MenuData> => {
  try {
    const response = await axios.get(`${API_BASE}/menu-items/${id}`, authHeaders(token));
    if (!response.data) {
      throw new Error('Không có dữ liệu món ăn trả về từ server');
    }
    return response.data as MenuData;
  } catch (error: any) {
    const message = error.response?.data?.message || `Lấy thông tin món ăn với ID ${id} thất bại`;
    console.error('Lỗi khi lấy món ăn:', error);
    throw new Error(message);
  }
};

export const createMenu = async (token: string, menuData: MenuData): Promise<MenuData> => {
  try {
    const response = await axios.post(`${API_BASE}/menu-items`, menuData, authHeaders(token));
    if (!response.data) {
      throw new Error('Không có dữ liệu trả về từ server');
    }
    return response.data as MenuData;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Tạo món ăn thất bại';
    console.error('Lỗi khi tạo món ăn:', error);
    throw new Error(message);
  }
};

export const updateMenu = async (token: string, id: string, data: MenuData): Promise<MenuData> => {
  try {
    const response = await axios.put(`${API_BASE}/menu-items/${id}`, data, authHeaders(token));
    if (!response.data) {
      throw new Error('Không có dữ liệu trả về từ server');
    }
    return response.data as MenuData;
  } catch (error: any) {
    const message = error.response?.data?.message || `Cập nhật món ăn với ID ${id} thất bại`;
    console.error('Lỗi cập nhật món ăn:', error);
    throw new Error(message);
  }
};

export const deleteMenu = async (token: string, id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/menu-items/${id}`, authHeaders(token));
  } catch (error: any) {
    const message = error.response?.data?.message || `Xóa món ăn với ID ${id} thất bại`;
    console.error('Lỗi khi xóa món ăn:', error);
    throw new Error(message);
  }
};