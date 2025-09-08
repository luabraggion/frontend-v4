'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { memo, useMemo, type ReactNode } from 'react';

interface TooltipWrapperProps {
  /**
   * Conteúdo que será exibido no tooltip
   */
  content: ReactNode;
  /**
   * Elemento que acionará o tooltip
   */
  children: ReactNode;
  /**
   * Posição do tooltip em relação ao trigger
   * @default "top"
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Alinhamento do tooltip
   * @default "center"
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Distância do trigger em pixels
   * @default 4
   */
  sideOffset?: number;
  /**
   * Delay antes de mostrar o tooltip (ms)
   * @default 200
   */
  delayDuration?: number;
  /**
   * Se true, o tooltip não será exibido
   * @default false
   */
  disabled?: boolean;
  /**
   * Classes CSS customizadas para o conteúdo
   */
  className?: string;
  /**
   * Se true, evita que o tooltip feche ao passar o mouse sobre ele
   * @default false
   */
  disableHoverableContent?: boolean;
}

/**
 * Componente Tooltip reutilizável e performático
 *
 * @example
 * ```tsx
 * <TooltipWrapper content="Adicionar novo item">
 *   <Button>+</Button>
 * </TooltipWrapper>
 * ```
 *
 * @example
 * ```tsx
 * <TooltipWrapper
 *   content="Informação importante"
 *   side="right"
 *   delayDuration={500}
 * >
 *   <InfoIcon />
 * </TooltipWrapper>
 * ```
 */
export const TooltipWrapper = memo<TooltipWrapperProps>(
  ({
    content,
    children,
    side = 'top',
    align = 'center',
    sideOffset = 4,
    delayDuration = 200,
    disabled = false,
    className,
    disableHoverableContent = false,
  }) => {
    // Memoiza as props do TooltipProvider para evitar re-renders desnecessários
    const providerProps = useMemo(
      () => ({
        delayDuration,
        disableHoverableContent,
      }),
      [delayDuration, disableHoverableContent],
    );

    // Memoiza as props do TooltipContent para evitar re-renders
    const contentProps = useMemo(
      () => ({
        side,
        align,
        sideOffset,
        className,
      }),
      [side, align, sideOffset, className],
    );

    // Se disabled, retorna apenas as children sem tooltip
    if (disabled || !content) {
      return <>{children}</>;
    }

    return (
      <TooltipProvider {...providerProps}>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent {...contentProps}>{content}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

TooltipWrapper.displayName = 'TooltipWrapper';

// Variações pré-configuradas para casos comuns
export const TooltipInfo = memo<Omit<TooltipWrapperProps, 'side' | 'className'>>((props) => (
  <TooltipWrapper side="top" className="bg-blue-600 text-white border-blue-700" {...props} />
));

TooltipInfo.displayName = 'TooltipInfo';

export const TooltipWarning = memo<Omit<TooltipWrapperProps, 'side' | 'className'>>((props) => (
  <TooltipWrapper side="top" className="bg-yellow-600 text-white border-yellow-700" {...props} />
));

TooltipWarning.displayName = 'TooltipWarning';

export const TooltipError = memo<Omit<TooltipWrapperProps, 'side' | 'className'>>((props) => (
  <TooltipWrapper side="top" className="bg-red-600 text-white border-red-700" {...props} />
));

TooltipError.displayName = 'TooltipError';

export const TooltipSuccess = memo<Omit<TooltipWrapperProps, 'side' | 'className'>>((props) => (
  <TooltipWrapper side="top" className="bg-green-600 text-white border-green-700" {...props} />
));

TooltipSuccess.displayName = 'TooltipSuccess';
