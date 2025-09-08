'use client';

import { ButtonIcon, ButtonWithIcon } from '@/components/buttons';
import { TooltipWrapper } from '@/components/feedback';
import { Combobox, DatePicker, Input } from '@/components/forms';
import { Header } from '@/components/layout/Header';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

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
export default function Home() {
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
    <div className="w-full p-10">
      {/* Cabeçalho da aplicação */}
      <Header />

      {/* Formulário principal */}
      <div className="flex justify-center items-center py-10 gap-4 mx-auto">
        {/* Seleção do tipo de campanha */}
        <Combobox options={comboboxOptions} label="Tipo da Campanha" placeholder="Selecione..." />

        {/* Campo de título da premiação */}
        <Input label="Título da Premiação" placeholder="Ex: Roleta de aniversário!" />

        {/* Seletor de data de início */}
        <DatePicker
          label="Início da Campanha"
          value={startDateState.value}
          date={startDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de início"
          onDateChange={handleStartDateChange}
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
        />

        {/* Seleção do tipo de status */}
        <Combobox
          options={statusOptions}
          label="Status"
          placeholder="Selecione o tipo de status..."
        />

        {/* Botões de ação */}
        <div className="flex justify-center gap-3 self-end">
          <TooltipWrapper content="Pesquisar">
            <ButtonIcon icon={<Search />} variant="outline" ariaLabel="Pesquisar" />
          </TooltipWrapper>
          <ButtonWithIcon icon={<Plus />} variant="default">
            Adicionar
          </ButtonWithIcon>
        </div>
      </div>

      {/* Demonstração da nova variante Warning (amarela) */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🟡 Nova Variante Warning (Amarela)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Agora todos os componentes suportam a variante{' '}
          <code className="bg-background px-1 rounded">warning</code> para avisos e alertas em cor
          amarela.
        </p>
        <div className="flex gap-4 flex-wrap items-center">
          <ButtonWithIcon icon={<Plus />} variant="warning">
            Botão Warning
          </ButtonWithIcon>

          {/* Importar Badge e outros componentes de feedback conforme necessário */}
        </div>
      </div>
    </div>
  );
}
