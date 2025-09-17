/**
 * Tipos relacionados a campanhas
 */
export interface Campaign {
  id: string;
  title: string;
  description?: string;
  type: 'sorteio' | 'roleta' | 'quiz' | 'promocao';
  status: 'rascunho' | 'ativo' | 'pausado' | 'concluido' | 'agendado';
  startDate: string;
  endDate: string;
  settings: CampaignSettings;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSettings {
  maxParticipants?: number;
  requireAuth: boolean;
  collectData: string[];
  prizes: Prize[];
  rules?: string;
}

export interface Prize {
  id: string;
  name: string;
  description?: string;
  value?: number;
  quantity: number;
  image?: string;
  winningChance: number;
}

export interface CreateCampaignRequest {
  title: string;
  description?: string;
  type: Campaign['type'];
  startDate: string;
  endDate: string;
  settings: CampaignSettings;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  status?: Campaign['status'];
  startDate?: string;
  endDate?: string;
  settings?: Partial<CampaignSettings>;
}

export interface CampaignFilters {
  type?: Campaign['type'];
  status?: Campaign['status'];
  createdBy?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
