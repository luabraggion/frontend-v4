import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Configuração para chamadas de API
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retryAttempts: 3,
} as const;

// Criar instância do axios
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições (adicionar token automaticamente)
axiosInstance.interceptors.request.use(
  (config) => {
    // Tentar pegar token dos cookies (apenas no cliente)
    if (typeof window !== 'undefined') {
      const token = Cookies.get('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para respostas (tratar erros globalmente)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Tratar erro 401 (não autorizado)
    if (error.response?.status === 401) {
      // Remover cookies inválidos
      if (typeof window !== 'undefined') {
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        // Redirecionar para login se necessário
        // window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  },
);

// Headers personalizados para requisições específicas
export function getCustomHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Função utilitária para fazer requisições com configurações padrão
export async function apiRequest<T = unknown>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${error.response?.status || 'Unknown'} - ${message}`);
    }
    throw error;
  }
}

// Métodos de conveniência
export const api = {
  get: <T = unknown>(endpoint: string, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: 'GET', ...config }),

  post: <T = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: 'POST', data, ...config }),

  put: <T = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: 'PUT', data, ...config }),

  patch: <T = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: 'PATCH', data, ...config }),

  delete: <T = unknown>(endpoint: string, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...config }),
};

// Tipos para respostas da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Export da instância do axios para uso direto se necessário
export { axiosInstance };

// Função para definir token manualmente
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    Cookies.set('authToken', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 7,
    });
  }
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Função para remover token
export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    Cookies.remove('authToken');
    Cookies.remove('refreshToken');
  }
  delete axiosInstance.defaults.headers.common['Authorization'];
}
