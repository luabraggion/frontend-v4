import { useState } from 'react';
import { PaginationWrapper } from '../navigation/PaginationWrapper';
import { DynamicTable, type DynamicTableProps } from './DynamicTable';

export interface PaginatedTableProps<T> extends Omit<DynamicTableProps<T>, 'data'> {
  /** Todos os dados (não paginados) */
  allData: T[];
  /** Número de itens por página */
  itemsPerPage?: number;
  /** Página inicial */
  initialPage?: number;
  /** Se deve mostrar informações da paginação */
  showPaginationInfo?: boolean;
  /** Classes CSS para o container */
  containerClassName?: string;
  /** Classes CSS para a paginação */
  paginationClassName?: string;
  /** Posição da paginação */
  paginationPosition?: 'top' | 'bottom' | 'both';
  /** Callback quando a página muda */
  onPageChange?: (page: number, paginatedData: T[]) => void;
}

export const PaginatedTable = <T extends Record<string, unknown>>({
  allData,
  itemsPerPage = 10,
  initialPage = 1,
  showPaginationInfo = true,
  containerClassName,
  paginationClassName,
  paginationPosition = 'bottom',
  onPageChange,
  ...tableProps
}: PaginatedTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calcular dados paginados
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = allData.slice(startIndex, endIndex);

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newStartIndex = (page - 1) * itemsPerPage;
    const newEndIndex = newStartIndex + itemsPerPage;
    const newPaginatedData = allData.slice(newStartIndex, newEndIndex);
    onPageChange?.(page, newPaginatedData);
  };

  // Componente de informações da paginação
  const PaginationInfo = () => {
    if (!showPaginationInfo || allData.length === 0) return null;

    const startItem = startIndex + 1;
    const endItem = Math.min(endIndex, allData.length);

    return (
      <div className="text-sm text-muted-foreground">
        Mostrando {startItem} a {endItem} de {allData.length} registros
      </div>
    );
  };

  // Componente de paginação
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    return (
      <div className={`flex items-center justify-between ${paginationClassName}`}>
        <PaginationInfo />
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    );
  };

  return (
    <div className={containerClassName}>
      {/* Paginação no topo */}
      {(paginationPosition === 'top' || paginationPosition === 'both') && (
        <div className="mb-4">
          <PaginationComponent />
        </div>
      )}

      {/* Tabela */}
      <DynamicTable data={paginatedData} {...tableProps} />

      {/* Paginação na base */}
      {(paginationPosition === 'bottom' || paginationPosition === 'both') && (
        <div className="mt-4">
          <PaginationComponent />
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;
