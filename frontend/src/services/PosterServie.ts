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

export const getposterrow = async (token: string): Promise<Poster[]> => {
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
    return posters.map((poster: Poster) => ({
      ...poster,
      image: poster.image || 'https://via.placeholder.com/300',
      description: poster.description || '',
      position: poster.position ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching posters:', error);
    throw error;
  }
}