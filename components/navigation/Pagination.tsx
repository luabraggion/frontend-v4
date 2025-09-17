import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Pagination as UIPagination,
  PaginationNext as UIPaginationNext,
  PaginationPrevious as UIPaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/ui';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  showEllipsis?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

function PaginationWrapper({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  showEllipsis = true,
  maxVisiblePages = 5,
  className,
}: PaginationWrapperProps) {
  // Função para gerar array de páginas visíveis
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxVisiblePages) {
      // Se o total de páginas é menor que o máximo, mostra todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Sempre mostra a primeira página
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2 && showEllipsis) {
        pages.push('ellipsis');
      }
    }

    // Adiciona páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Sempre mostra a última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1 && showEllipsis) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      if (onPageChange) {
        onPageChange(currentPage - 1);
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      if (onPageChange) {
        onPageChange(currentPage + 1);
      }
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  // Função para gerar URL da página
  const getPageUrl = (page: number) => {
    if (!baseUrl) return '#';
    return `${baseUrl}?page=${page}`;
  };

  if (totalPages <= 1) {
    return null; // Não mostra paginação se há apenas uma página ou menos
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Botão Anterior */}
        <PaginationItem>
          {baseUrl ? (
            <Link href={getPageUrl(currentPage - 1)} passHref legacyBehavior>
              <PaginationPrevious
                href={getPageUrl(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </Link>
          ) : (
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          )}
        </PaginationItem>

        {/* Páginas */}
        {visiblePages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : baseUrl ? (
              <Link href={getPageUrl(page as number)} passHref legacyBehavior>
                <PaginationLink href={getPageUrl(page as number)} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </Link>
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(page as number);
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Botão Próximo */}
        <PaginationItem>
          {baseUrl ? (
            <Link href={getPageUrl(currentPage + 1)} passHref legacyBehavior>
              <PaginationNext
                href={getPageUrl(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              >
                <span className="hidden sm:block">Próximo</span>
              </PaginationNext>
            </Link>
          ) : (
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/**
 * PaginationPrevious - Versão em português do componente Previous
 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof UIPaginationPrevious>) {
  return (
    <UIPaginationPrevious
      aria-label="Ir para página anterior"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Anterior</span>
    </UIPaginationPrevious>
  );
}

/**
 * PaginationNext - Versão em português do componente Next
 */
function PaginationNext({ className, ...props }: React.ComponentProps<typeof UIPaginationNext>) {
  return (
    <UIPaginationNext
      aria-label="Ir para próxima página"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Próximo</span>
      <ChevronRightIcon />
    </UIPaginationNext>
  );
}

/**
 * PaginationEllipsis - Versão em português do componente Ellipsis
 */
function PaginationEllipsis({
  className,
  ariaLabel = 'Mais páginas',
  ...props
}: React.ComponentProps<'span'> & {
  ariaLabel?: string;
}) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}

/**
 * Pagination - Wrapper que exporta todos os componentes com localização brasileira
 *
 * Este wrapper mantém compatibilidade total com o Pagination original do shadcn,
 * mas substitui os textos "Previous" e "Next" por "Anterior" e "Próximo".
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { PaginationWrapper } from '@/components/navigation/Pagination';

 * export default function PaginaExemplo() {
 *   const [paginaAtual, setPaginaAtual] = useState(1);
 *   const totalPaginas = 10;

 *   return (
 *     <div>
 *       <PaginationWrapper
 *         currentPage={paginaAtual}
 *         totalPages={totalPaginas}
 *         onPageChange={setPaginaAtual}
 *         baseUrl="/minha-rota"
 *         showEllipsis
 *         maxVisiblePages={5}
 *         className="mt-8"
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
const Pagination = UIPagination;

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  // Não exporta os do shadcn/ui, só os customizados abaixo
  PaginationNext,
  PaginationPrevious,
  PaginationWrapper,
};
