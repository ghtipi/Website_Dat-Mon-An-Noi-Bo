import apiCall from '../Api/axios';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status?: boolean;
  parent_id?: string;
}

export interface CategoryFilter {
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const categoryService = {
  getAllCategories: async (filters?: CategoryFilter): Promise<Category[]> => {
    try {
      const response = await apiCall('get', '/categories', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await apiCall('get', `/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  createCategory: async (category: Omit<Category, '_id'>): Promise<Category> => {
    try {
      const response = await apiCall('post', '/categories', category);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      const response = await apiCall('put', `/categories/${id}`, category);
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await apiCall('delete', `/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
