import React, { createContext, useContext, useState, useEffect } from 'react';
import apiCall from '../Api/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
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

  // Khi component mount, lấy user từ localStorage nếu có
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Hàm login gọi API
  const login = async (email: string, password: string) => {
  try {
    const data = await apiCall('post', '/auth/login', { email, password });

    const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name, 
        role: data.user.role || 'user',
        avatar: data.user.avatar || '',
      };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    

    if (data.token) {
      localStorage.setItem('token', data.token);
    }
  } catch (error: any) {
    // xử lý lỗi
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


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
