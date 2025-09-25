import { cn } from '@/lib';
import { ReactNode } from 'react';

// Propriedades aceitas pelo componente Label
interface LabelProps {
  /**
   * Conteúdo do label (normalmente o texto visível).
   * Pode ser string ou qualquer elemento React.
   */
  children: ReactNode;
  /**
   * Se passado, associa o label a um campo de formulário pelo id (acessibilidade).
   * Se não passar, será renderizado como <span> apenas para estilização.
   */
  htmlFor?: string;
  /**
   * Permite adicionar classes CSS extras para customizar o estilo do label/span.
   */
  className?: string;
}

/**
 * Componente reutilizável para exibir o label de um campo de formulário.
 * Pode ser usado como <Label>Texto</Label> ou <Label htmlFor="id">Texto</Label>
 */
export function Label({ children, htmlFor, className = '' }: LabelProps) {
  // Usa <label> se htmlFor for passado, senão usa <span>
  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className={cn(
          'text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          className,
        )}
      >
        {children}
      </label>
    );
  }
  return (
    <span
      className={
        'text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ' +
        className
      }
    >
      {children}
    </span>
  );
}
