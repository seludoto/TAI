export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  programming_language?: string;
  created_at: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface MessageCreate {
  content: string;
  programming_language?: string;
}