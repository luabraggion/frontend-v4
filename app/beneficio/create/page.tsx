'use client';

import { Breadcrumb } from '@/components/layout';
import { ProgressBarCircle } from '@/components/navigation';
import { Step } from '@/components/navigation/ProgressBarCircle';
import { usePageTitle } from '@/components/PageTitleContext';
import { useEffect, useState } from 'react';

import { Button } from '@/components/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Premio, TablePremios } from '@/components/ui/table-premios';
import { Plus } from 'lucide-react';
import StepConfiguracoesPremiacoes from './components/StepConfiguracoesPremiacoes';
import StepDadosBasicos from './components/StepDadosBasicos';
import StepPublico from './components/StepPublico';

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

  // Estado para os prêmios (dados de exemplo)
  const [premios, setPremios] = useState<Premio[]>([
    {
      id: 1,
      posicao: 1,
      tipo: 'Não premiado',
      nome: 'Não foi dessa vez',
      estoque: 10,
      ativo: true,
    },
    {
      id: 2,
      posicao: 2,
      tipo: 'Produto',
      nome: 'Coca-Cola 2L',
      estoque: null, // Ilimitado
      ativo: true,
    },
    {
      id: 3,
      posicao: 3,
      tipo: 'Cupom',
      nome: 'Cupom de 50% de desconto na próxima compra',
      estoque: 0, // Esgotado
      ativo: false,
    },
    {
      id: 4,
      posicao: 4,
      tipo: 'Produto Externo',
      nome: 'Copo Stanley',
      estoque: 50,
      ativo: true,
    },
  ]);

  // Funções para avançar e retroceder etapas
  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  // Função para retroceder etapa
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Funções para manipular prêmios
  const handleEditPremio = (premio: Premio) => {
    console.log('Editando prêmio:', premio);
    // Aqui você implementaria a lógica para editar o prêmio
  };

  const handleDeletePremio = (id: number) => {
    console.log('Excluindo prêmio ID:', id);
    setPremios((prev) => prev.filter((p) => p.id !== id));
  };

  const handleViewPremio = (premio: Premio) => {
    console.log('Visualizando prêmio:', premio);
    // Aqui você implementaria a lógica para visualizar detalhes do prêmio
  };

  const handleAddPremio = () => {
    console.log('Adicionando novo prêmio');
    // Aqui você implementaria a lógica para adicionar um novo prêmio
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
          {currentStep === 3 && <StepConfiguracoesPremiacoes />}
          {currentStep === 4 && (
            <section className="space-y-6">
              <CardHeader className="px-0 gap-0">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Lista de Prêmios</span>
                  <Button onClick={handleAddPremio} className="gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    <span>Adicionar</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Prêmios são as recompensas que o cliente pode receber ao participar do benefício.
                </CardDescription>
              </CardHeader>
              <TablePremios
                premios={premios}
                onEdit={handleEditPremio}
                onDelete={handleDeletePremio}
                onView={handleViewPremio}
              />
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
