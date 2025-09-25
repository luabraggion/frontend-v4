'use client';

import { cn } from '@/lib/ui';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import { Avatar } from '../feedback';
import { BreadcrumbNavigation } from '../navigation';
import { useBreadcrumb } from './BreadcrumbContext';

interface HeaderProps {
  /**
   * Título principal exibido no header
   * @default "Benefícios"
   */
  title?: string;
  /**
   * URL da logo/imagem
   * @default "/images/logo.png"
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
   * Componente de breadcrumb customizado
   * Se fornecido, sobrescreve a prop breadcrumbItems
   */
  breadcrumbComponent?: React.ReactNode;
  /**
   * Se true, esconde o breadcrumb
   * @default false
   */
  hideBreadcrumb?: boolean;
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
    logoSrc = '/images/logo.png',
    logoAlt,
    logoWidth = 30,
    logoHeight = 30,
    breadcrumbItems: propsBreadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Benefícios', isCurrent: true },
    ],
    breadcrumbComponent,
    hideBreadcrumb = false,
    className,
    titleSize = '2xl',
    onLogoClick,
  }) => {
    // Obtém os itens do breadcrumb do contexto
    const { items: contextBreadcrumbItems } = useBreadcrumb();

    // Usa os itens do contexto se disponíveis, senão usa os passados via props
    const breadcrumbItems =
      contextBreadcrumbItems.length > 0 ? contextBreadcrumbItems : propsBreadcrumbItems;
    // Memoiza as classes do header
    const headerClasses = useMemo(
      () => cn('flex items-center w-full border-b pb-6 justify-between', className),
      [className],
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

        {/* Lado direito - Breadcrumb */}
        <div className="flex items-center gap-4">
          {!hideBreadcrumb && (
            <>
              {breadcrumbComponent
                ? breadcrumbComponent
                : breadcrumbItems.length > 0 && <BreadcrumbNavigation items={breadcrumbItems} />}
              <div className="h-6 border-l border-border" />
              <Avatar size="sm" />
            </>
          )}
        </div>
      </header>
    );
  },
);

Header.displayName = 'Header';

// Variação pré-configurada
export const SimpleHeader = memo<Pick<HeaderProps, 'title' | 'onLogoClick' | 'className'>>(
  (props) => <Header hideBreadcrumb {...props} />,
);

SimpleHeader.displayName = 'SimpleHeader';
