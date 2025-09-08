'use client';

import { cn } from '@/lib/ui';
import { memo, useMemo, type ReactNode } from 'react';

interface BadgeProps {
  /**
   * Conteúdo do badge (texto, número, ícone)
   */
  children: ReactNode;
  /**
   * Variante visual do badge
   * @default "default"
   */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  /**
   * Tamanho do badge
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Se true, exibe badge com bordas arredondadas (pill)
   * @default false
   */
  pill?: boolean;
  /**
   * Se true, adiciona animação de pulse
   * @default false
   */
  pulse?: boolean;
  /**
   * Posição do badge quando usado como overlay
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /**
   * Se true, posiciona o badge de forma absoluta para overlay
   * @default false
   */
  overlay?: boolean;
  /**
   * Classes CSS customizadas
   */
  className?: string;
  /**
   * Callback executado ao clicar no badge
   */
  onClick?: () => void;
  /**
   * Se true, torna o badge clicável e adiciona hover effects
   * @default false
   */
  clickable?: boolean;
  /**
   * Valor máximo para contador (ex: 99+)
   */
  max?: number;
}

// Configurações de variantes otimizadas
const variantConfig = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline:
    'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  success: 'bg-green-500 text-white hover:bg-green-500/80',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/80',
  info: 'bg-blue-500 text-white hover:bg-blue-500/80',
} as const;

// Configurações de tamanho
const sizeConfig = {
  sm: 'px-1.5 py-0.5 text-xs font-medium',
  md: 'px-2.5 py-1 text-sm font-medium',
  lg: 'px-3 py-1.5 text-base font-medium',
} as const;

// Configurações de posição para overlay
const positionConfig = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
} as const;

/**
 * Formata números para exibição em badge (ex: 999+ quando > max)
 */
const formatBadgeContent = (content: ReactNode, max?: number): ReactNode => {
  if (typeof content === 'number' && max && content > max) {
    return `${max}+`;
  }
  return content;
};

/**
 * Componente Badge reutilizável e performático
 *
 * @example
 * ```tsx
 * <Badge variant="destructive" size="sm">
 *   Novo
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <Button>Notificações</Button>
 *   <Badge overlay position="top-right" variant="destructive">
 *     5
 *   </Badge>
 * </div>
 * ```
 */
export const Badge = memo<BadgeProps>(
  ({
    children,
    variant = 'default',
    size = 'md',
    pill = false,
    pulse = false,
    position = 'top-right',
    overlay = false,
    className,
    onClick,
    clickable = false,
    max,
  }) => {
    // Memoiza as configurações de estilo
    const styleConfig = useMemo(
      () => ({
        variant: variantConfig[variant],
        size: sizeConfig[size],
        position: overlay ? positionConfig[position] : '',
      }),
      [variant, size, position, overlay],
    );

    // Memoiza o conteúdo formatado
    const formattedContent = useMemo(() => formatBadgeContent(children, max), [children, max]);

    // Memoiza classes CSS
    const badgeClasses = useMemo(
      () =>
        cn(
          // Classes base
          'inline-flex items-center justify-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',

          // Configurações aplicadas
          styleConfig.variant,
          styleConfig.size,

          // Modificadores condicionais
          pill && 'rounded-full',
          pulse && 'animate-pulse',
          overlay && `absolute z-10 ${styleConfig.position}`,
          (clickable || onClick) && 'cursor-pointer select-none',

          // Classes customizadas
          className,
        ),
      [
        styleConfig.variant,
        styleConfig.size,
        styleConfig.position,
        pill,
        pulse,
        overlay,
        clickable,
        onClick,
        className,
      ],
    );

    const Component = onClick ? 'button' : 'span';

    return (
      <Component className={badgeClasses} onClick={onClick} type={onClick ? 'button' : undefined}>
        {formattedContent}
      </Component>
    );
  },
);

Badge.displayName = 'Badge';

// Variações pré-configuradas para casos comuns
export const NotificationBadge = memo<Omit<BadgeProps, 'variant' | 'overlay' | 'position'>>(
  (props) => <Badge variant="destructive" overlay position="top-right" pill max={99} {...props} />,
);

NotificationBadge.displayName = 'NotificationBadge';

export const StatusBadge = memo<Omit<BadgeProps, 'variant' | 'size' | 'pill'>>(
  ({ children, ...props }) => {
    // Mapeia status para variantes
    const statusVariants: Record<string, BadgeProps['variant']> = {
      active: 'success',
      inactive: 'secondary',
      pending: 'warning',
      error: 'destructive',
      online: 'success',
      offline: 'secondary',
    };

    const status = typeof children === 'string' ? children.toLowerCase() : 'default';
    const variant = statusVariants[status] || 'default';

    return (
      <Badge variant={variant} size="sm" pill {...props}>
        {children}
      </Badge>
    );
  },
);

StatusBadge.displayName = 'StatusBadge';

export const CounterBadge = memo<Omit<BadgeProps, 'variant' | 'pill' | 'max'>>((props) => (
  <Badge variant="destructive" pill max={999} {...props} />
));

CounterBadge.displayName = 'CounterBadge';
