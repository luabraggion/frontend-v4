import { cn } from '@/lib/ui';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './Button';

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Ícone a ser exibido no botão (elemento React)
   */
  icon: ReactNode;
  /**
   * Variante do botão
   */
  variant?:
    | 'default'
    | 'destructive'
    | 'warning'
    | 'success'
    | 'info'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /**
   * Tamanho do botão
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Se o botão está desabilitado
   */
  disabled?: boolean;
  /**
   * Texto para acessibilidade (screen readers)
   */
  ariaLabel?: string;
}

/**
 * Botão apenas com ícone - versão reutilizável
 *
 * @example
 * ```tsx
 * // Botão básico com ícone
 * <ButtonIcon icon={<ChevronRightIcon />} />
 *
 * // Botão customizado
 * <ButtonIcon
 *   icon={<PlusIcon />}
 *   variant="default"
 *   size="lg"
 *   className="bg-blue-500"
 *   ariaLabel="Adicionar item"
 *   onClick={() => console.log('Clicado!')}
 * />
 *
 * // Botão pequeno para toolbar
 * <ButtonIcon
 *   icon={<EditIcon />}
 *   variant="ghost"
 *   size="sm"
 *   ariaLabel="Editar"
 * />
 *
 * // Botão de sucesso
 * <ButtonIcon
 *   icon={<CheckIcon />}
 *   variant="success"
 *   ariaLabel="Confirmar"
 * />
 * ```
 */
export function ButtonIcon({
  icon,
  variant = 'secondary',
  size = 'icon',
  className,
  disabled = false,
  ariaLabel,
  ...props
}: ButtonIconProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn('', className)}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </Button>
  );
}
