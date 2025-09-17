import { api } from '@/lib/api/client';
import type { LoginResponse, User } from '@/lib/auth/types';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken?: string) => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Configuração de cookies para tokens JWT
const COOKIE_CONFIG = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 7, // 7 dias
};

// Store Zustand com persistência
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Ação de login
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<{
            success: boolean;
            data?: LoginResponse;
            error?: { message: string };
          }>('/auth', { email, password });

          if (response.success && response.data) {
            const { user, token, refreshToken, expiresIn } = response.data;

            // Salvar tokens em cookies seguros
            Cookies.set('authToken', token, {
              ...COOKIE_CONFIG,
              expires: expiresIn / (24 * 60 * 60), // converter segundos para dias
            });

            if (refreshToken) {
              Cookies.set('refreshToken', refreshToken, COOKIE_CONFIG);
            }

            // Atualizar estado
            set({
              user,
              token,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { success: true };
          }

          const errorMessage = response.error?.message || 'Erro no login';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro de rede';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Ação de logout
      logout: () => {
        // Remover cookies
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');

        // Limpar estado
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Definir usuário
      setUser: (user: User) => {
        set({ user });
      },

      // Definir token
      setToken: (token: string, refreshToken?: string) => {
        Cookies.set('authToken', token, COOKIE_CONFIG);
        if (refreshToken) {
          Cookies.set('refreshToken', refreshToken, COOKIE_CONFIG);
        }

        set({
          token,
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: true,
        });
      },

      // Limpar erro
      clearError: () => {
        set({ error: null });
      },

      // Renovar autenticação
      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await api.post<{
            success: boolean;
            data?: { token: string; expiresIn: number };
          }>('/auth/refresh', { refreshToken });

          if (response.success && response.data) {
            const { token, expiresIn } = response.data;

            Cookies.set('authToken', token, {
              ...COOKIE_CONFIG,
              expires: expiresIn / (24 * 60 * 60),
            });

            set({ token });
          }
        } catch (error) {
          console.error('Erro ao renovar token:', error);
          get().logout();
        }
      },

      // Verificar autenticação
      checkAuth: async () => {
        const tokenFromCookie = Cookies.get('authToken');
        const refreshTokenFromCookie = Cookies.get('refreshToken');

        if (!tokenFromCookie) {
          get().logout();
          return;
        }

        set({
          token: tokenFromCookie,
          refreshToken: refreshTokenFromCookie || null,
          isAuthenticated: true,
        });

        // Tentar buscar dados do usuário
        try {
          const response = await api.get<{
            success: boolean;
            data?: User;
          }>('/user/me');

          if (response.success && response.data) {
            set({ user: response.data });
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Não persistir tokens no localStorage por segurança
      partialize: (state) => ({
        user: state.user,
        // tokens ficam apenas nos cookies
      }),
    },
  ),
);

// Hook customizado para usar o store
export const useAuth = () => useAuthStore();

// Hook para inicializar autenticação (usar em componentes raiz)
export const useAuthInit = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
};

// Seletores otimizados para evitar re-renders desnecessários
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthStatus = () =>
  useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));
