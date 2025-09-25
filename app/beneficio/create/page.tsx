'use client';

import { Breadcrumb } from '@/components/layout';
import { ProgressBarCircle } from '@/components/navigation';
import { Step } from '@/components/navigation/ProgressBarCircle';
import { usePageTitle } from '@/components/PageTitleContext';
import { useEffect, useState } from 'react';

import { Button } from '@/components/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PackagePlusIcon } from 'lucide-react';
import StepDadosBasicos from './components/StepDadosBasicos';
import StepPublico from './components/StepPublico';

import {
  AddProdutoIncentivador,
  Input,
  Label,
  ProdutoIncentivador,
  RadioGroupCustom,
} from '@/components/forms';
import { Switch } from '@/components/ui/switch';

import FileUpload from '@/components/forms/FileUpload';

/**
 * Interface para as etapas do wizard de criação de benefícios
 */
export type WizardStep = Step;

const wizardSteps: WizardStep[] = [
  { name: 'Dados Básicos', id: 1, status: 'current' },
  { name: 'Público', id: 2, status: 'upcoming' },
  { name: 'Configurações de Premiação', id: 3, status: 'upcoming' },
  { name: 'Prêmios', id: 4, status: 'upcoming' },
  { name: 'Personalização', id: 5, status: 'upcoming' },
  { name: 'Finalização', id: 6, status: 'upcoming' },
];

// Nenhuma opção global necessária, tudo foi movido para o componente StepPublico

export default function Page() {
  // Atualiza o título da página (usado pelo HeaderWithTitle)
  const { setTitle } = usePageTitle();

  // Título da página
  const pageTitle = 'Criar Benefícios';

  // Atualiza o título da página quando o componente é montado
  useEffect(() => {
    setTitle(pageTitle);
  }, [setTitle, pageTitle]);

  // Não são mais necessários aqui, foram movidos para o componente StepPublico

  // Estado para controle da etapa atual do wizard
  const [currentStep, setCurrentStep] = useState(1);

  // Estado para controlar o switch de filtrar por valor gasto
  const [filtrarPorValorGasto, setFiltrarPorValorGasto] = useState(true);

  // Estado para controlar o switch de filtrar por produto incentivador
  const [filtrarPorProduto, setFiltrarPorProduto] = useState(false);

  // Funções para avançar e retroceder etapas
  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  // Função para retroceder etapa
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Renderiza o componente
  return (
    <Card className="flex-1 flex flex-col bg-accent shadow-none border-none py-0 max-w-7xl mx-auto">
      {/* Define o breadcrumb para esta página */}
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Benefícios', href: '/' },
          { label: pageTitle, isCurrent: true },
        ]}
      />
      <CardContent className="px-0">
        <ProgressBarCircle steps={wizardSteps} currentStep={currentStep} />

        <div className="bg-white rounded-xl p-8 mt-20">
          {currentStep === 1 && <StepDadosBasicos />}
          {currentStep === 2 && <StepPublico />}
          {currentStep === 3 && (
            <section>
              <CardHeader className="px-0">
                <CardTitle>Configuração de Premiação</CardTitle>
                <CardDescription>
                  É a etapa onde você define como os clientes serão recompensados dentro da
                  campanha. Aqui entram regras como valores, percentuais, limites e critérios que
                  determinam a forma em que o benefício será entregue.
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
                      <CardTitle className="text-sm font-medium">
                        Configurar Produto Incentivador
                      </CardTitle>
                      <CardDescription>
                        Produto incentivador é o item escolhido pela marca que da vantagens extras
                        ao cliente na campanha, como mais chances de ganhar, pontos adicionais ou
                        giros extras.
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
          )}
          <Separator className="my-8" />
          <div className="flex justify-end items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              <Button variant="info" onClick={nextStep}>
                {currentStep < 6 ? 'Próximo' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
