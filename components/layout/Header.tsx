'use client';

import { cn } from '@/lib/ui';
import Image from 'next/image';
import { memo, useMemo, type ReactNode } from 'react';
import { BreadcrumbNavigation } from '../navigation';

interface HeaderProps {
  /**
   * Título principal exibido no header
   * @default "Benefícios"
   */
  title?: string;
  /**
   * URL da logo/imagem
   * @default "/logo.webp"
   */
  logoSrc?: string;
  /**
   * Texto alternativo para a logo
   */
  logoAlt?: string;
  /**
   * Largura da logo em pixels
   * @default 30
   */
  logoWidth?: number;
  /**
   * Altura da logo em pixels
   * @default 30
   */
  logoHeight?: number;
  /**
   * Items do breadcrumb
   */
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    isCurrent?: boolean;
  }>;
  /**
   * Se true, esconde o breadcrumb
   * @default false
   */
  hideBreadcrumb?: boolean;
  /**
   * Conteúdo adicional no lado direito do header
   */
  rightContent?: ReactNode;
  /**
   * Classes CSS customizadas
   */
  className?: string;
  /**
   * Tamanho do título
   * @default "2xl"
   */
  titleSize?: 'lg' | 'xl' | '2xl' | '3xl';
  /**
   * Se true, centraliza o conteúdo
   * @default false
   */
  centered?: boolean;
  /**
   * Callback executado ao clicar na logo/título
   */
  onLogoClick?: () => void;
}

// Configurações de tamanho do título
const titleSizeConfig = {
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
} as const;

/**
 * Componente Header reutilizável e configurável
 *
 * @example
 * ```tsx
 * <Header
 *   title="Portal de Benefícios"
 *   breadcrumbItems={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Benefícios', isCurrent: true }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Header
 *   title="Dashboard"
 *   rightContent={<UserMenu />}
 *   hideBreadcrumb
 * />
 * ```
 */
export const Header = memo<HeaderProps>(
  ({
    title = 'Benefícios',
    logoSrc = '/logo.webp',
    logoAlt,
    logoWidth = 30,
    logoHeight = 30,
    breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Benefícios', isCurrent: true },
    ],
    hideBreadcrumb = false,
    rightContent,
    className,
    titleSize = '2xl',
    centered = false,
    onLogoClick,
  }) => {
    // Memoiza as classes do header
    const headerClasses = useMemo(
      () =>
        cn(
          'flex items-center w-full border-b pb-10',
          centered ? 'justify-center' : 'justify-between',
          className,
        ),
      [centered, className],
    );

    // Memoiza as classes do título
    const titleClasses = useMemo(
      () => cn('font-medium font-display tracking-tight', titleSizeConfig[titleSize]),
      [titleSize],
    );

    // Determina o alt text da logo
    const logoAltText = logoAlt || `Logo ${title}`;

    // Wrapper para logo/título clicável
    const LogoWrapper = onLogoClick ? 'button' : 'div';
    const logoWrapperProps = onLogoClick
      ? {
          onClick: onLogoClick,
          type: 'button' as const,
          className:
            'flex items-center gap-1 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md',
          'aria-label': `Ir para página inicial - ${title}`,
        }
      : { className: 'flex items-center gap-1' };

    return (
      <header className={headerClasses}>
        {/* Logo e Título */}
        <LogoWrapper {...logoWrapperProps}>
          <Image
            src={logoSrc}
            alt={logoAltText}
            width={logoWidth}
            height={logoHeight}
            className="object-contain"
            priority
          />
          <h1 className={titleClasses}>{title}</h1>
        </LogoWrapper>

        {/* Conteúdo do meio - para futuras expansões */}
        {centered && !hideBreadcrumb && breadcrumbItems.length > 0 && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>
        )}

        {/* Lado direito - Breadcrumb ou conteúdo customizado */}
        {!centered && (
          <div className="flex items-center gap-4">
            {!hideBreadcrumb && breadcrumbItems.length > 0 && (
              <BreadcrumbNavigation items={breadcrumbItems} />
            )}
            {rightContent}
          </div>
        )}

        {/* Conteúdo direito quando centralizado */}
        {centered && rightContent && <div className="absolute right-0">{rightContent}</div>}
      </header>
    );
  },
);

Header.displayName = 'Header';

// Variações pré-configuradas
export const SimpleHeader = memo<Pick<HeaderProps, 'title' | 'onLogoClick' | 'className'>>(
  (props) => <Header hideBreadcrumb {...props} />,
);

SimpleHeader.displayName = 'SimpleHeader';

export const CenteredHeader = memo<Omit<HeaderProps, 'centered'>>((props) => (
  <Header centered {...props} />
));

CenteredHeader.displayName = 'CenteredHeader';
