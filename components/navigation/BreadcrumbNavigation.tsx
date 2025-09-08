'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/ui';
import { Fragment, memo, useMemo, type ReactNode } from 'react';

interface BreadcrumbItem {
  /**
   * Texto exibido no breadcrumb
   */
  label: string;
  /**
   * URL do link (opcional, usado quando não é o item atual)
   */
  href?: string;
  /**
   * Se true, marca como página atual
   * @default false
   */
  isCurrent?: boolean;
  /**
   * Ícone opcional para o item
   */
  icon?: ReactNode;
  /**
   * Se true, este item não será clicável mesmo que tenha href
   * @default false
   */
  disabled?: boolean;
}

interface BreadcrumbNavigationProps {
  /**
   * Lista de itens do breadcrumb
   */
  items: BreadcrumbItem[];
  /**
   * Número máximo de itens visíveis antes de colapsar
   * @default Infinity
   */
  maxItems?: number;
  /**
   * Separador customizado entre os itens
   */
  separator?: ReactNode;
  /**
   * Classes CSS customizadas
   */
  className?: string;
  /**
   * Se true, exibe o breadcrumb em uma única linha sem quebra
   * @default true
   */
  noWrap?: boolean;
  /**
   * Callback executado ao clicar em um item
   */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

/**
 * Componente de navegação breadcrumb reutilizável e acessível
 *
 * @example
 * ```tsx
 * <BreadcrumbNavigation
 *   items={[
 *     { label: 'Home', href: '/', icon: <HomeIcon /> },
 *     { label: 'Produtos', href: '/produtos' },
 *     { label: 'Categoria', href: '/produtos/categoria' },
 *     { label: 'Item Atual', isCurrent: true }
 *   ]}
 *   maxItems={3}
 * />
 * ```
 */
export const BreadcrumbNavigation = memo<BreadcrumbNavigationProps>(
  ({ items, maxItems = Infinity, separator, className, noWrap = true, onItemClick }) => {
    // Valida e processa os itens
    const processedItems = useMemo(() => {
      if (!items || items.length === 0) return [];

      // Garante que apenas o último item pode ser marcado como atual
      return items.map((item, index) => ({
        ...item,
        isCurrent: index === items.length - 1 ? item.isCurrent : false,
      }));
    }, [items]);

    // Implementa a lógica de colapso quando há muitos itens
    const displayItems = useMemo(() => {
      if (processedItems.length <= maxItems) {
        return processedItems;
      }

      const firstItem = processedItems[0];
      const lastItems = processedItems.slice(-(maxItems - 2));
      const ellipsisItem = {
        label: '...',
        disabled: true,
        isEllipsis: true,
      } as BreadcrumbItem & { isEllipsis: boolean };

      return [firstItem, ellipsisItem, ...lastItems];
    }, [processedItems, maxItems]);

    // Handler para clique em item
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      if (!item.disabled && !item.isCurrent) {
        onItemClick?.(item, index);
      }
    };

    // Classes do container
    const containerClasses = useMemo(
      () => cn(noWrap && 'whitespace-nowrap overflow-hidden', className),
      [noWrap, className],
    );

    if (displayItems.length === 0) {
      return null;
    }

    return (
      <nav className={containerClasses} aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            {displayItems.map((item, idx) => {
              const isEllipsis = 'isEllipsis' in item && item.isEllipsis;
              return (
                <Fragment key={`${item.label}-${idx}`}>
                  <BreadcrumbItem>
                    {/* Item atual (não clicável) */}
                    {item.isCurrent ? (
                      <BreadcrumbPage className="flex items-center gap-1">
                        {!isEllipsis && item.icon}
                        <span>{item.label}</span>
                      </BreadcrumbPage>
                    ) : /* Item clicável ou ellipsis */
                    isEllipsis ? (
                      <span className="text-muted-foreground px-1">{item.label}</span>
                    ) : (
                      <BreadcrumbLink
                        href={!item.disabled ? item.href : undefined}
                        className={cn(
                          'flex items-center gap-1',
                          item.disabled && 'pointer-events-none text-muted-foreground',
                        )}
                        onClick={(e) => {
                          if (onItemClick && !item.disabled) {
                            e.preventDefault();
                            handleItemClick(item, idx);
                          }
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {/* Separador */}
                  {idx < displayItems.length - 1 && (
                    <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                  )}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    );
  },
);

BreadcrumbNavigation.displayName = 'BreadcrumbNavigation';

// Variação simples para casos básicos
export const SimpleBreadcrumb = memo<{
  items: Array<{ label: string; href?: string; isCurrent?: boolean }>;
  className?: string;
}>((props) => <BreadcrumbNavigation {...props} />);

SimpleBreadcrumb.displayName = 'SimpleBreadcrumb';
