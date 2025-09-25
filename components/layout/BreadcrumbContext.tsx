'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  setBreadcrumbItems: (items: BreadcrumbItem[]) => void;
}

// Valor padrão para o contexto
const defaultContextValue: BreadcrumbContextType = {
  items: [
    { label: 'Home', href: '/' },
    { label: 'Benefícios', isCurrent: true },
  ],
  setBreadcrumbItems: () => {},
};

// Criando o contexto
const BreadcrumbContext = createContext<BreadcrumbContextType>(defaultContextValue);

// Hook para acessar o contexto
export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
};

// Provider do contexto
export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>(defaultContextValue.items);

  // Função para atualizar os itens do breadcrumb
  const setBreadcrumbItems = (newItems: BreadcrumbItem[]) => {
    setItems(newItems);
  };

  return (
    <BreadcrumbContext.Provider value={{ items, setBreadcrumbItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

/**
 * Componente para definir os itens do breadcrumb em qualquer página
 */
export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const { setBreadcrumbItems } = useBreadcrumb();

  // Atualiza os itens do breadcrumb quando o componente é montado
  useEffect(() => {
    setBreadcrumbItems(items);
    // Limpa os itens quando o componente é desmontado
    return () => {
      setBreadcrumbItems(defaultContextValue.items);
    };
  }, [items, setBreadcrumbItems]);

  // Este componente não renderiza nada visualmente
  return null;
};
