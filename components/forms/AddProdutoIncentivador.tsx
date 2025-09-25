'use client';

import { LucideIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface AddProdutoIncentivadorProps {
  /**
   * Função executada ao clicar no botão para adicionar um novo produto incentivador
   */
  onClick: MouseEventHandler<HTMLDivElement>;

  /**
   * Ícone a ser exibido no botão (componente do Lucide)
   */
  icon: LucideIcon;

  /**
   * Texto principal do botão (padrão: "Adicionar Produto Incentivador")
   */
  text?: string;

  /**
   * Cor da borda e do hover (verde por padrão)
   */
  color?: 'green' | 'blue' | 'indigo' | 'purple' | 'yellow' | 'red';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Botão para adicionar novos produtos incentivadores.
 * Usado especificamente para criar novos componentes ProdutoIncentivador.
 */
export function AddProdutoIncentivador({
  onClick,
  icon: Icon,
  text = 'Adicionar Produto Incentivador',
  color = 'green',
  className = '',
}: AddProdutoIncentivadorProps) {
  // Mapeia as cores para as classes do Tailwind
  const colorMap = {
    green: {
      border: 'border-green-700',
      hover: 'hover:bg-green-50',
      text: 'text-green-700',
    },
    blue: {
      border: 'border-blue-700',
      hover: 'hover:bg-blue-50',
      text: 'text-blue-700',
    },
    indigo: {
      border: 'border-indigo-700',
      hover: 'hover:bg-indigo-50',
      text: 'text-indigo-700',
    },
    purple: {
      border: 'border-purple-700',
      hover: 'hover:bg-purple-50',
      text: 'text-purple-700',
    },
    yellow: {
      border: 'border-yellow-600',
      hover: 'hover:bg-yellow-50',
      text: 'text-yellow-600',
    },
    red: {
      border: 'border-red-700',
      hover: 'hover:bg-red-50',
      text: 'text-red-700',
    },
  };

  const { border, hover, text: textColor } = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`border border-dashed rounded-lg shadow-xs p-6 dark:border-white/25 ${border} ${hover} hover:cursor-pointer ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      aria-label={text}
    >
      <div className={`flex flex-col items-center justify-center h-full gap-y-2 ${textColor}`}>
        <span className="text-sm text-gray-500">
          <Icon size={36} className={textColor} />
        </span>
        <span className="text-lg font-semibold">{text}</span>
      </div>
    </div>
  );
}

export default AddProdutoIncentivador;
