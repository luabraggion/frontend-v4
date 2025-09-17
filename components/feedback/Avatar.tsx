'use client';

import { cn } from '@/lib/ui';
import Image from 'next/image';
import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';

interface AvatarProps {
  /**
   * URL da imagem do avatar
   */
  src?: string;
  /**
   * Texto alternativo para acessibilidade
   */
  alt?: string;
  /**
   * Nome da pessoa para gerar iniciais como fallback
   */
  name?: string;
  /**
   * Tamanho do avatar
   * @default "md"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Formato do avatar
   * @default "circle"
   */
  shape?: 'circle' | 'square' | 'rounded';
  /**
   * Status online/offline
   */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /**
   * Indicador de status visível
   * @default false
   */
  showStatus?: boolean;
  /**
   * Elemento customizado para exibir quando não há imagem
   */
  fallback?: ReactNode;
  /**
   * Classes CSS customizadas
   */
  className?: string;
  /**
   * Callback executado quando a imagem falha ao carregar
   */
  onImageError?: () => void;
  /**
   * Callback executado quando a imagem carrega com sucesso
   */
  onImageLoad?: () => void;
  /**
   * Se true, exibe uma borda
   * @default false
   */
  bordered?: boolean;
  /**
   * Cor da borda
   */
  borderColor?: string;
}

// Configurações de tamanho otimizadas
const sizeConfig = {
  xs: {
    container: 'h-6 w-6',
    text: 'text-xs',
    status: 'h-1.5 w-1.5 bottom-0 right-0',
  },
  sm: {
    container: 'h-8 w-8',
    text: 'text-sm',
    status: 'h-2 w-2 bottom-0 right-0',
  },
  md: {
    container: 'h-10 w-10',
    text: 'text-base',
    status: 'h-2.5 w-2.5 bottom-0 right-0',
  },
  lg: {
    container: 'h-12 w-12',
    text: 'text-lg',
    status: 'h-3 w-3 bottom-0 right-0',
  },
  xl: {
    container: 'h-16 w-16',
    text: 'text-xl',
    status: 'h-3.5 w-3.5 bottom-0.5 right-0.5',
  },
  '2xl': {
    container: 'h-20 w-20',
    text: 'text-2xl',
    status: 'h-4 w-4 bottom-0.5 right-0.5',
  },
} as const;

// Configurações de formato
const shapeConfig = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
} as const;

// Configurações de status
const statusConfig = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
} as const;

/**
 * Gera iniciais a partir do nome
 */
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Gera uma cor de fundo baseada no nome para consistência
 */
const getBackgroundColor = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
  ];

  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Componente Avatar altamente otimizado e reutilizável
 *
 * @example
 * ```tsx
 * <Avatar
 *   src="/user.jpg"
 *   name="João Silva"
 *   size="lg"
 *   status="online"
 *   showStatus
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Avatar
 *   name="Maria Santos"
 *   shape="rounded"
 *   bordered
 *   borderColor="border-blue-500"
 * />
 * ```
 */
export const Avatar = memo<AvatarProps>(
  ({
    src,
    alt,
    name = '',
    size = 'md',
    shape = 'circle',
    status,
    showStatus = false,
    fallback,
    className,
    onImageError,
    onImageLoad,
    bordered = false,
    borderColor = 'border-gray-200',
  }) => {
    const [imageLoadError, setImageLoadError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Memoiza as configurações de estilo para evitar recálculos
    const styleConfig = useMemo(
      () => ({
        container: sizeConfig[size].container,
        text: sizeConfig[size].text,
        status: sizeConfig[size].status,
        shape: shapeConfig[shape],
        statusColor: status ? statusConfig[status] : '',
      }),
      [size, shape, status],
    );

    // Memoiza as iniciais
    const initials = useMemo(() => (name ? getInitials(name) : '?'), [name]);

    // Memoiza a cor de fundo baseada no nome
    const backgroundColor = useMemo(
      () => (name ? getBackgroundColor(name) : 'bg-gray-200'),
      [name],
    );

    // Callbacks otimizados
    const handleImageError = useCallback(() => {
      setImageLoadError(true);
      onImageError?.();
    }, [onImageError]);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      setImageLoadError(false);
      onImageLoad?.();
    }, [onImageLoad]);

    // Determina o que exibir
    const shouldShowImage = src && !imageLoadError;
    const shouldShowFallback = !shouldShowImage && (fallback || name);

    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden',
          styleConfig.container,
          styleConfig.shape,
          bordered && `border-2 ${borderColor}`,
          !shouldShowImage && backgroundColor,
          className,
        )}
      >
        {/* Imagem */}
        {shouldShowImage && src && (
          <Image
            src={src}
            alt={alt || name}
            fill
            className={cn(
              'object-cover',
              styleConfig.shape,
              imageLoaded ? 'opacity-100' : 'opacity-0',
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes={`${sizeConfig[size].container}`}
          />
        )}

        {/* Fallback */}
        {shouldShowFallback && (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center text-white font-medium',
              styleConfig.text,
            )}
          >
            {fallback || initials}
          </div>
        )}

        {/* Status Indicator */}
        {showStatus && status && (
          <div
            className={cn(
              'absolute rounded-full border-2 border-white',
              styleConfig.status,
              styleConfig.statusColor,
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

// Variações pré-configuradas
export const AvatarGroup = memo<{
  avatars: Array<Pick<AvatarProps, 'src' | 'name' | 'alt'>>;
  size?: AvatarProps['size'];
  max?: number;
  className?: string;
}>(({ avatars, size = 'md', max = 5, className }) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  return (
    <div className={cn('flex -space-x-1', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={`${avatar.name}-${index}`}
          {...avatar}
          size={size}
          bordered
          borderColor="border-white"
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <Avatar
          name={`+${remaining}`}
          size={size}
          bordered
          borderColor="border-white"
          className="bg-gray-500 text-white ring-2 ring-white"
        />
      )}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';
