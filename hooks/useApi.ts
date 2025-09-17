import { api, removeAuthToken, setAuthToken, type ApiResponse } from '@/lib/api';
import type { LoginResponse, User } from '@/lib/auth';
import { useCallback, useEffect, useState } from 'react';

// Hook para gerenciar autenticação
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      // Aqui você pode fazer uma call para validar o token
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth', {
        email,
        password,
      });

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        setAuthToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: response.error?.message || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };
}

// Hook para fazer requisições API
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T>(
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      endpoint: string,
      data?: unknown,
    ) => {
      setLoading(true);
      setError(null);

      try {
        let response: ApiResponse<T>;

        if (method === 'get' || method === 'delete') {
          response = await api[method]<ApiResponse<T>>(endpoint);
        } else {
          response = await api[method]<ApiResponse<T>>(endpoint, data);
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    request,
    get: <T>(endpoint: string) => request<T>('get', endpoint),
    post: <T>(endpoint: string, data?: unknown) => request<T>('post', endpoint, data),
    put: <T>(endpoint: string, data?: unknown) => request<T>('put', endpoint, data),
    patch: <T>(endpoint: string, data?: unknown) => request<T>('patch', endpoint, data),
    delete: <T>(endpoint: string) => request<T>('delete', endpoint),
  };
}
