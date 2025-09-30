'use client';

import { CustomDropdownMenu } from '@/components/forms';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

// Interface para definir um prêmio
export interface Premio {
  id: number;
  posicao: number;
  tipo: 'Produto' | 'Não premiado' | 'Cupom' | 'Produto Externo';
  nome: string;
  estoque: number | null;
  ativo: boolean;
}

// Interface das props do componente
interface TablePremiosProps {
  premios: Premio[];
  onEdit?: (premio: Premio) => void;
  onDelete?: (id: number) => void;
  onView?: (premio: Premio) => void;
  className?: string;
}

/**
 * Componente de tabela para exibir lista de prêmios
 * Inclui funcionalidades para visualizar, editar e excluir prêmios
 */
export function TablePremios({
  premios,
  onEdit,
  onDelete,
  onView,
  className = '',
}: TablePremiosProps) {
  // Função para renderizar o badge do tipo
  const renderTipoBadge = (tipo: Premio['tipo']) => {
    const variants: Record<Premio['tipo'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      Produto: 'default',
      'Não premiado': 'secondary',
      Cupom: 'outline',
      'Produto Externo': 'default',
    };

    return (
      <Badge variant={variants[tipo]} className="font-medium">
        {tipo}
      </Badge>
    );
  };

  // Função para renderizar o estoque
  const renderEstoque = (estoque: number | null) => {
    if (estoque === null) {
      return <span className="text-muted-foreground italic">Ilimitado</span>;
    }

    if (estoque === 0) {
      return <Badge variant="destructive">Esgotado</Badge>;
    }

    return <span className="font-medium">{estoque}</span>;
  };

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">Posição</TableHead>
            <TableHead className="w-[120px]">Tipo</TableHead>
            <TableHead>Nome do Prêmio</TableHead>
            <TableHead className="w-[120px]">Estoque</TableHead>
            <TableHead className="w-[80px]">Status</TableHead>
            <TableHead className="w-[120px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {premios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum prêmio cadastrado ainda.
                <br />
                <span className="text-sm">Clique em "Adicionar Prêmio" para começar.</span>
              </TableCell>
            </TableRow>
          ) : (
            premios.map((premio) => (
              <TableRow key={premio.id}>
                <TableCell className="font-medium justify-items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    {premio.posicao}°
                  </div>
                </TableCell>
                <TableCell>{renderTipoBadge(premio.tipo)}</TableCell>
                <TableCell className="font-medium">{premio.nome}</TableCell>
                <TableCell>{renderEstoque(premio.estoque)}</TableCell>
                <TableCell>
                  <Badge variant={premio.ativo ? 'default' : 'secondary'}>
                    {premio.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center">
                    <CustomDropdownMenu
                      icon={<MoreHorizontal size={18} />}
                      showSeparator={true}
                      label="Ações"
                      align="end"
                      className="p-0 text-gray-500 cursor-pointer size-5 hover:bg-transparent justify-center focus-visible:outline-none"
                      items={[
                        ...(onView
                          ? [
                              {
                                label: 'Visualizar',
                                onClick: () => onView(premio),
                                icon: <Eye className="h-4 w-4" />,
                              },
                            ]
                          : []),
                        ...(onEdit
                          ? [
                              {
                                label: 'Editar',
                                onClick: () => onEdit(premio),
                                icon: <Edit2 className="h-4 w-4" />,
                              },
                            ]
                          : []),
                        ...(onDelete
                          ? [
                              {
                                label: 'Excluir',
                                onClick: () => onDelete(premio.id),
                                icon: <Trash2 className="h-4 w-4" />,
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TablePremios;
