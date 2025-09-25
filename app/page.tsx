'use client';

import { Button, ButtonIcon, ButtonWithIcon } from '@/components/buttons';
import { Drawer } from '@/components/Drawer';
import { AlertDialogWrapper, TooltipWrapper } from '@/components/feedback';
import {
  Combobox,
  CustomDropdownMenu,
  CustomSelect,
  DatePicker,
  Input,
  Label,
  MultSelect,
} from '@/components/forms';
import { Breadcrumb } from '@/components/layout';
import { PaginationWrapper } from '@/components/navigation/Pagination';
import { usePageTitle } from '@/components/PageTitleContext';
import { cn } from '@/lib/ui';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { CirclePause, Clock4, Ellipsis, Flower, Pencil, Plus, Search, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MultiSelectItem } from '../components/ui/multi-select';

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
  { label: 'Ativos', value: '1', icon: <Pencil /> },
  { label: 'Pausados', value: '2', icon: <Pencil /> },
  { label: 'Concluídos', value: '3', icon: <Pencil /> },
  { label: 'Agendados', value: '4', icon: <Pencil /> },
  { label: 'Rascunho', value: '5', icon: <Pencil /> },
];

// useEffect moved inside Home component

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
    id: 1,
    status: 'Ativo',
    titulo: 'Roleta da sorte',
    tipo: 'Roleta',
    lojas: [
      {
        name: '1',
        city: 'Ribeirão Preto',
        state: 'SP',
        neighborhood: 'Alto do Ipiranga',
      },
      {
        name: '2',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '3',
        city: 'Campinas',
        state: 'SP',
        neighborhood: 'Higienópolis',
      },
    ],
    dataInicio: '26/07/2025',
    dataTermino: '31/09/2025',
    participantes: 1028,
    acoes: 'editar',
  },
  {
    id: 2,
    status: 'Pausado',
    titulo: 'Sorteiro Moto',
    tipo: 'Sorteio',
    lojas: [
      {
        name: '1',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
    ],
    dataInicio: '07/08/2025',
    dataTermino: '07/10/2025',
    participantes: 2146,
    acoes: 'editar',
  },
  {
    id: 3,
    status: 'Agendado',
    titulo: 'Sorteiro Vale Compra ',
    tipo: 'Sorteio',
    lojas: [
      {
        name: '1',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '2',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '7',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '18',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '35',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '37',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '37',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
      {
        name: '37',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro',
      },
    ],
    dataInicio: '18/08/2025',
    dataTermino: '18/09/2025',
    participantes: 2289,
    acoes: 'editar',
  },
];

export default function Home() {
  const { setTitle } = usePageTitle();
  const router = useRouter();

  const pageTitle = 'Benefícios';

  useEffect(() => {
    setTitle(pageTitle);
  }, [setTitle, pageTitle]);

  // Estado para controle do AlertDialog de Excluir
  const [openDialog, setOpenDialog] = useState(false);

  // Estado para controlar o método se será pausar campanha ou excluído
  const [pauseMode, setPauseMode] = useState(false);

  function getBadgeVariant(status: string) {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Concluído':
        return 'bg-violet-100';
      case 'Agendado':
        return 'bg-sky-100 text-sky-800';
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

  // Estado para controle do valor selecionado no CustomSelect
  const [selectedValue, setSelectedValue] = useState('10');

  // Estado para controle do valor selecionado no CustomSelect
  const [selectedValueCluster, setSelectedValueCluster] = useState('');

  // Estado para controle dos valores selecionados no status
  const [selectedStatusValues, setSelectedStatusValues] = useState<string[]>([]);

  // Estado para controle do Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      {/* Define o breadcrumb para esta página */}
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: pageTitle, href: '/', isCurrent: true },
        ]}
      />

      {/* Formulário de Filtro */}
      <div className="flex justify-center items-end-safe p-10 gap-4 mx-auto border-b bg-white rounded-2xl">
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
        {/* <Combobox
          options={statusOptions}
          label="Status"
          placeholder="Selecione o tipo de status..."
          className="bg-white hover:bg-white"
        /> */}
        <MultSelect
          options={statusOptions}
          selectedValues={selectedStatusValues}
          onChange={(values) => setSelectedStatusValues(values)}
          placeholder="Selecione o tipo de status..."
          label="Status"
          className="bg-white hover:bg-white max-w-sm"
          renderItem={({ value, label }) => (
            <MultiSelectItem key={value} value={value}>
              {label}
            </MultiSelectItem>
          )} // Remove o ícone explícito para usar o comportamento padrão do CustomCheckbox
        />

        {/* Botões de ação */}
        <div className="flex justify-center gap-3">
          <TooltipWrapper content="Pesquisar">
            <ButtonIcon icon={<Search />} variant="outline" ariaLabel="Pesquisar" />
          </TooltipWrapper>
        </div>

        {/* AlertDialog para ação Editar */}
        <AlertDialogWrapper
          open={openDialog}
          onOpenChange={setOpenDialog}
          trigger={null}
          showAction={true}
          actionVariant={pauseMode ? 'warning' : 'destructive'}
          icon={
            pauseMode ? (
              <Clock4 size={40} className="text-yellow-500" />
            ) : (
              <Trash size={40} className="text-red-500" />
            )
          }
          title={pauseMode ? 'Pausar Benefício' : 'Excluir Benefício'}
          description={
            pauseMode
              ? 'Ele ficará indisponível até ser reativado e pode ser ativado a qualquer momento.'
              : 'Confirma a exclusão deste benefício? Essa ação não poderá ser desfeita.'
          }
          actionText={pauseMode ? 'Pausar' : 'Excluir'}
          className="w-full max-w-xs"
          onAction={() => setOpenDialog(false)}
        />
      </div>

      {/* Espaço reservado para filtros futuros */}
      {/* <div className="mt-4 px-0">
        <div className="flex w-full justify-between items-center">
          <h3 className="font-semibold text-xl font-display text-gray-700">Lista de Jogos</h3>
          <ButtonWithIcon icon={<Plus />} variant="warning">
            Adicionar
          </ButtonWithIcon>
        </div>
      </div> */}

      {/* Tabela de campanhas */}
      <div className="mt-10 px-10 overflow-auto flex items-center flex-col gap-y-12 p-10 bg-white rounded-2xl">
        <div className="flex w-full justify-between items-center">
          <h3 className="font-semibold text-xl font-display text-gray-700">Lista de Jogos</h3>
          <ButtonWithIcon
            icon={<Plus />}
            variant="default"
            className="bg-sky-100 text-sky-800 font-semibold hover:bg-sky-50 cursor-pointer"
            onClick={() => router.push('/beneficio/create')}
          >
            Adicionar
          </ButtonWithIcon>
        </div>

        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th
                  key={header.label}
                  className={cn(
                    'px-3 py-2 border-b font-bold text-gray-700 text-left',
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
                <td className="px-3 py-1.5 border-b text-muted-foreground">{row.id}</td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">
                  <div
                    className={cn(
                      'w-min rounded-full py-0.5 px-3 text-sm font-normal',
                      getBadgeVariant(row.status),
                    )}
                  >
                    {row.status}
                  </div>
                </td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">{row.titulo}</td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">{row.tipo}</td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">
                  {/* {row.lojas.join(', ')} */}
                  <div className="flex flex-wrap gap-1">
                    {row.lojas.slice(0, 5).map((loja, idx) => (
                      <TooltipWrapper
                        key={idx}
                        content={
                          <>
                            <div>Loja {loja.name}</div>
                            <div>
                              {loja.city}, {loja.state} - {loja.neighborhood}
                            </div>
                          </>
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:text-white hover:bg-gray-800 hover:border-gray-800"
                          onClick={() => alert(`Loja ${loja.name} clicada`)} // Substituí console.log por alert
                        >
                          {loja.name}
                        </Button>
                      </TooltipWrapper>
                    ))}
                    {row.lojas.length > 5 && (
                      <TooltipWrapper
                        content="Lojas Agrupadas" // Conteúdo do tooltip
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:text-white hover:bg-gray-800 hover:border-gray-800"
                        >
                          <div className="text-sm">{`+ ${row.lojas.length - 5}`}</div>
                        </Button>
                      </TooltipWrapper>
                    )}
                  </div>
                </td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">{row.dataInicio}</td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">{row.dataTermino}</td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">{row.participantes}</td>
                <td className="px-3 py-1.5 border-b text-muted-foreground">
                  <div className="flex justify-center items-center gap-x-3">
                    <TooltipWrapper content="Sorteador">
                      <Button
                        variant="link"
                        className="cursor-pointer rounded-none size-5 leading-0"
                      >
                        <Flower size={18} className="text-gray-500" />
                      </Button>
                    </TooltipWrapper>
                    <CustomDropdownMenu
                      items={[
                        {
                          label: 'Editar',
                          onClick: () => router.push(`/beneficio/edit/${row.id}`),
                          icon: <Pencil />,
                        },
                        {
                          label: 'Pausar',
                          onClick: () => {
                            setPauseMode(true);
                            setOpenDialog(true);
                          },
                          icon: <CirclePause />,
                          disabled: false,
                        },
                        {
                          label: 'Detalhes',
                          onClick: () => router.push(`/beneficio/detalhes/${row.id}`),
                          icon: <Search />,
                        },
                        {
                          label: 'Excluir',
                          onClick: () => {
                            setPauseMode(false);
                            setOpenDialog(true);
                          },
                          icon: <Trash />,
                        },
                      ]}
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
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-x-2">
            <CustomSelect
              options={[
                { label: '10', value: '10' },
                { label: '50', value: '50' },
                { label: '100', value: '100' },
              ]}
              value={selectedValue}
              onChange={(value) => setSelectedValue(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
            />
            <span className="text-sm text-gray-600 text-nowrap">itens por página</span>
          </div>
          <PaginationWrapper
            currentPage={1}
            totalPages={2}
            onPageChange={() => {}}
            className="justify-end"
          />
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        actions={
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={() => setDrawerOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="flex-1 bg-sky-100 text-sky-800 font-semibold hover:border-sky-200 hover:bg-sky-100"
              onClick={() => alert('Ação confirmada!')}
            >
              Salvar
            </Button>
          </div>
        }
        title="Editar Benefício"
        description="Edite os detalhes do benefício da campanha, como nome e usuário. Certifique-se de salvar as alterações ao finalizar."
      >
        <div className="grid flex-1 auto-rows-min gap-6">
          <div className="grid gap-3">
            <Input
              id="sheet-demo-name"
              label="Titulo"
              className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-sky-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="grid gap-3">
            <Label htmlFor="select-lojas">Cluster</Label>
            <CustomSelect
              options={[
                { label: 'Opção 1', value: 'option1' },
                { label: 'Opção 2', value: 'option2' },
                { label: 'Opção 3', value: 'option3' },
              ]}
              value={selectedValueCluster}
              onChange={(value) => setSelectedValueCluster(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione o cluster..."
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
