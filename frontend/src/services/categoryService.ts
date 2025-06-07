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

  getAllCategoriesMenuPage: async (filters?: CategoryFilter): Promise<Category[]> => {
    try {
      const response = await apiCall('get', '/categories', { params: filters });
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

  
}