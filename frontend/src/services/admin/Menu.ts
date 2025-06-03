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

export const getMenus = async (token: string, filters: MenuFilterParams = {}): Promise<MenuData[]> => {
  try {
    // Build query string from filter parameters
    const params = new URLSearchParams();
    if (filters.category_ids && filters.category_ids.length > 0) {
      // Gửi category_ids dưới dạng chuỗi phân cách bằng dấu phẩy
      params.append('category_ids', filters.category_ids.join(','));
    }
    if (filters.price_min !== undefined) params.append('price_min', filters.price_min.toString());
    if (filters.price_max !== undefined) params.append('price_max', filters.price_max.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await axios.get(`${API_BASE}/menu-items?${params.toString()}`, {
      ...authHeaders(token),
      signal: AbortController ? new AbortController().signal : undefined,
    });

    if (!response.data) {
      throw new Error('Không có dữ liệu trả về từ server');
    }

    // Basic validation before casting
    const data = response.data;
    if (!Array.isArray(data)) {
      throw new Error('Dữ liệu trả về không phải là danh sách món ăn');
    }

    return data as MenuData[];
  } catch (error: any) {
    const message = error.response?.data?.message || 'Lấy danh sách món ăn thất bại';
    throw new Error(message);
  }
};

export const getMenu = async (token: string, id: string): Promise<MenuData> => {
  try {
    const response = await axios.get(`${API_BASE}/menu-items/${id}`, {
      ...authHeaders(token),
      signal: AbortController ? new AbortController().signal : undefined,
    });

    if (!response.data) {
      throw new Error('Không có dữ liệu món ăn trả về từ server');
    }

    // Basic validation
    const data = response.data;
    if (!data.id || !data.name || !Array.isArray(data.category_ids)) {
      throw new Error('Dữ liệu món ăn không hợp lệ');
    }

    return data as MenuData;
  } catch (error: any) {
    const message = error.response?.data?.message || `Lấy thông tin món ăn với ID ${id} thất bại`;
    throw new Error(message);
  }
};

export const createMenu = async (token: string, menuData: MenuData): Promise<MenuData> => {
  try {
    const response = await axios.post(`${API_BASE}/menu-items`, menuData, {
      ...authHeaders(token),
      signal: AbortController ? new AbortController().signal : undefined,
    });

    if (!response.data) {
      throw new Error('Không có dữ liệu trả về từ server');
    }

    // Basic validation
    const data = response.data;
    if (!data.id || !data.name || !Array.isArray(data.category_ids)) {
      throw new Error('Dữ liệu món ăn không hợp lệ');
    }

    return data as MenuData;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Tạo món ăn thất bại';
    throw new Error(message);
  }
};

export const updateMenu = async (token: string, id: string, data: MenuData): Promise<MenuData> => {
  try {
    const response = await axios.put(`${API_BASE}/menu-items/${id}`, data, {
      ...authHeaders(token),
      signal: AbortController ? new AbortController().signal : undefined,
    });

    if (!response.data) {
      throw new Error('Không có dữ liệu trả về từ server');
    }

    // Basic validation
    const responseData = response.data;
    if (!responseData.id || !responseData.name || !Array.isArray(responseData.category_ids)) {
      throw new Error('Dữ liệu món ăn không hợp lệ');
    }

    return responseData as MenuData;
  } catch (error: any) {
    const message = error.response?.data?.message || `Cập nhật món ăn với ID ${id} thất bại`;
    throw new Error(message);
  }
};

export const deleteMenu = async (token: string, id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/menu-items/${id}`, {
      ...authHeaders(token),
      signal: AbortController ? new AbortController().signal : undefined,
    });
  } catch (error: any) {
    const message = error.response?.data?.message || `Xóa món ăn với ID ${id} thất bại`;
    throw new Error(message);
  }
};