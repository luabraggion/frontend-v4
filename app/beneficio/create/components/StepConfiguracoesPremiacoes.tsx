'use client';

import {
  AddProdutoIncentivador,
  Input,
  Label,
  ProdutoIncentivador,
  RadioGroupCustom,
} from '@/components/forms';
import FileUpload from '@/components/forms/FileUpload';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PackagePlusIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente para a etapa de configurações de premiação no fluxo de criação de benefícios
 */
export default function StepConfiguracoesPremiacoes() {
  // Estado para controlar o switch de filtrar por valor gasto
  const [filtrarPorValorGasto, setFiltrarPorValorGasto] = useState(true);

  // Estado para controlar o switch de filtrar por produto incentivador
  const [filtrarPorProduto, setFiltrarPorProduto] = useState(false);

  return (
    <section>
      <CardHeader className="px-0">
        <CardTitle>Configuração de Premiação</CardTitle>
        <CardDescription>
          É a etapa onde você define como os clientes serão recompensados dentro da campanha. Aqui
          entram regras como valores, percentuais, limites e critérios que determinam a forma em que
          o benefício será entregue.
        </CardDescription>
      </CardHeader>
      <Separator className="my-8" />
      <section className="space-y-3">
        <div className="grid gap-4 border p-4 rounded-md">
          <Label>Regras de Qualificação para Participação</Label>
          <div className="grid gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="filtro-valor"
                className="data-[state=checked]:bg-green-500"
                checked={filtrarPorValorGasto}
                onCheckedChange={setFiltrarPorValorGasto}
              />
              <Label htmlFor="filtro-valor" className="text-gray-500 font-normal">
                Filtrar por valor gasto
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="filtro-produto"
                className="data-[state=checked]:bg-green-500"
                checked={filtrarPorProduto}
                onCheckedChange={setFiltrarPorProduto}
              />
              <Label htmlFor="filtro-produto" className="text-gray-500 font-normal">
                Filtrar por produto incentivador
              </Label>
            </div>
          </div>
        </div>
        {filtrarPorProduto && (
          <div className="grid gap-4 border p-4 rounded-md">
            <CardHeader className="px-0">
              <CardTitle className="text-sm font-medium">Configurar Produto Incentivador</CardTitle>
              <CardDescription>
                Produto incentivador é o item escolhido pela marca que da vantagens extras ao
                cliente na campanha, como mais chances de ganhar, pontos adicionais ou giros extras.
              </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <ProdutoIncentivador
                onDelete={() => {
                  // Implementar lógica de exclusão
                  console.warn('Produto incentivador excluído');
                }}
                opcoesDeSelecao={{
                  fornecedor: [
                    { label: 'Fornecedor 1', value: 'fornecedor1' },
                    { label: 'Fornecedor 2', value: 'fornecedor2' },
                  ],
                  departamento: [],
                  categoria: [],
                  marca: [],
                  produto: [],
                }}
              />
              <AddProdutoIncentivador
                onClick={() => {
                  // Aqui você implementa a lógica para adicionar um novo produto incentivador
                  console.warn('Adicionar novo produto incentivador');
                }}
                icon={PackagePlusIcon}
                color="green"
              />
            </div>
          </div>
        )}
        {filtrarPorValorGasto && (
          <div className="grid gap-4 border p-4 rounded-md">
            <Label>Qual o minímo de valor gasto?</Label>
            <Input placeholder="R$ 150,00" hideLabel />
          </div>
        )}
        <RadioGroupCustom
          label="Selecione o tipo de resgate do produto"
          items={[
            { value: 'resgate-automatico', label: 'Resgate Automático' },
            { value: 'resgate-manual', label: 'Resgate Manual' },
          ]}
          //defaultValue="resgate-automatico"
          className="border p-4 rounded-md"
          labelClassName="font-normal text-gray-500"
          onChange={(_value) => {}}
        />
        <RadioGroupCustom
          label="Defina se os valores das compras serão acumulados ao longo da campanha ou avaliados individualmente por compra."
          items={[
            { value: 'acumulativo', label: 'Acumulativo' },
            { value: 'nao-acumulativo', label: 'Não Acumulativo' },
          ]}
          //defaultValue="resgate-automatico"
          className="border p-4 rounded-md"
          labelClassName="font-normal text-gray-500"
          onChange={(_value) => {}}
        />
        <RadioGroupCustom
          label="Selecione se o sorteio é oficial ou não oficial"
          items={[
            { value: 'oficial', label: 'Oficial via SECAP ' },
            { value: 'nao-oficial', label: 'Não Oficial' },
          ]}
          //defaultValue="resgate-automatico"
          className="border p-4 rounded-md"
          labelClassName="font-normal text-gray-500"
          onChange={(_value) => {}}
        />
        <FileUpload
          label="Documento Regulamento e Termos da Premiação"
          onFileSelect={(_file) => {}}
          accept="application/pdf"
          maxSizeMB={10}
          className="mt-2"
          acceptText="PDF até 10MB"
        />
      </section>
    </section>
  );
}
