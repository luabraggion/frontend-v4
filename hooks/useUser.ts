'use client';

import { api, ApiResponse } from '@/lib/api';
import { User } from '@/lib/auth';
import { useEffect, useState } from 'react';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar token do localStorage (em produção, use cookies seguros)
      const token = localStorage.getItem('authToken');

      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get<ApiResponse<User>>('/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.error?.message || 'Erro ao carregar usuário');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      setError(null);

      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await api.put<ApiResponse<User>>('/user/me', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.error?.message || 'Erro ao atualizar usuário');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
}
