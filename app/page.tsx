'use client';

import { Button, ButtonIcon, ButtonWithIcon } from '@/components/buttons';
import { TooltipWrapper } from '@/components/feedback';
import AlertDialogWrapper from '@/components/feedback/AlertDialogWrapper';
import { Combobox, DatePicker, Input } from '@/components/forms';
import { Header } from '@/components/layout/Header';
import { PaginationWrapper } from '@/components/navigation/Pagination';
import { cn } from '@/lib/ui';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { Ellipsis, Plus, Rotate3D, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { CustomDropdownMenu } from '../components/dropdown/DropdownMenu';

// Definição de tipos
interface DateState {
  date: Date | undefined;
  value: string;
}

// Dados estáticos da página
const comboboxOptions = [
  { label: 'Sorteio', value: '1' },
  { label: 'Roleta', value: '2' },
];

// Dados estáticos da página
const statusOptions = [
  { label: 'Ativos', value: '1' },
  { label: 'Pausados', value: '2' },
  { label: 'Concluídos', value: '3' },
  { label: 'Agendados', value: '4' },
  { label: 'Rascunho', value: '5' },
];

// Cabeçalho da tabela de campanhas (dinâmico, com className opcional)
interface TableHeader {
  label: string;
  className?: string;
}

const tableHeader: TableHeader[] = [
  { label: 'Id', className: 'w-min' },
  { label: 'Status', className: 'w-min' },
  { label: 'Título', className: 'w-min' },
  { label: 'Tipo', className: 'w-min' },
  { label: 'Lojas', className: 'w-min' },
  { label: 'Data Início', className: 'w-min' },
  { label: 'Data Término', className: 'w-min' },
  { label: 'Nº de Participantes', className: 'w-min' },
  { label: 'Ações', className: 'w-min mx-auto text-center' },
];

// Dados de exemplo para o tbody da tabela
const tableData = [
  {
    id: 182,
    status: 'Ativo',
    titulo: 'Roleta da sorte',
    tipo: 'Roleta',
    lojas: [1, 2, 3],
    dataInicio: '26/07/2025',
    dataTermino: '31/09/2025',
    participantes: 1028,
    acoes: 'editar',
  },
  {
    id: 182,
    status: 'Pausado',
    titulo: 'Sorteiro Moto',
    tipo: 'Sorteio',
    lojas: [2],
    dataInicio: '07/08/2025',
    dataTermino: '07/10/2025',
    participantes: 2146,
    acoes: 'editar',
  },
];

export default function Home() {
  // Estado para controle do AlertDialog
  const [openDialog, setOpenDialog] = useState(false);

  // Opções do menu de ações para cada linha da tabela de campanhas
  const actionOptions = [
    { label: 'Editar' },
    { label: 'Pausar', disabled: true },
    { label: 'Detalhes' },
    { label: 'Excluir', onClick: () => setOpenDialog(true) },
  ];

  function getBadgeVariant(status: string) {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800 font-medium';
      case 'Pausado':
        return 'bg-yellow-100 text-yellow-800 font-medium';
      case 'Concluído':
        return 'bg-gray-500';
      // ...outros casos
      default:
        return 'default';
    }
  }

  // Configuração de anos para seleção de datas
  const currentYear = getCurrentYear();
  const yearRange = {
    fromYear: currentYear,
    toYear: currentYear + 2,
  };

  /**
   * Página Home - Formulário de Nova Campanha
   *
   * Componente principal da aplicação que renderiza um formulário
   * para criação de novas campanhas de marketing.
   *
   * Features:
   * - Seleção do tipo de campanha via combobox
   * - Input para título da premiação
   * - Seletores de data para início e fim da campanha
   * - Breadcrumb navegacional com data atual em português
   * - Layout responsivo e acessível
   * - Validação de períodos de datas
   */
  // Estado para controle da data de início da campanha
  const [startDateState, setStartDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  // Estado para controle da data de fim da campanha
  const [endDateState, setEndDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  // Handler para atualização da data de início
  const handleStartDateChange = (date: Date | undefined, value: string) => {
    setStartDateState({ date, value });
  };

  // Handler para atualização da data de fim
  const handleEndDateChange = (date: Date | undefined, value: string) => {
    setEndDateState({ date, value });
  };

  return (
    <div className="w-full py-6">
      {/* Cabeçalho da aplicação */}
      <Header className="px-10" />

      {/* Formulário principal */}
      <div className="flex justify-center items-end-safe p-10 gap-4 mx-auto bg-muted border-b">
        {/* Seleção do tipo de campanha */}
        <Combobox
          options={comboboxOptions}
          label="Tipo da Campanha"
          placeholder="Selecione..."
          className="bg-white hover:bg-white"
        />

        {/* Campo de título da premiação */}
        <Input
          label="Título da Premiação"
          placeholder="Ex: Roleta de aniversário!"
          className="bg-white "
        />

        {/* Seletor de data de início */}
        <DatePicker
          label="Início da Campanha"
          value={startDateState.value}
          date={startDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de início"
          onDateChange={handleStartDateChange}
          className="bg-white"
        />

        {/* Seletor de data de fim */}
        <DatePicker
          label="Fim da Campanha"
          value={endDateState.value}
          date={endDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de encerramento"
          onDateChange={handleEndDateChange}
          className="bg-white outline-none focus:ring-0"
        />

        {/* Seleção do tipo de status */}
        <Combobox
          options={statusOptions}
          label="Status"
          placeholder="Selecione o tipo de status..."
          className="bg-white hover:bg-white"
        />

        {/* Botões de ação */}
        <div className="flex justify-center gap-3">
          <TooltipWrapper content="Pesquisar">
            <ButtonIcon icon={<Search />} variant="outline" ariaLabel="Pesquisar" />
          </TooltipWrapper>
          <ButtonWithIcon icon={<Plus />} variant="warning">
            Adicionar
          </ButtonWithIcon>
        </div>
        {/* AlertDialog para ação Editar */}
        <AlertDialogWrapper
          open={openDialog}
          onOpenChange={setOpenDialog}
          trigger={null}
          showAction={true}
          actionVariant="destructive"
          icon={<Trash size={40} className="text-red-500" />}
          title="Excluir Beneficiário"
          description="Confirma a exclusão deste beneficío? Essa ação não poderá ser desfeita."
          actionText="Excluir"
          className="w-full max-w-xs"
          onAction={() => setOpenDialog(false)}
        />
      </div>

      {/* Tabela de campanhas */}
      <div className="mt-10 px-10 overflow-auto flex items-center flex-col gap-y-12">
        <h3 className="font-semibold text-xl font-display text-gray-700">Lista de Jogos</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th
                  key={header.label}
                  className={cn(
                    'px-3 py-2 border-b font-semibold text-gray-700 text-left',
                    header.className,
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.id}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">
                  {/* <TooltipWrapper content={row.status}>
                    <div className={cn('size-7 rounded-full', getBadgeVariant(row.status))} />
                  </TooltipWrapper> */}
                  <div
                    className={cn(
                      'w-min rounded-full py-1 px-3 text-sm',
                      getBadgeVariant(row.status),
                    )}
                  >
                    {row.status}
                  </div>
                </td>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.titulo}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.tipo}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.lojas.join(', ')}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.dataInicio}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.dataTermino}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">{row.participantes}</td>
                <td className="px-3 py-2 border-b text-muted-foreground">
                  <div className="flex justify-center items-center gap-x-3">
                    <TooltipWrapper content="Rodar Roleta">
                      <Button
                        variant="link"
                        className="cursor-pointer rounded-none size-5 leading-0"
                      >
                        <Rotate3D size={18} className="text-gray-500" />
                      </Button>
                    </TooltipWrapper>
                    <CustomDropdownMenu
                      items={actionOptions}
                      icon={<Ellipsis size={18} />}
                      showSeparator={true}
                      label="Menu"
                      align="end"
                      className="p-0 text-gray-500 cursor-pointer size-5 hover:bg-transparent justify-center focus-visible:outline-none"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationWrapper currentPage={1} totalPages={2} onPageChange={() => {}} />
      </div>
    </div>
  );
}
