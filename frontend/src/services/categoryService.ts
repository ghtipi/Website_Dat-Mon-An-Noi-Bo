import apiCall from '../Api/axios';

export interface Category {
  id: number|string;
  name: string;
  slug: string;
}

export interface CategoryFilter {
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiCall('get', '/categories/random');
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

};
