import axios from 'axios';

export const API_BASE = 'http://localhost:8000/api';

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

// ✅ Interface phân trang:
export interface PaginatedMenuResponse {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: MenuData[];
}

// ✅ Gọi menu-page có phân trang
export const getMenuPage = async (
  page = 1,
  perPage = 12,
  filters: MenuFilterParams = {}
): Promise<PaginatedMenuResponse> => {
  try {
    const response = await axios.get(`${API_BASE}/menu-page`, {
      params: {
        page,
        per_page: perPage,
        ...filters,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const raw = response.data;

    return {
      ...raw,
      data: raw.data.map((item: any) => ({
        ...item,
        image: item.image || 'https://via.placeholder.com/300',
        description: item.description || '',
        status: item.status || 'active',
        stock: item.stock ?? 0,
      })),
    };
  } catch (error) {
    console.error('Lỗi khi lấy menu-page:', error);
    throw error;
  }
};

// Lấy danh sách ngẫu nhiên cho homepage
export const getMenusHomepage = async (token: string): Promise<MenuData[]> => {
  try {
    const response = await axios.get(`${API_BASE}/menu/random`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

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
};

// Lọc menu (không cần token)
export const MenuFilters = async (params: MenuFilterParams): Promise<MenuData[]> => {
  try {
    const response = await axios.get(`${API_BASE}/menufilters`, {
      params,
      headers: {
        Accept: 'application/json',
      },
    });

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
    console.error('Lỗi khi lọc menu:', error);
    throw error;
  }
};