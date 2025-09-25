'use client';

import { CustomSelect, DatePicker, Input, Label } from '@/components/forms';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { useState } from 'react';

interface DateState {
  date: Date | undefined;
  value: string;
}

// Se você precisar passar props para este componente no futuro,
// você pode descomentar esta interface e adicionar as props necessárias
// interface StepDadosBasicosProps {
//   onValuesChange?: (values: any) => void;
// }

export default function StepDadosBasicos() {
  // Estado para o valor selecionado no CustomSelect
  const [selectedValue, setSelectedValue] = useState('');

  // Estado para controle das datas de campanha e visualização
  const [startDateState, setStartDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  const [endDateState, setEndDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  const [startVisDateState, setStartVisDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  const [endVisDateState, setEndVisDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  // Configuração de anos para seleção de datas
  const currentYear = getCurrentYear();
  const yearRange = {
    fromYear: currentYear,
    toYear: currentYear + 2,
  };

  // Handler para atualização das datas
  const handleStartDateChange = (date: Date | undefined, value: string) => {
    setStartDateState({ date, value });
  };

  const handleEndDateChange = (date: Date | undefined, value: string) => {
    setEndDateState({ date, value });
  };

  const handleStartVisDateChange = (date: Date | undefined, value: string) => {
    setStartVisDateState({ date, value });
  };

  const handleEndVisDateChange = (date: Date | undefined, value: string) => {
    setEndVisDateState({ date, value });
  };

  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle>Campanha e Título</CardTitle>
        <CardDescription>
          Selecione o tipo de campanha que deseja criar e defina um título para a mesma.
        </CardDescription>
      </CardHeader>
      <Separator className="my-8" />
      <div className="grid grid-cols-2 gap-3 items-end mb-10">
        <CustomSelect
          label="Tipo da Campanha"
          options={[
            { label: 'Roleta', value: '1' },
            { label: 'Sorteio', value: '2' },
          ]}
          value={selectedValue}
          onChange={(value) => setSelectedValue(value)}
          className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
          clearable={true}
        />
        <Input
          id="titulo"
          label="Titulo da Premiação"
          className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-200"
          placeholder="Ex: Roleta de aniversário"
        />
      </div>
      {/* <Separator className="my-8" /> */}
      <section className="mb-10">
        <h3 className="text-sm font-medium text-gray-900">Data da Campanha e Visualização</h3>
        <p className="text-sm text-gray-500">
          Selecione as datas de início e fim da campanha e também visualize a data inicial e final
          de visualização.
        </p>
      </section>
      <div className="grid grid-cols-4 gap-3 items-end">
        <DatePicker
          label="Inicio da Campanha"
          value={startDateState.value}
          date={startDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de início"
          onDateChange={handleStartDateChange}
          className="bg-white outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-200 py-[18px]"
        />
        <DatePicker
          label="Fim da Campanha"
          value={endDateState.value}
          date={endDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de encerramento"
          onDateChange={handleEndDateChange}
          className="bg-white outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-200 py-[18px]"
        />
        <DatePicker
          label="Inicio da Visualização da Campanha"
          value={startVisDateState.value}
          date={startVisDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de início"
          onDateChange={handleStartVisDateChange}
          className="bg-white outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-200 py-[18px]"
        />
        <DatePicker
          label="Fim da Visualização da Campanha"
          value={endVisDateState.value}
          date={endVisDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de encerramento"
          onDateChange={handleEndVisDateChange}
          className="bg-white outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-200 py-[18px]"
        />
      </div>
      <div className="flex items-center space-x-2 mt-6">
        <Switch id="habilitar-visualizacao" />
        <div className="flex flex-col">
          <Label htmlFor="habilitar-visualizacao">Habilitar visualização sem cadastro</Label>
          <small className="text-gray-500 text-xs">
            Permite visualizar, mas a participação exige cadastro.
          </small>
        </div>
      </div>
    </div>
  );
}
