'use client';

import { cn } from '@/lib/ui';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';

interface AlertProps {
  /**
   * Título do alert
   */
  title?: string;
  /**
   * Conteúdo/descrição do alert
   */
  children?: ReactNode;
  /**
   * Variante visual do alert
   * @default "default"
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Se true, exibe ícone baseado na variante
   * @default true
   */
  showIcon?: boolean;
  /**
   * Ícone customizado (substitui o ícone da variante)
   */
  icon?: ReactNode;
  /**
   * Se true, permite fechar o alert
   * @default false
   */
  dismissible?: boolean;
  /**
   * Callback executado quando o alert é fechado
   */
  onDismiss?: () => void;
  /**
   * Se true, exibe borda ao redor do alert
   * @default true
   */
  bordered?: boolean;
  /**
   * Tamanho do alert
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Classes CSS customizadas
   */
  className?: string;
  /**
   * Se true, ocupa toda a largura disponível
   * @default true
   */
  fullWidth?: boolean;
  /**
   * Se true, centraliza o conteúdo
   * @default false
   */
  centered?: boolean;
  /**
   * Callback executado ao clicar no alert (quando não dismissible)
   */
  onClick?: () => void;
}

// Configurações de variantes com cores e ícones
const variantConfig = {
  default: {
    container: 'bg-background text-foreground border-border',
    icon: <Info className="h-4 w-4" />,
    iconColor: 'text-blue-500',
  },
  success: {
    container:
      'bg-success/10 text-success-foreground border-success/20 dark:bg-success/10 dark:text-success-foreground dark:border-success/20',
    icon: <CheckCircle className="h-4 w-4" />,
    iconColor: 'text-success',
  },
  warning: {
    container:
      'bg-warning/10 text-warning-foreground border-warning/20 dark:bg-warning/10 dark:text-warning-foreground dark:border-warning/20',
    icon: <AlertTriangle className="h-4 w-4" />,
    iconColor: 'text-warning',
  },
  error: {
    container:
      'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800',
    icon: <XCircle className="h-4 w-4" />,
    iconColor: 'text-red-500',
  },
  info: {
    container:
      'bg-info/10 text-info-foreground border-info/20 dark:bg-info/10 dark:text-info-foreground dark:border-info/20',
    icon: <AlertCircle className="h-4 w-4" />,
    iconColor: 'text-info',
  },
} as const;

// Configurações de tamanho
const sizeConfig = {
  sm: {
    container: 'p-3',
    title: 'text-sm font-medium',
    content: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    container: 'p-4',
    title: 'text-base font-medium',
    content: 'text-sm',
    gap: 'gap-3',
  },
  lg: {
    container: 'p-6',
    title: 'text-lg font-medium',
    content: 'text-base',
    gap: 'gap-4',
  },
} as const;

/**
 * Componente Alert reutilizável e performático
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Sucesso!" dismissible>
 *   Dados salvos com sucesso.
 * </Alert>
 * ```
 *
 * @example
 * ```tsx
 * <Alert variant="error" showIcon={false} icon={<CustomIcon />}>
 *   <strong>Erro:</strong> Falha na operação.
 * </Alert>
 * ```
 */
export const Alert = memo<AlertProps>(
  ({
    title,
    children,
    variant = 'default',
    showIcon = true,
    icon,
    dismissible = false,
    onDismiss,
    bordered = true,
    size = 'md',
    className,
    fullWidth = true,
    centered = false,
    onClick,
  }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Memoiza as configurações de estilo
    const styleConfig = useMemo(
      () => ({
        variant: variantConfig[variant],
        size: sizeConfig[size],
      }),
      [variant, size],
    );

    // Callback otimizado para dismissal
    const handleDismiss = useCallback(() => {
      setIsVisible(false);
      onDismiss?.();
    }, [onDismiss]);

    // Determina qual ícone usar
    const displayIcon = useMemo(() => {
      if (!showIcon) return null;
      return icon || styleConfig.variant.icon;
    }, [showIcon, icon, styleConfig.variant.icon]);

    // Memoiza classes CSS
    const alertClasses = useMemo(
      () =>
        cn(
          // Classes base
          'relative rounded-lg transition-all duration-200',

          // Configurações de variante e tamanho
          styleConfig.variant.container,
          styleConfig.size.container,

          // Modificadores condicionais
          bordered && 'border',
          fullWidth && 'w-full',
          centered && 'text-center',
          onClick && 'cursor-pointer hover:shadow-md',
          !isVisible && 'opacity-0 pointer-events-none',

          // Classes customizadas
          className,
        ),
      [
        styleConfig.variant.container,
        styleConfig.size.container,
        bordered,
        fullWidth,
        centered,
        onClick,
        isVisible,
        className,
      ],
    );

    // Se não está visível (foi dismissado), não renderiza
    if (!isVisible) return null;

    return (
      <div
        className={alertClasses}
        onClick={onClick}
        role={onClick ? 'button' : 'alert'}
        aria-live="polite"
      >
        <div className={cn('flex items-start', styleConfig.size.gap, centered && 'justify-center')}>
          {/* Ícone */}
          {displayIcon && (
            <div className={cn('flex-shrink-0 mt-0.5', styleConfig.variant.iconColor)}>
              {displayIcon}
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {title && <h3 className={cn(styleConfig.size.title, children && 'mb-1')}>{title}</h3>}

            {children && <div className={styleConfig.size.content}>{children}</div>}
          </div>

          {/* Botão de fechar */}
          {dismissible && (
            <button
              type="button"
              className={cn(
                'flex-shrink-0 ml-2 p-1 rounded-md transition-colors',
                'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20',
                'dark:hover:bg-white/10 dark:focus:ring-white/20',
              )}
              onClick={handleDismiss}
              aria-label="Fechar alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

Alert.displayName = 'Alert';
export default Alert;

// Variações pré-configuradas para casos comuns
export const SuccessAlert = memo<Omit<AlertProps, 'variant'>>((props) => (
  <Alert variant="success" {...props} />
));

SuccessAlert.displayName = 'SuccessAlert';

export const ErrorAlert = memo<Omit<AlertProps, 'variant'>>((props) => (
  <Alert variant="error" {...props} />
));

ErrorAlert.displayName = 'ErrorAlert';

export const WarningAlert = memo<Omit<AlertProps, 'variant'>>((props) => (
  <Alert variant="warning" {...props} />
));

WarningAlert.displayName = 'WarningAlert';

export const InfoAlert = memo<Omit<AlertProps, 'variant'>>((props) => (
  <Alert variant="info" {...props} />
));

InfoAlert.displayName = 'InfoAlert';

// Alert para notificações inline
export const InlineAlert = memo<Omit<AlertProps, 'size' | 'bordered' | 'fullWidth'>>((props) => (
  <Alert size="sm" bordered={false} fullWidth={false} {...props} />
));

InlineAlert.displayName = 'InlineAlert';

// Alert para banners/topo da página
export const BannerAlert = memo<Omit<AlertProps, 'size' | 'centered' | 'dismissible'>>((props) => (
  <Alert size="lg" centered dismissible className="rounded-none border-x-0" {...props} />
));

BannerAlert.displayName = 'BannerAlert';
