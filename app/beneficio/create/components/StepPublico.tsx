'use client';

import { CustomSelect, MultSelect } from '@/components/index';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectItem } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

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

export default function StepPublico() {
  // Estado para controle do valor selecionado
  const [selectedValue, setSelectedValue] = useState('');

  // Estados específicos para os clusters e lojas
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedLojas, setSelectedLojas] = useState<string[]>([]);

  // Estado para controlar a seleção do tipo de público (público geral ou clusterizado)
  const [tipoPublico, setTipoPublico] = useState<'publico' | 'clusterizado'>('publico');

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
        <CustomSelect
          label="Página de Exibição"
          options={[
            { label: 'Roleta', value: '1' },
            { label: 'Sorteio', value: '2' },
          ]}
          value={selectedValue}
          onChange={(value) => setSelectedValue(value)}
          className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
          placeholder="Selecione em qual página do aplicativo a premiação será exibida"
          clearable={true}
        />
        <section className="my-10">
          <h3 className="text-sm font-medium text-gray-900">Data da Campanha e Visualização</h3>
          <p className="text-sm text-gray-500">
            Selecione as datas de início e fim da campanha e também visualize a data inicial e final
            de visualização.
          </p>
        </section>
        <section className="flex items-center gap-3 mb-10">
          {/* Usando um loop para renderizar as opções de tipo de público */}
          {tipoPublicoOptions.map((opcao) => (
            <div
              key={opcao.id}
              className={`border ${tipoPublico === opcao.id ? 'bg-blue-100 border-blue-200' : 'border-blue-500'} hover:bg-blue-100 hover:border-blue-200 hover:cursor-pointer group flex flex-col items-center gap-y-6 p-4 rounded-xl w-68`}
              onClick={() => setTipoPublico(opcao.id as 'publico' | 'clusterizado')}
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

        {/* Conteúdo específico baseado no tipo de público selecionado */}
        {tipoPublico === 'clusterizado' && (
          <div>
            <MultSelect
              options={statusOptions}
              selectedValues={selectedClusters}
              onChange={(values) => setSelectedClusters(values)}
              placeholder="Selecione o cluster que desejar marcar..."
              label="Clusters"
              className="bg-white hover:bg-white h-[38px]"
              showToggleAll
              renderItem={({ value, label }) => (
                <MultiSelectItem key={value} value={value}>
                  {label}
                </MultiSelectItem>
              )}
            />
          </div>
        )}

        {/* MultSelect de lojas participantes (sempre visível) */}
        <div className="mt-5">
          <MultSelect
            options={statusOptions}
            selectedValues={selectedLojas}
            onChange={(values) => setSelectedLojas(values)}
            placeholder="Selecione as lojas que desejar marcar..."
            label="Lojas Participantes"
            className="bg-white hover:bg-white h-[38px]"
            showToggleAll
            renderItem={({ value, label }) => (
              <MultiSelectItem key={value} value={value}>
                {label}
              </MultiSelectItem>
            )}
          />
        </div>
      </section>
    </section>
  );
}
