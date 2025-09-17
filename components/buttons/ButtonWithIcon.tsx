import { cn } from '@/lib/ui';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from './Button';

// Tipos para as props do componente
interface ButtonWithIconProps extends ComponentProps<typeof Button> {
  icon: ReactNode;
  children: ReactNode;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
}

/**
 * Componente ButtonWithIcon - Botão reutilizável com ícone
 *
 * Features:
 * - Suporte a qualquer ícone (Tabler, Lucide, etc.)
 * - Posição do ícone configurável (esquerda/direita)
 * - Herda todas as props do Button do shadcn/ui
 * - Classes CSS customizáveis para o ícone
 * - Totalmente acessível
 */
export function ButtonWithIcon({
  icon,
  children,
  iconPosition = 'left',
  iconClassName,
  className,
  ...props
}: ButtonWithIconProps) {
  // Classes base para o ícone
  const iconClasses = cn(
    'size-4 flex-shrink-0',
    iconPosition === 'left' ? 'mr-1' : 'ml-1',
    iconClassName,
  );

  // Renderiza ícone à esquerda
  const renderLeftIcon = () =>
    iconPosition === 'left' && (
      <span className={iconClasses} aria-hidden="true">
        {icon}
      </span>
    );

  // Renderiza ícone à direita
  const renderRightIcon = () =>
    iconPosition === 'right' && (
      <span className={iconClasses} aria-hidden="true">
        {icon}
      </span>
    );

  return (
    <Button className={cn('inline-flex items-center justify-center', className)} {...props}>
      {renderLeftIcon()}
      {children}
      {renderRightIcon()}
    </Button>
  );
}
