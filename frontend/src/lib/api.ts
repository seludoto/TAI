import axios from 'axios';
import { User, Chat, ChatWithMessages, Message, AuthResponse, LoginCredentials, RegisterData, MessageCreate } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post('/api/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  createChat: async (title?: string): Promise<Chat> => {
    const response = await api.post('/api/chat/', { title: title || 'New Chat' });
    return response.data;
  },

  getChats: async (): Promise<Chat[]> => {
    const response = await api.get('/api/chat/');
    return response.data;
  },

  getChat: async (chatId: number): Promise<ChatWithMessages> => {
    const response = await api.get(`/api/chat/${chatId}`);
    return response.data;
  },

  sendMessage: async (chatId: number, message: MessageCreate): Promise<Message> => {
    const response = await api.post(`/api/chat/${chatId}/messages`, message);
    return response.data;
  },

  getMessages: async (chatId: number): Promise<Message[]> => {
    const response = await api.get(`/api/chat/${chatId}/messages`);
    return response.data;
  },

  deleteChat: async (chatId: number): Promise<void> => {
    await api.delete(`/api/chat/${chatId}`);
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};