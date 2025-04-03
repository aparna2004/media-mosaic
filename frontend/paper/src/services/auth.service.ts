import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { API_BASE_URL } from '@/config/api';

const AUTH_URL = `${API_BASE_URL}/auth`;

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await axios.post(`${AUTH_URL}/login`, credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data } = await axios.post(`${AUTH_URL}/register`, credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  }
};