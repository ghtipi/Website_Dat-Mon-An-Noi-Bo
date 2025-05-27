import React, { createContext, useContext, useState, useEffect } from 'react';
import apiCall from '../Api/axios';

interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user'| 'manager';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Kiểm tra xem có thông tin đăng nhập trong localStorage không
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiCall('post', '/login', { email, password });
      
      const userData = {
        id: data.id,
        email: data.email,
        role: data.role,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Lưu token nếu có
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.error || 'Đăng nhập thất bại');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 