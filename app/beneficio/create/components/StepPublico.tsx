'use client';

import { CustomSelect, MultSelect } from '@/components/index';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectItem } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { z } from 'zod';

// Schema de validação Zod para o formulário de público
const publicoSchema = z
  .object({
    paginaExibicao: z.string().min(1, 'Selecione uma página de exibição'),
    tipoPublico: z.enum(['publico', 'clusterizado'], {
      errorMap: () => ({ message: 'Selecione um tipo de público válido' }),
    }),
    clusters: z.array(z.string()).optional(),
    lojasParticipantes: z.array(z.string()).min(1, 'Selecione pelo menos uma loja participante'),
  })
  .refine(
    (data) => {
      // Se for clusterizado, deve ter pelo menos 1 cluster selecionado
      if (data.tipoPublico === 'clusterizado') {
        return data.clusters && data.clusters.length > 0;
      }
      return true;
    },
    {
      message: 'Selecione pelo menos um cluster',
      path: ['clusters'],
    },
  );

type PublicoFormData = z.infer<typeof publicoSchema>;

// Opções de status para o MultSelect
const statusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pendente', value: 'pendente' },
];

// Opções de tipo de público
const tipoPublicoOptions = [
  {
    id: 'publico',
    titulo: 'Público',
    descricao: 'Todos os clientes podem participar, sem restrição.',
  },
  {
    id: 'clusterizado',
    titulo: 'Clusterizado',
    descricao: 'Apenas um grupo específico de clientes participa.',
  },
];

// Interface para expor métodos do componente
export interface StepPublicoRef {
  validar: () => boolean;
}

const StepPublico = forwardRef<StepPublicoRef>((props, ref) => {
  // Estado para controle do valor selecionado
  const [selectedValue, setSelectedValue] = useState('');

  // Estados específicos para os clusters e lojas
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedLojas, setSelectedLojas] = useState<string[]>([]);

  // Estado para controlar a seleção do tipo de público (público geral ou clusterizado)
  const [tipoPublico, setTipoPublico] = useState<'publico' | 'clusterizado'>('publico');

  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para validar o formulário
  const validarFormulario = (): boolean => {
    try {
      publicoSchema.parse({
        paginaExibicao: selectedValue,
        tipoPublico: tipoPublico,
        clusters: selectedClusters,
        lojasParticipantes: selectedLojas,
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
        console.log('Erros de validação:', formattedErrors);
      }
      return false;
    }
  };

  // Expõe o método de validação para o componente pai via ref
  useImperativeHandle(ref, () => ({
    validar: validarFormulario,
  }));

  return (
    <section>
      {/* Conteúdo da etapa 2 - Público */}
      <CardHeader className="px-0">
        <CardTitle>Público</CardTitle>
        <CardDescription>
          Essa etapa define o publico que poderá participar do seu benefício
        </CardDescription>
      </CardHeader>
      <Separator className="my-8" />
      <section>
        <div className="grid gap-3">
          <CustomSelect
            label="Página de Exibição"
            options={[
              { label: 'Roleta', value: '1' },
              { label: 'Sorteio', value: '2' },
            ]}
            value={selectedValue}
            onChange={(value) => {
              setSelectedValue(value);
              // Limpa erro do campo ao selecionar
              if (errors.paginaExibicao) {
                setErrors((prev) => ({ ...prev, paginaExibicao: '' }));
              }
            }}
            className={`bg-white focus-visible:outline-none focus-visible:border focus-visible:ring-0 ${
              errors.paginaExibicao
                ? 'border-red-500 focus-visible:border-red-500'
                : 'focus-visible:border-gray-200'
            }`}
            placeholder="Selecione em qual página do aplicativo a premiação será exibida"
            clearable={true}
          />
          {errors.paginaExibicao && (
            <p className="text-sm text-red-500 -mt-2">{errors.paginaExibicao}</p>
          )}
        </div>
        <section className="my-10">
          <h3 className="text-sm font-medium text-gray-900">Tipo de Público</h3>
          <p className="text-sm text-gray-500">
            Selecione se o benefício será público para todos ou clusterizado para grupos
            específicos.
          </p>
        </section>
        <section className="flex items-center gap-3 mb-10">
          {/* Usando um loop para renderizar as opções de tipo de público */}
          {tipoPublicoOptions.map((opcao) => (
            <div
              key={opcao.id}
              className={`border ${tipoPublico === opcao.id ? 'bg-blue-100 border-blue-200' : errors.tipoPublico ? 'border-red-500' : 'border-blue-500'} hover:bg-blue-100 hover:border-blue-200 hover:cursor-pointer group flex flex-col items-center gap-y-6 p-4 rounded-xl w-68`}
              onClick={() => {
                setTipoPublico(opcao.id as 'publico' | 'clusterizado');
                // Limpa erro ao selecionar
                if (errors.tipoPublico) {
                  setErrors((prev) => ({ ...prev, tipoPublico: '' }));
                }
              }}
            >
              <h1
                className={`font-medium ${tipoPublico === opcao.id ? 'text-blue-600' : 'group-hover:text-blue-600'}`}
              >
                {opcao.titulo}
              </h1>
              <p
                className={`text-center text-sm ${tipoPublico === opcao.id ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}`}
              >
                {opcao.descricao}
              </p>
            </div>
          ))}
        </section>
        {errors.tipoPublico && (
          <p className="text-sm text-red-500 -mt-8 mb-4">{errors.tipoPublico}</p>
        )}

        {/* Conteúdo específico baseado no tipo de público selecionado */}
        {tipoPublico === 'clusterizado' && (
          <div className="grid gap-3">
            <MultSelect
              options={statusOptions}
              selectedValues={selectedClusters}
              onChange={(values) => {
                setSelectedClusters(values);
                // Limpa erro ao selecionar
                if (errors.clusters) {
                  setErrors((prev) => ({ ...prev, clusters: '' }));
                }
              }}
              placeholder="Selecione o cluster que desejar marcar..."
              label="Clusters"
              className={`bg-white hover:bg-white h-[38px] ${
                errors.clusters ? 'border-red-500' : ''
              }`}
              showToggleAll
              renderItem={({ value, label }) => (
                <MultiSelectItem key={value} value={value}>
                  {label}
                </MultiSelectItem>
              )}
            />
            {errors.clusters && <p className="text-sm text-red-500 -mt-2">{errors.clusters}</p>}
          </div>
        )}

        {/* MultSelect de lojas participantes (sempre visível) */}
        <div className={tipoPublico === 'clusterizado' ? 'mt-5' : 'mt-0'}>
          <div className="grid gap-3">
            <MultSelect
              options={statusOptions}
              selectedValues={selectedLojas}
              onChange={(values) => {
                setSelectedLojas(values);
                // Limpa erro ao selecionar
                if (errors.lojasParticipantes) {
                  setErrors((prev) => ({ ...prev, lojasParticipantes: '' }));
                }
              }}
              placeholder="Selecione as lojas que desejar marcar..."
              label="Lojas Participantes"
              className={`bg-white hover:bg-white h-[38px] ${
                errors.lojasParticipantes ? 'border-red-500' : ''
              }`}
              showToggleAll
              renderItem={({ value, label }) => (
                <MultiSelectItem key={value} value={value}>
                  {label}
                </MultiSelectItem>
              )}
            />
            {errors.lojasParticipantes && (
              <p className="text-sm text-red-500 -mt-2">{errors.lojasParticipantes}</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
});

StepPublico.displayName = 'StepPublico';

export default StepPublico;
