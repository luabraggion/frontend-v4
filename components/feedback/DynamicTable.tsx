import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/ui';
import { ReactNode } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  /** Chave do campo no objeto de dados */
  key: keyof T;
  /** Texto exibido no cabeçalho da coluna */
  header: ReactNode;
  /** Classes CSS aplicadas ao cabeçalho e células da coluna */
  className?: string;
  /** Classes CSS aplicadas apenas ao cabeçalho */
  headerClassName?: string;
  /** Classes CSS aplicadas apenas às células */
  cellClassName?: string;
  /** Função customizada para renderizar o conteúdo da célula */
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
  /** Largura da coluna (CSS) */
  width?: string;
  /** Se a coluna pode ser ordenada */
  sortable?: boolean;
  /** Alinhamento do conteúdo */
  align?: 'left' | 'center' | 'right';
}

export interface TableFooterColumn {
  /** Conteúdo da célula do rodapé */
  content: ReactNode;
  /** Número de colunas que a célula deve ocupar */
  colSpan?: number;
  /** Classes CSS da célula do rodapé */
  className?: string;
}

export interface DynamicTableProps<T = Record<string, unknown>> {
  /** Array de dados para exibir na tabela */
  data: T[];
  /** Definições das colunas da tabela */
  columns: TableColumn<T>[];
  /** Legenda/título da tabela */
  caption?: ReactNode;
  /** Colunas do rodapé da tabela */
  footer?: TableFooterColumn[];
  /** Mensagem exibida quando não há dados */
  emptyMessage?: ReactNode;
  /** Classes CSS da tabela */
  className?: string;
  /** Classes CSS das linhas ou função que retorna classes baseada na linha */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Callback executado ao clicar em uma linha */
  onRowClick?: (row: T, index: number) => void;
  /** Função para gerar chave única da linha (padrão: index) */
  getRowKey?: (row: T, index: number) => string | number;
  /** Se deve destacar visualmente linhas clicáveis */
  highlightHoverRows?: boolean;
  /** Props adicionais passadas para o componente Table */
  tableProps?: React.ComponentProps<typeof Table>;
}

export const DynamicTable = <T extends Record<string, unknown>>({
  data,
  columns,
  caption,
  footer,
  emptyMessage = 'Nenhum registro encontrado.',
  className,
  rowClassName,
  onRowClick,
  getRowKey = (_, index) => index,
  highlightHoverRows = true,
  tableProps,
}: DynamicTableProps<T>) => {
  // Função para obter classes da linha
  const getRowClassName = (row: T, index: number): string => {
    const baseClasses =
      typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName || '';

    const interactiveClasses =
      onRowClick && highlightHoverRows ? 'cursor-pointer hover:bg-muted/50 transition-colors' : '';

    return cn(baseClasses, interactiveClasses);
  };

  // Função para obter alinhamento da coluna
  const getColumnAlignment = (align?: 'left' | 'center' | 'right'): string => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Handler para clique na linha
  const handleRowClick = (row: T, index: number) => {
    onRowClick?.(row, index);
  };

  // Renderizar valor da célula
  const renderCellValue = (column: TableColumn<T>, row: T, rowIndex: number): ReactNode => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row, rowIndex);
    }

    // Tratamento padrão para diferentes tipos de valor
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }

    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR');
    }

    return String(value);
  };

  return (
    <Table className={cn(className)} {...tableProps}>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className={cn(
                column.className,
                column.headerClassName,
                getColumnAlignment(column.align),
              )}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow
              key={getRowKey(row, rowIndex)}
              className={getRowClassName(row, rowIndex)}
              onClick={() => handleRowClick(row, rowIndex)}
            >
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  className={cn(
                    column.className,
                    column.cellClassName,
                    getColumnAlignment(column.align),
                  )}
                >
                  {renderCellValue(column, row, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>

      {footer && footer.length > 0 && (
        <TableFooter>
          <TableRow>
            {footer.map((footerColumn, index) => (
              <TableCell
                key={index}
                colSpan={footerColumn.colSpan || 1}
                className={cn(footerColumn.className)}
              >
                {footerColumn.content}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default DynamicTable;
