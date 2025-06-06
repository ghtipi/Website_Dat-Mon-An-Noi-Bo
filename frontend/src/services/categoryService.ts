import apiCall from '../Api/axios';

export const API_BASE = 'http://localhost:8000/api';

export interface Category {
  id: string;
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
      const response = await apiCall('get', '/categories/random', { params: filters });
      // Ensure all categories have default values for optional fields
      return (response as Category[]).map((category) => ({
        ...category,
        description: category.description || 'No description available',
        image: category.image || 'https://via.placeholder.com/100',
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories. Please try again later.');
    }
  },

  getCategoryById: async (id: string): Promise<Category> => {
    try {
      if (!id) {
        throw new Error('Category ID is required');
      }
      const response = await apiCall('get', `/categories/${id}`);
      return {
        ...(response as Category),
        description: response.description || 'No description available',
        image: response.image || 'https://via.placeholder.com/100',
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error(`Failed to fetch category with ID: ${id}`);
    }
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const response = await apiCall('post', '/categories', {
        ...category,
        description: category.description || 'No description available',
        image: category.image || 'https://via.placeholder.com/100',
      });
      return response as Category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category. Please try again.');
    }
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      if (!id) {
        throw new Error('Category ID is required');
      }
      const response = await apiCall('put', `/categories/${id}`, {
        ...category,
        description: category.description || 'No description available',
        image: category.image || 'https://via.placeholder.com/100',
      });
      return response as Category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error(`Failed to update category with ID: ${id}`);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      if (!id) {
        throw new Error('Category ID is required');
      }
      await apiCall('delete', `/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error(`Failed to delete category with ID: ${id}`);
    }
  },
};