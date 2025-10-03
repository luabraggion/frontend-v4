'use client';

import type { Premio } from '@/components/ui/table-premios';
import React, { createContext, useContext, useMemo, useState } from 'react';

// ============================================================
// TYPES - Define todos os dados do wizard
// ============================================================

// Etapa 1: Dados Básicos
export type DadosBasicos = {
  tipoCampanha?: string;
  titulo?: string;
  dataInicioCampanha?: string | Date;
  dataFimCampanha?: string | Date;
  dataInicioVisualizacao?: string | Date;
  dataFimVisualizacao?: string | Date;
  habilitarVisualizacaoSemCadastro?: boolean;
  // Campos antigos mantidos para compatibilidade
  nome?: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
};

// Etapa 2: Público
export type DadosPublico = {
  tipoPublico?: string;
  segmentos?: string[];
  // Adicione outros campos conforme necessário
};

// Etapa 3: Configurações de Premiação
export type ConfiguracoesPremiacoes = {
  filtrarPorValorGasto?: boolean;
  filtrarPorProduto?: boolean;
  valorMinimoGasto?: string;
  tipoResgate?: string;
  tipoAcumulacao?: string;
  tipoSorteio?: string;
  arquivoRegulamento?: File | null;
  // Campos antigos mantidos para compatibilidade
  tipoPremiacoes?: string;
  probabilidades?: Record<number, number>;
};

// Etapa 5: Personalização
export type DadosPersonalizacao = {
  cores: string[];
  corBotao: string;
  corTextoBotao: string;
  arquivos: Record<string, File | null>;
};

// Estado completo do wizard
export type WizardData = {
  step1: DadosBasicos;
  step2: DadosPublico;
  step3: ConfiguracoesPremiacoes;
  step4: Premio[]; // Prêmios
  step5: DadosPersonalizacao;
};

type CreateWizardContextType = {
  // Dados do wizard
  wizardData: WizardData;
  updateStep1: (data: Partial<DadosBasicos>) => void;
  updateStep2: (data: Partial<DadosPublico>) => void;
  updateStep3: (data: Partial<ConfiguracoesPremiacoes>) => void;
  updateStep5: (data: Partial<DadosPersonalizacao>) => void;

  // Prêmios (mantém compatibilidade com código atual)
  premios: Premio[];
  setPremios: React.Dispatch<React.SetStateAction<Premio[]>>;
  numeroDivisoes: number;

  // Função para submeter tudo
  getFormData: () => WizardData;
  resetWizard: () => void;
};

const CreateWizardContext = createContext<CreateWizardContextType | undefined>(undefined);

// ============================================================
// INITIAL STATE - Estado inicial limpo
// ============================================================

const initialState: WizardData = {
  step1: {},
  step2: {},
  step3: {},
  step4: [
    {
      id: 1,
      posicao: 1,
      tipo: 'Não premiado',
      nome: 'Não foi dessa vez',
      estoque: 10,
      ativo: true,
    },
    {
      id: 2,
      posicao: 2,
      tipo: 'Produto',
      nome: 'Coca-Cola 2L',
      estoque: null,
      ativo: true,
    },
    {
      id: 3,
      posicao: 3,
      tipo: 'Cupom',
      nome: 'Cupom de 50% de desconto na próxima compra',
      estoque: 0,
      ativo: false,
    },
    {
      id: 4,
      posicao: 4,
      tipo: 'Produto Externo',
      nome: 'Copo Stanley',
      estoque: 50,
      ativo: true,
    },
  ],
  step5: {
    cores: ['#F97316', '#FACC15', '#8B5CF6', '#4338CA'],
    corBotao: '#FFFFFF',
    corTextoBotao: '#000000',
    arquivos: {},
  },
};

export function CreateWizardProvider({ children }: { children: React.ReactNode }) {
  // Estado unificado do wizard
  const [wizardData, setWizardData] = useState<WizardData>(initialState);

  // Funções para atualizar cada etapa
  const updateStep1 = (data: Partial<DadosBasicos>) => {
    setWizardData((prev) => ({
      ...prev,
      step1: { ...prev.step1, ...data },
    }));
  };

  const updateStep2 = (data: Partial<DadosPublico>) => {
    setWizardData((prev) => ({
      ...prev,
      step2: { ...prev.step2, ...data },
    }));
  };

  const updateStep3 = (data: Partial<ConfiguracoesPremiacoes>) => {
    setWizardData((prev) => ({
      ...prev,
      step3: { ...prev.step3, ...data },
    }));
  };

  const updateStep5 = (data: Partial<DadosPersonalizacao>) => {
    setWizardData((prev) => ({
      ...prev,
      step5: { ...prev.step5, ...data },
    }));
  };

  // Mantém compatibilidade com o código atual (prêmios)
  const premios = wizardData.step4;
  const setPremios: React.Dispatch<React.SetStateAction<Premio[]>> = (action) => {
    setWizardData((prev) => ({
      ...prev,
      step4: typeof action === 'function' ? action(prev.step4) : action,
    }));
  };

  const numeroDivisoes = useMemo(() => wizardData.step4.length, [wizardData.step4.length]);

  // Função para obter todos os dados (para enviar à API)
  const getFormData = () => wizardData;

  // Função para resetar o wizard
  const resetWizard = () => setWizardData(initialState);

  const value = useMemo(
    () => ({
      wizardData,
      updateStep1,
      updateStep2,
      updateStep3,
      updateStep5,
      premios,
      setPremios,
      numeroDivisoes,
      getFormData,
      resetWizard,
    }),
    [wizardData, premios, numeroDivisoes],
  );

  return <CreateWizardContext.Provider value={value}>{children}</CreateWizardContext.Provider>;
}

export function useCreateWizard() {
  const ctx = useContext(CreateWizardContext);
  if (!ctx) throw new Error('useCreateWizard deve ser usado dentro de CreateWizardProvider');
  return ctx;
}
