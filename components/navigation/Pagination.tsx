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
import * as React from 'react';

/**
 * PaginationPrevious - Versão em português do componente Previous
 */
function PaginationPrevious({
  className,
  children = 'Anterior',
  ...props
}: React.ComponentProps<typeof UIPaginationPrevious>) {
  return (
    <UIPaginationPrevious
      aria-label="Ir para página anterior"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">{children}</span>
    </UIPaginationPrevious>
  );
}

/**
 * PaginationNext - Versão em português do componente Next
 */
function PaginationNext({
  className,
  children = 'Próximo',
  ...props
}: React.ComponentProps<typeof UIPaginationNext>) {
  return (
    <UIPaginationNext
      aria-label="Ir para próxima página"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">{children}</span>
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
 * import {
 *   Pagination,
 *   PaginationContent,
 *   PaginationItem,
 *   PaginationLink,
 *   PaginationNext,
 *   PaginationPrevious,
 *   PaginationEllipsis
 * } from '@/components/navigation/Pagination'
 *
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="/page/1" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/1">1</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="/page/3" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 */
const Pagination = UIPagination;

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
