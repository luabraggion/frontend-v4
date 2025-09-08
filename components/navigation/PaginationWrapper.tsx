import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/navigation/Pagination';
import Link from 'next/link';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  showEllipsis?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export const PaginationWrapper = ({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  showEllipsis = true,
  maxVisiblePages = 5,
  className,
}: PaginationWrapperProps) => {
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
                <PaginationLink isActive={page === currentPage}>{page}</PaginationLink>
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
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
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
};

export default PaginationWrapper;
