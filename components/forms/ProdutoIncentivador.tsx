'use client';

import { ButtonIcon } from '@/components/buttons';
import { CustomSelect, DatePicker, Input } from '@/components/forms';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface DateState {
  date: Date | undefined;
  value: string;
}

interface CompraTabContentProps {
  placeholder: string;
  suffix: string;
}

interface BeneficioTabContentProps {
  placeholder: string;
  suffix: string;
}

interface ProdutoIncentivadorProps {
  /** Handler para exclusão do produto incentivador */
  onDelete?: () => void;
  /** Dados iniciais para os selects de fornecedor */
  opcoesDeSelecao?: {
    fornecedor?: Array<{ label: string; value: string }>;
    departamento?: Array<{ label: string; value: string }>;
    categoria?: Array<{ label: string; value: string }>;
    marca?: Array<{ label: string; value: string }>;
    produto?: Array<{ label: string; value: string }>;
  };
  /** Classes adicionais para o componente principal */
  className?: string;
}

/**
 * Componente reutilizável para Produto Incentivador
 */
export function ProdutoIncentivador({
  onDelete,
  opcoesDeSelecao = {
    fornecedor: [],
    departamento: [],
    categoria: [],
    marca: [],
    produto: [],
  },
  className = '',
}: ProdutoIncentivadorProps) {
  // Estado para controle das seleções nos dropdowns
  const [selectedFornecedor, setSelectedFornecedor] = useState<string>('');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [selectedProduto, setSelectedProduto] = useState<string>('');

  // Estado para controle das datas
  const [startDateState, setStartDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });
  const [endDateState, setEndDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  // Configuração de anos para seleção de datas
  const currentYear = getCurrentYear();
  const yearRange = {
    fromYear: currentYear,
    toYear: currentYear + 2,
  };

  // Handler para atualização da data de início
  const handleStartDateChange = (date: Date | undefined, value: string) => {
    setStartDateState({ date, value });
  };

  // Handler para atualização da data de fim
  const handleEndDateChange = (date: Date | undefined, value: string) => {
    setEndDateState({ date, value });
  };

  // Componente auxiliar para o conteúdo dos tabs
  function CompraTabContent({ placeholder, suffix }: CompraTabContentProps) {
    return (
      <div className="inline space-x-2 text-sm text-gray-500">
        <span>Comprando</span>
        <Input
          hideLabel
          className="w-16"
          containerClassName="w-max inline-flex"
          placeholder={placeholder}
          size="sm"
        />
        <span>{suffix} em produtos selecionados no filtro.</span>
      </div>
    );
  }

  // Componente auxiliar para o benefício dos tabs
  function BeneficioTabContent({ placeholder, suffix }: BeneficioTabContentProps) {
    const prefix = (() => {
      if (suffix === 'reais') return 'Acelerador multiplica em';
      if (suffix === 'unidades') return 'O cliente receberá';
      return '';
    })();

    const suffixText =
      suffix === 'reais'
        ? 'do produto selecionado, aumentando o benefício do cliente.'
        : suffix === 'unidades'
          ? 'chances adicionais como benefício.'
          : '';

    return (
      <div className="inline space-x-2 text-sm text-gray-500">
        <span>{prefix}</span>
        <Input
          hideLabel
          className="w-16"
          containerClassName="w-max inline-flex"
          placeholder={placeholder}
          size="sm"
        />
        <span>{suffixText}</span>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg shadow-xs p-6 dark:border-white/25 space-y-2 bg-white ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <span className="font-medium">Produto Incentivador</span>
        {onDelete && <ButtonIcon icon={<Trash />} variant="destructive" onClick={onDelete} />}
      </div>

      <CustomSelect
        options={opcoesDeSelecao.fornecedor || []}
        value={selectedFornecedor}
        onChange={(value) => setSelectedFornecedor(value)}
        className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
        placeholder="Selecione o fornecedor..."
      />

      <CustomSelect
        options={opcoesDeSelecao.departamento || []}
        value={selectedDepartamento}
        onChange={(value) => setSelectedDepartamento(value)}
        className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
        placeholder="Selecione o departamento..."
      />

      <CustomSelect
        options={opcoesDeSelecao.categoria || []}
        value={selectedCategoria}
        onChange={(value) => setSelectedCategoria(value)}
        className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
        placeholder="Selecione a categoria..."
      />

      <CustomSelect
        options={opcoesDeSelecao.marca || []}
        value={selectedMarca}
        onChange={(value) => setSelectedMarca(value)}
        className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
        placeholder="Selecione a marca..."
      />

      <CustomSelect
        options={opcoesDeSelecao.produto || []}
        value={selectedProduto}
        onChange={(value) => setSelectedProduto(value)}
        className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
        placeholder="Selecione o produto..."
      />

      <Separator className="my-6" />

      <Tabs defaultValue="valor" className="my-6">
        <TabsList className="border w-full">
          <TabsTrigger value="valor">Valor</TabsTrigger>
          <TabsTrigger value="quantidade">Quantidade</TabsTrigger>
        </TabsList>
        <TabsContent value="valor" className="py-2">
          <CompraTabContent placeholder="4,00" suffix="reais" />
        </TabsContent>
        <TabsContent value="quantidade" className="py-2">
          <CompraTabContent placeholder="4,00" suffix="unidades" />
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      <Tabs defaultValue="acelerador" className="my-6">
        <TabsList className="border w-full">
          <TabsTrigger value="acelerador">Acelerador</TabsTrigger>
          <TabsTrigger value="chances">Chances</TabsTrigger>
        </TabsList>
        <TabsContent value="acelerador" className="py-2">
          <BeneficioTabContent placeholder="5" suffix="reais" />
        </TabsContent>
        <TabsContent value="chances" className="py-2">
          <BeneficioTabContent placeholder="5" suffix="unidades" />
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      <div className="space-y-4">
        <DatePicker
          label="Início do Incentivo"
          value={startDateState.value}
          date={startDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de início"
          onDateChange={handleStartDateChange}
          className="bg-white outline-none focus:ring-0 h-10"
        />
        <DatePicker
          label="Fim do Incentivo"
          value={endDateState.value}
          date={endDateState.date}
          fromYear={yearRange.fromYear}
          toYear={yearRange.toYear}
          placeholder="Data de encerramento"
          onDateChange={handleEndDateChange}
          className="bg-white outline-none focus:ring-0 h-10"
        />
      </div>
    </div>
  );
}

export default ProdutoIncentivador;
