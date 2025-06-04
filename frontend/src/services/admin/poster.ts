import axios from 'axios';

export const API_BASE = 'http://localhost:8000/api';

const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  },
});

export interface Poster {
  id: string;
  title: string;
  image: string;
  status: 'active' | 'inactive';
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePosterData {
  title: string;
  image?: string;
  status: 'active' | 'inactive';
  description?: string;
  position?: number;
}

export interface UpdatePosterData {
  title?: string;
  image?: string;
  status?: 'active' | 'inactive';
  description?: string;
  position?: number;
}

export const posterService = {
  getPosters: async (token: string): Promise<Poster[]> => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      const response = await axios.get(`${API_BASE}/posters`, authHeaders(token));
      const posters = response.data;
      if (!Array.isArray(posters)) {
        console.error('API did not return an array:', posters);
        throw new Error('Invalid API response: Expected an array of posters');
      }
      const validPosters = posters.map((poster: Poster) => {
        if (!poster.id) {
          console.warn('Poster with missing ID:', poster);
          throw new Error('Invalid poster data: Missing ID');
        }
        return {
          ...poster,
          image: poster.image || 'https://via.placeholder.com/300',
          description: poster.description || '',
          position: poster.position ?? 0,
        };
      });
      const ids = validPosters.map((poster: Poster) => poster.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.error('Duplicate poster IDs detected:', ids);
        throw new Error('Invalid poster data: Duplicate IDs found');
      }
      return validPosters;
    } catch (error: any) {
      console.error('Error fetching posters:', error);
      throw new Error(error.message || 'Failed to fetch posters. Please try again later.');
    }
  },

  getPoster: async (token: string, id: string): Promise<Poster> => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      if (!id) {
        throw new Error('Poster ID is required');
      }
      const response = await axios.get(`${API_BASE}/posters/${id}`, authHeaders(token));
      const poster = response.data.data || response.data; // Handle nested data
      if (!poster.id) {
        console.error('Poster with missing ID:', poster);
        throw new Error('Invalid poster data: Missing ID');
      }
      return {
        ...poster,
        image: poster.image || 'https://via.placeholder.com/300',
        description: poster.description || '',
        position: poster.position ?? 0,
      };
    } catch (error: any) {
      console.error('Error fetching poster:', error);
      throw new Error(`Failed to fetch poster with ID: ${id}`);
    }
  },

  createPoster: async (token: string, data: CreatePosterData): Promise<Poster> => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      const response = await axios.post(
        `${API_BASE}/posters`,
        {
          ...data,
          image: data.image || 'https://via.placeholder.com/300',
          description: data.description || '',
          position: data.position ?? 0,
        },
        authHeaders(token)
      );
      const newPoster = response.data.data || response.data; // Handle nested data
      if (!newPoster.id) {
        console.error('Created poster with missing ID:', newPoster);
        throw new Error('Invalid poster data: Missing ID');
      }
      return newPoster;
    } catch (error: any) {
      console.error('Error creating poster:', error);
      if (error.response?.status === 404) {
        throw new Error('Poster creation endpoint not found. Please check the server configuration.');
      }
      if (error.response?.status === 403) {
        throw new Error('Unauthorized: Admin access required to create a poster.');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid data: Please check title, image, and status fields.');
      }
      throw new Error('Failed to create poster. Please try again.');
    }
  },

  updatePoster: async (token: string, id: string, data: UpdatePosterData): Promise<Poster> => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      if (!id) {
        throw new Error('Poster ID is required');
      }
      const response = await axios.put(
        `${API_BASE}/posters/${id}`,
        {
          ...data,
          image: data.image || 'https://via.placeholder.com/300',
          description: data.description || '',
          position: data.position ?? 0,
        },
        authHeaders(token)
      );
      const updatedPoster = response.data.data || response.data; // Handle nested data
      if (!updatedPoster.id) {
        console.error('Updated poster with missing ID:', updatedPoster);
        throw new Error('Invalid poster data: Missing ID');
      }
      return {
        ...updatedPoster,
        id: updatedPoster.id || id, // Use provided ID as fallback
        image: updatedPoster.image || 'https://via.placeholder.com/300',
        description: updatedPoster.description || '',
        position: updatedPoster.position ?? 0,
      };
    } catch (error: any) {
      console.error('Error updating poster:', error);
      if (error.response?.status === 403) {
        throw new Error('Unauthorized: Admin access required to update a poster.');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid data: Please check updated fields.');
      }
      throw new Error(`Failed to update poster with ID: ${id}`);
    }
  },

  deletePoster: async (token: string, id: string): Promise<void> => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      if (!id) {
        throw new Error('Poster ID is required');
      }
      await axios.delete(`${API_BASE}/posters/${id}`, authHeaders(token));
    } catch (error: any) {
      console.error('Error deleting poster:', error);
      if (error.response?.status === 403) {
        throw new Error('Unauthorized: Admin access required to delete a poster.');
      }
      throw new Error(`Failed to delete poster with ID: ${id}`);
    }
  },
};

export default posterService;