import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  default_address?: string;
  avatar?: string;
  role: string;
  status: string;
}

class UserService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getProfile(): Promise<UserProfile> {
    const response = await axios.get(`${API_URL}/profile`, this.getAuthHeader());
    return response.data.data;
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.put(
      `${API_URL}/profile`,
      data,
      this.getAuthHeader()
    );
    return response.data.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await axios.put(
      `${API_URL}/change-password`,
      {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword
      },
      this.getAuthHeader()
    );
  }
}

export default new UserService(); 