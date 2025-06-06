import axios from 'axios';

export const API_BASE = 'http://localhost:8000/api';

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  default_address?: string;
  avatar?: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  default_address?: string;
  role?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  default_address?: string;
  avatar?: string;
  role?: string;
  status?: string;
}

// Lấy danh sách người dùng
export const getUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng');
  }
};

// Lấy thông tin một người dùng
export const getUser = async (token: string, id: string) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng');
  }
};

// Tạo người dùng mới
export const createUser = async (token: string, userData: UserCreateData) => {
  try {
    const response = await axios.post(`${API_BASE}/admin/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi tạo người dùng mới');
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (token: string, id: string, userData: UserUpdateData) => {
  try {
    const response = await axios.put(`${API_BASE}/admin/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin người dùng');
  }
};

// Xóa người dùng
export const deleteUser = async (token: string, id: string) => {
  try {
    const response = await axios.delete(`${API_BASE}/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
  }
};

// Cập nhật trạng thái người dùng
export const updateUserStatus = async (token: string, id: string, status: string) => {
  try {
    const response = await axios.put(`${API_BASE}/admin/users/${id}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái người dùng');
  }
};

// Cập nhật vai trò người dùng
export const updateUserRole = async (token: string, id: string, role: string) => {
  try {
    const response = await axios.put(`${API_BASE}/admin/users/${id}/role`, { role }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật vai trò người dùng');
  }
};
