import axios from 'axios';

export const API_BASE = 'http://localhost:8000/api';

const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  },
});

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  parentId?: number | null;
  slug?: string;
  image?: string;
  status?: string;
}

export const getCategories = async (token: string): Promise<CategoryData[]> => {
  try {
    const response = await axios.get(`${API_BASE}/categories`, authHeaders(token));
    if (!response.data) {
      throw new Error('No data returned from server');
    }
    return response.data as CategoryData[];
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch categories';
    console.error('Error fetching categories:', error);
    throw new Error(message);
  }
};

export const getCategory = async (token: string, id: string): Promise<CategoryData> => {
  try {
    const response = await axios.get(`${API_BASE}/categories/${id}`, authHeaders(token));
    if (!response.data) {
      throw new Error('No category data returned from server');
    }
    return response.data as CategoryData;
  } catch (error: any) {
    const message = error.response?.data?.message || `Failed to fetch category with ID ${id}`;
    console.error('Error fetching category:', error);
    throw new Error(message);
  }
};

export const createCategory = async (token: string, categoryData: CategoryData): Promise<CategoryData> => {
  try {
    const response = await axios.post(`${API_BASE}/categories`, categoryData, authHeaders(token));
    if (!response.data) {
      throw new Error('No data returned from server');
    }
    return response.data as CategoryData;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to create category';
    console.error('Error creating category:', error);
    throw new Error(message);
  }
};

export const updateCategory = async (token: string, id: string, data: CategoryData): Promise<CategoryData> => {
  try {
    const response = await axios.put(`${API_BASE}/categories/${id}`, data, authHeaders(token));
    if (!response.data) {
      throw new Error('No data returned from server');
    }
    return response.data as CategoryData;
  } catch (error: any) {
    const message = error.response?.data?.message || `Failed to update category with ID ${id}`;
    console.error('Error updating category:', error);
    throw new Error(message);
  }
};

export const deleteCategory = async (token: string, id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_BASE}/categories/${id}`, authHeaders(token));
    if (!response.data) {
      throw new Error('No response from server');
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || `Failed to delete category with ID ${id}`;
    console.error('Error deleting category:', error);
    throw new Error(message);
  }
};