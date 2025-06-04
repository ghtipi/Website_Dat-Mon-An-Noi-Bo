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
  image_url: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreatePosterData {
  title: string;
  image_url: string;
  status: 'active' | 'inactive';
}

export interface UpdatePosterData {
  title?: string;
  image_url?: string;
  status?: 'active' | 'inactive';
}

const getPosters = async (token: string): Promise<Poster[]> => {
  try {
    const response = await axios.get(`${API_BASE}/posters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPoster = async (token: string, id: string): Promise<Poster> => {
  try {
    const response = await axios.get(`${API_BASE}/posters/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createPoster = async (token: string, data: CreatePosterData): Promise<Poster> => {
  try {
    const response = await axios.post(`${API_BASE}/admin/posters`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePoster = async (token: string, id: string, data: UpdatePosterData): Promise<Poster> => {
  try {
    const response = await axios.put(`${API_BASE}/admin/posters/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deletePoster = async (token: string, id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/admin/posters/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

const posterService = {
  getPosters,
  getPoster,
  createPoster,
  updatePoster,
  deletePoster,
};

export default posterService;
