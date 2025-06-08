import axios, { AxiosError } from 'axios';
import { API_BASE } from '../config/api';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  orderChangePercent: number;
  revenueChangePercent: number;
  userChangePercent: number;
  productChangePercent: number;
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  newUsers: number;
  recentOrders: {
    id: string;
    customerName: string;
    products: string;
    totalAmount: number;
    status: string;
    orderDate: string;
  }[];
}

export interface TimeRange {
  startDate: string;
  endDate: string;
}

interface ErrorResponse {
  message: string;
}

class DashboardService {
  private baseUrl = `${API_BASE}/admin/dashboard`;

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      if (axiosError.response?.status === 403) {
        throw new Error('Bạn không có quyền truy cập vào tính năng này.');
      }
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error('Có lỗi xảy ra khi tải dữ liệu thống kê.');
  }

  async getAdminStats(token: string, timeRange?: TimeRange): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: timeRange,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getManagerStats(token: string, timeRange?: TimeRange): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/manager`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: timeRange,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Thêm các phương thức mới cho thống kê chi tiết
  async getDailyStats(token: string, date: string): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/daily`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: { date },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMonthlyStats(token: string, month: string, year: string): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/monthly`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getYearlyStats(token: string, year: string): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/yearly`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: { year },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new DashboardService(); 