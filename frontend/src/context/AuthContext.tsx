import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name?: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, isAdmin = false) => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? '/api/v1/admin/login' : '/api/v1/usuarios/login';
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      const response = await api.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      // Buscar dados do usuário após login
      const userEndpoint = isAdmin ? '/api/v1/admin/me' : '/api/v1/usuarios/me';
      const userResp = await api.get(userEndpoint, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      localStorage.setItem('user', JSON.stringify(userResp.data));
      setUser(userResp.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 