'use client';

import { CustomSelect, DatePicker, Input, Label } from '@/components/forms';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { z } from 'zod';

// Schema de validação Zod para o formulário de dados básicos
const dadosBasicosSchema = z
  .object({
    tipoCampanha: z.string().min(1, 'Selecione o tipo da campanha'),
    titulo: z
      .string()
      .min(3, 'O título deve ter no mínimo 3 caracteres')
      .max(100, 'O título deve ter no máximo 100 caracteres')
      .trim()
      .refine((val) => !/^\d+$/.test(val), {
        message: 'O título não pode conter apenas números',
      }),
    dataInicioCampanha: z.date({
      required_error: 'Selecione a data de início da campanha',
      invalid_type_error: 'Data inválida',
    }),
    dataFimCampanha: z.date({
      required_error: 'Selecione a data de fim da campanha',
      invalid_type_error: 'Data inválida',
    }),
    dataInicioVisualizacao: z.date({
      required_error: 'Selecione a data de início da visualização',
      invalid_type_error: 'Data inválida',
    }),
    dataFimVisualizacao: z.date({
      required_error: 'Selecione a data de fim da visualização',
      invalid_type_error: 'Data inválida',
    }),
    habilitarVisualizacaoSemCadastro: z.boolean().optional(),
  })
  .refine((data) => data.dataFimCampanha >= data.dataInicioCampanha, {
    message: 'A data de fim deve ser igual ou posterior à data de início',
    path: ['dataFimCampanha'],
  })
  .refine((data) => data.dataFimVisualizacao >= data.dataInicioVisualizacao, {
    message: 'A data de fim deve ser igual ou posterior à data de início',
    path: ['dataFimVisualizacao'],
  })
  .refine((data) => data.dataInicioCampanha >= data.dataInicioVisualizacao, {
    message: 'A campanha deve iniciar após ou junto com a visualização',
    path: ['dataInicioCampanha'],
  });

type DadosBasicosFormData = z.infer<typeof dadosBasicosSchema>;

interface DateState {
  date: Date | undefined;
  value: string;
}

// Interface para expor métodos do componente
export interface StepDadosBasicosRef {
  validar: () => boolean;
}

const StepDadosBasicos = forwardRef<StepDadosBasicosRef>((props, ref) => {
  // Estado para o valor selecionado no CustomSelect
  const [selectedValue, setSelectedValue] = useState('');

  // Estado para o título
  const [titulo, setTitulo] = useState('');

  // Estado para o switch
  const [habilitarVisualizacao, setHabilitarVisualizacao] = useState(false);

  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Limpa erro ao selecionar
    if (errors.dataFimVisualizacao) {
      setErrors((prev) => ({ ...prev, dataFimVisualizacao: '' }));
    }
  };

  // Função para validar o formulário
  const validarFormulario = (): boolean => {
    try {
      dadosBasicosSchema.parse({
        tipoCampanha: selectedValue,
        titulo: titulo,
        dataInicioCampanha: startDateState.date,
        dataFimCampanha: endDateState.date,
        dataInicioVisualizacao: startVisDateState.date,
        dataFimVisualizacao: endVisDateState.date,
        habilitarVisualizacaoSemCadastro: habilitarVisualizacao,
      });

      // Limpa erros se validação passar
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapeia os erros do Zod para um objeto de erros
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
        console.log('Erros de validação Step 1:', formattedErrors);
      }
      return false;
    }
  };

  // Expõe o método de validação para o componente pai via ref
  useImperativeHandle(ref, () => ({
    validar: validarFormulario,
  }));

  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle>Campanha e Título</CardTitle>
        <CardDescription>
          Selecione o tipo de campanha que deseja criar e defina um título para a mesma.
        </CardDescription>
      </CardHeader>
      <Separator className="my-8" />
      <div className="grid grid-cols-2 gap-3 items-start mb-10">
        <div className="grid gap-3">
          <CustomSelect
            label="Tipo da Campanha"
            options={[
              { label: 'Roleta', value: '1' },
              { label: 'Sorteio', value: '2' },
            ]}
            value={selectedValue}
            onChange={(value) => {
              setSelectedValue(value);
              // Limpa erro ao selecionar
              if (errors.tipoCampanha) {
                setErrors((prev) => ({ ...prev, tipoCampanha: '' }));
              }
            }}
            className={`bg-white focus-visible:outline-none focus-visible:border focus-visible:ring-0 ${
              errors.tipoCampanha
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-gray-200'
            }`}
            clearable={true}
          />
          {errors.tipoCampanha && (
            <p className="text-sm text-red-500 -mt-2">{errors.tipoCampanha}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Input
            id="titulo"
            label="Titulo da Premiação"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              // Limpa erro ao digitar
              if (errors.titulo) {
                setErrors((prev) => ({ ...prev, titulo: '' }));
              }
            }}
            className={`focus-visible:outline-none focus-visible:ring-0 ${
              errors.titulo
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-blue-200'
            }`}
            placeholder="Ex: Roleta de aniversário"
          />
          {errors.titulo && <p className="text-sm text-red-500 -mt-2">{errors.titulo}</p>}
        </div>
      </div>
      {/* <Separator className="my-8" /> */}
      <section className="mb-10">
        <h3 className="text-sm font-medium text-gray-900">Data da Campanha e Visualização</h3>
        <p className="text-sm text-gray-500">
          Selecione as datas de início e fim da campanha e também visualize a data inicial e final
          de visualização.
        </p>
      </section>
      <div className="grid grid-cols-4 gap-3 items-baseline">
        <div className="grid gap-3">
          <DatePicker
            label="Inicio da Campanha"
            value={startDateState.value}
            date={startDateState.date}
            fromYear={yearRange.fromYear}
            toYear={yearRange.toYear}
            placeholder="Data de início"
            onDateChange={(date, value) => {
              handleStartDateChange(date, value);
              // Limpa erro ao selecionar
              if (errors.dataInicioCampanha) {
                setErrors((prev) => ({ ...prev, dataInicioCampanha: '' }));
              }
            }}
            className={`bg-white outline-none focus-visible:outline-none focus-visible:ring-0 py-[18px] ${
              errors.dataInicioCampanha
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-blue-200'
            }`}
          />
          {errors.dataInicioCampanha && (
            <p className="text-sm text-red-500 -mt-2">{errors.dataInicioCampanha}</p>
          )}
        </div>
        <div className="grid gap-3">
          <DatePicker
            label="Fim da Campanha"
            value={endDateState.value}
            date={endDateState.date}
            fromYear={yearRange.fromYear}
            toYear={yearRange.toYear}
            placeholder="Data de encerramento"
            onDateChange={(date, value) => {
              handleEndDateChange(date, value);
              // Limpa erro ao selecionar
              if (errors.dataFimCampanha) {
                setErrors((prev) => ({ ...prev, dataFimCampanha: '' }));
              }
            }}
            className={`bg-white outline-none focus-visible:outline-none focus-visible:ring-0 py-[18px] ${
              errors.dataFimCampanha
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-blue-200'
            }`}
          />
          {errors.dataFimCampanha && (
            <p className="text-sm text-red-500 -mt-2">{errors.dataFimCampanha}</p>
          )}
        </div>
        <div className="grid gap-3">
          <DatePicker
            label="Inicio da Visualização da Campanha"
            value={startVisDateState.value}
            date={startVisDateState.date}
            fromYear={yearRange.fromYear}
            toYear={yearRange.toYear}
            placeholder="Data de início"
            onDateChange={(date, value) => {
              handleStartVisDateChange(date, value);
              // Limpa erro ao selecionar
              if (errors.dataInicioVisualizacao) {
                setErrors((prev) => ({ ...prev, dataInicioVisualizacao: '' }));
              }
            }}
            className={`bg-white outline-none focus-visible:outline-none focus-visible:ring-0 py-[18px] ${
              errors.dataInicioVisualizacao
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-blue-200'
            }`}
          />
          {errors.dataInicioVisualizacao && (
            <p className="text-sm text-red-500 -mt-2">{errors.dataInicioVisualizacao}</p>
          )}
        </div>
        <div className="grid gap-3">
          <DatePicker
            label="Fim da Visualização da Campanha"
            value={endVisDateState.value}
            date={endVisDateState.date}
            fromYear={yearRange.fromYear}
            toYear={yearRange.toYear}
            placeholder="Data de encerramento"
            onDateChange={(date, value) => {
              handleEndVisDateChange(date, value);
              // Limpa erro ao selecionar
              if (errors.dataFimVisualizacao) {
                setErrors((prev) => ({ ...prev, dataFimVisualizacao: '' }));
              }
            }}
            className={`bg-white outline-none focus-visible:outline-none focus-visible:ring-0 py-[18px] ${
              errors.dataFimVisualizacao
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-blue-200'
            }`}
          />
          {errors.dataFimVisualizacao && (
            <p className="text-sm text-red-500 -mt-2">{errors.dataFimVisualizacao}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-6">
        <Switch
          id="habilitar-visualizacao"
          checked={habilitarVisualizacao}
          onCheckedChange={setHabilitarVisualizacao}
        />
        <div className="flex flex-col">
          <Label htmlFor="habilitar-visualizacao">Habilitar visualização sem cadastro</Label>
          <small className="text-gray-500 text-xs">
            Permite visualizar, mas a participação exige cadastro.
          </small>
        </div>
      </div>
    </div>
  );
});

StepDadosBasicos.displayName = 'StepDadosBasicos';

export default StepDadosBasicos;
