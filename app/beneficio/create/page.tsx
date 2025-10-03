'use client';

import { Breadcrumb } from '@/components/layout';
import { ProgressBarCircle } from '@/components/navigation';
import { Step } from '@/components/navigation/ProgressBarCircle';
import { usePageTitle } from '@/components/PageTitleContext';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/index';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

import { CreateWizardProvider } from './components/CreateWizardContext';
import StepConfiguracoesPremiacoes, {
  StepConfiguracoesPremiacoesRef,
} from './components/StepConfiguracoesPremiacoes';
import StepDadosBasicos, { StepDadosBasicosRef } from './components/StepDadosBasicos';
import StepPersonalizacao from './components/StepPersonalizacao';
import StepPremios from './components/StepPremios';
import StepPublico, { StepPublicoRef } from './components/StepPublico';
import StepResumo, { StepResumoRef } from './components/StepResumo';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs para acessar métodos de validação dos steps
  const stepDadosBasicosRef = useRef<StepDadosBasicosRef>(null);
  const stepPublicoRef = useRef<StepPublicoRef>(null);
  const stepConfiguracoesPremiacoesRef = useRef<StepConfiguracoesPremiacoesRef>(null);
  const stepResumoRef = useRef<StepResumoRef>(null);

  // Funções para avançar e retroceder etapas
  const nextStep = async () => {
    // Valida Step 1 (Dados Básicos)
    if (currentStep === 1) {
      const isValid = stepDadosBasicosRef.current?.validar();
      if (!isValid) {
        console.log('Validação do Step Dados Básicos falhou');
        return; // Impede avançar se houver erros
      }
    }

    // Valida Step 2 (Público)
    if (currentStep === 2) {
      const isValid = stepPublicoRef.current?.validar();
      if (!isValid) {
        console.log('Validação do Step Público falhou');
        return; // Impede avançar se houver erros
      }
    }

    // Valida Step 3 (Configurações de Premiações)
    if (currentStep === 3) {
      const isValid = stepConfiguracoesPremiacoesRef.current?.validar();
      if (!isValid) {
        console.log('Validação do Step Configurações de Premiações falhou');
        return; // Impede avançar se houver erros
      }
    }

    // Step 6: Envia dados para API
    if (currentStep === 6) {
      setIsSubmitting(true);
      try {
        await stepResumoRef.current?.handleSubmit();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

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

        <CreateWizardProvider>
          <div className="bg-white rounded-xl p-8 mt-20">
            {currentStep === 1 && <StepDadosBasicos ref={stepDadosBasicosRef} />}
            {currentStep === 2 && <StepPublico ref={stepPublicoRef} />}
            {currentStep === 3 && (
              <StepConfiguracoesPremiacoes ref={stepConfiguracoesPremiacoesRef} />
            )}
            {currentStep === 4 && <StepPremios />}
            {currentStep === 5 && <StepPersonalizacao />}
            {currentStep === 6 && <StepResumo ref={stepResumoRef} />}
            <Separator className="my-8" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {currentStep > 1 && currentStep < 6 && (
                  <Button variant="outline" onClick={prevStep}>
                    Voltar
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {currentStep === 6 ? (
                  <>
                    <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                      Voltar
                    </Button>
                    <Button
                      variant="success"
                      onClick={nextStep}
                      disabled={isSubmitting}
                      className="min-w-32"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Criar Benefício'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button variant="info" onClick={nextStep}>
                    Próximo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CreateWizardProvider>
      </CardContent>
    </Card>
  );
}
