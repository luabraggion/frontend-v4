import { api } from '@/lib/api/client';
import type {
  Campaign,
  CampaignFilters,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from '@/lib/api/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CampaignState {
  // Estado
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  filters: CampaignFilters;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;

  // Ações
  fetchCampaigns: () => Promise<void>;
  fetchCampaignById: (id: string) => Promise<void>;
  createCampaign: (data: CreateCampaignRequest) => Promise<{ success: boolean; error?: string }>;
  updateCampaign: (
    id: string,
    data: UpdateCampaignRequest,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  setFilters: (filters: Partial<CampaignFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  clearError: () => void;
  reset: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      campaigns: [],
      currentCampaign: null,
      filters: {},
      isLoading: false,
      error: null,
      totalCount: 0,
      page: 1,
      pageSize: 10,

      // Buscar campanhas
      fetchCampaigns: async () => {
        set({ isLoading: true, error: null });

        try {
          const { filters, page, pageSize } = get();
          const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...Object.fromEntries(
              Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
            ),
          });

          const response = await api.get<{
            success: boolean;
            data?: { campaigns: Campaign[]; totalCount: number };
            error?: { message: string };
          }>(`/campaigns?${queryParams}`);

          if (response.success && response.data) {
            set({
              campaigns: response.data.campaigns,
              totalCount: response.data.totalCount,
              isLoading: false,
            });
          } else {
            set({
              error: response.error?.message || 'Erro ao buscar campanhas',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro de rede',
            isLoading: false,
          });
        }
      },

      // Buscar campanha por ID
      fetchCampaignById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.get<{
            success: boolean;
            data?: Campaign;
            error?: { message: string };
          }>(`/campaigns/${id}`);

          if (response.success && response.data) {
            set({
              currentCampaign: response.data,
              isLoading: false,
            });
          } else {
            set({
              error: response.error?.message || 'Erro ao buscar campanha',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro de rede',
            isLoading: false,
          });
        }
      },

      // Criar campanha
      createCampaign: async (data: CreateCampaignRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<{
            success: boolean;
            data?: Campaign;
            error?: { message: string };
          }>('/campaigns', data);

          if (response.success && response.data) {
            const newCampaign = response.data;
            set((state) => ({
              campaigns: [newCampaign, ...state.campaigns],
              totalCount: state.totalCount + 1,
              isLoading: false,
            }));
            return { success: true };
          } else {
            const errorMessage = response.error?.message || 'Erro ao criar campanha';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro de rede';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Atualizar campanha
      updateCampaign: async (id: string, data: UpdateCampaignRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.put<{
            success: boolean;
            data?: Campaign;
            error?: { message: string };
          }>(`/campaigns/${id}`, data);

          if (response.success && response.data) {
            const updatedCampaign = response.data;
            set((state) => ({
              campaigns: state.campaigns.map((campaign) =>
                campaign.id === id ? updatedCampaign : campaign,
              ),
              currentCampaign:
                state.currentCampaign?.id === id ? updatedCampaign : state.currentCampaign,
              isLoading: false,
            }));
            return { success: true };
          } else {
            const errorMessage = response.error?.message || 'Erro ao atualizar campanha';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro de rede';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Deletar campanha
      deleteCampaign: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.delete<{
            success: boolean;
            error?: { message: string };
          }>(`/campaigns/${id}`);

          if (response.success) {
            set((state) => ({
              campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
              totalCount: state.totalCount - 1,
              currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
              isLoading: false,
            }));
            return { success: true };
          } else {
            const errorMessage = response.error?.message || 'Erro ao deletar campanha';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro de rede';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Definir filtros
      setFilters: (newFilters: Partial<CampaignFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          page: 1, // Resetar página ao filtrar
        }));
      },

      // Definir página
      setPage: (page: number) => {
        set({ page });
      },

      // Definir tamanho da página
      setPageSize: (pageSize: number) => {
        set({ pageSize, page: 1 });
      },

      // Limpar erro
      clearError: () => {
        set({ error: null });
      },

      // Resetar estado
      reset: () => {
        set({
          campaigns: [],
          currentCampaign: null,
          filters: {},
          error: null,
          totalCount: 0,
          page: 1,
        });
      },
    }),
    {
      name: 'campaign-storage',
      storage: createJSONStorage(() => localStorage),
      // Persistir apenas filtros e paginação
      partialize: (state) => ({
        filters: state.filters,
        page: state.page,
        pageSize: state.pageSize,
      }),
    },
  ),
);

// Hooks seletores otimizados
export const useCampaigns = () => useCampaignStore((state) => state.campaigns);
export const useCampaignLoading = () => useCampaignStore((state) => state.isLoading);
export const useCampaignError = () => useCampaignStore((state) => state.error);
export const useCurrentCampaign = () => useCampaignStore((state) => state.currentCampaign);
export const useCampaignPagination = () =>
  useCampaignStore((state) => ({
    page: state.page,
    pageSize: state.pageSize,
    totalCount: state.totalCount,
  }));
