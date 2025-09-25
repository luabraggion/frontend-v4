'use client';

/**
 * Barra de progresso para navegação em etapas (wizard)
 * Exibe um indicador visual do progresso com círculos numerados e rótulos
 */

import { Check } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib';

export type StepStatus = 'complete' | 'current' | 'upcoming';

export interface Step {
  id: string | number;
  name: string;
  status?: StepStatus;
  onClick?: () => void;
}

export interface ProgressBarCircleProps {
  /** Lista de etapas a serem exibidas */
  steps?: Step[];
  /** Etapa atual (alternativa a definir o status manualmente) */
  currentStep?: number;
  /** Classes CSS adicionais para o container */
  className?: string;
  /** Espaçamento entre os elementos */
  spacing?: 'default' | 'compact' | 'wide';
  /** Se deve mostrar os rótulos das etapas */
  showLabels?: boolean;
  /** Se deve mostrar números em vez de ícones de verificação */
  numbered?: boolean;
  /** Se deve aplicar o layout padrão com largura máxima e centralização */
  defaultLayout?: boolean;
}

/**
 * Componente de navegação em etapas com círculos e linhas de progresso
 */
const ProgressBarCircle: React.FC<ProgressBarCircleProps> = ({
  steps: propSteps,
  currentStep,
  className,
  spacing = 'default',
  showLabels = true,
  numbered = true,
  defaultLayout = true,
}) => {
  // Etapas padrão quando não fornecidas
  const defaultSteps: Step[] = [
    { id: 1, name: 'Etapa 1', status: 'complete' },
    { id: 2, name: 'Etapa 2', status: 'current' },
    { id: 3, name: 'Etapa 3', status: 'upcoming' },
  ];

  // Se currentStep for fornecido, usamos ele para definir o status das etapas
  let steps = propSteps || defaultSteps;

  if (currentStep !== undefined && propSteps) {
    steps = propSteps.map((step, index) => {
      const stepNumber = typeof step.id === 'number' ? step.id : index + 1;
      let status: StepStatus = 'upcoming';

      if (stepNumber < currentStep) {
        status = 'complete';
      } else if (stepNumber === currentStep) {
        status = 'current';
      }

      return { ...step, status };
    });
  } else if (currentStep !== undefined && !propSteps) {
    // Se apenas currentStep for fornecido, geramos etapas padrão
    steps = Array.from({ length: Math.max(currentStep + 1, 3) }, (_, i) => {
      let status: StepStatus = 'upcoming';
      const stepNumber = i + 1;

      if (stepNumber < currentStep) {
        status = 'complete';
      } else if (stepNumber === currentStep) {
        status = 'current';
      }

      return {
        id: stepNumber,
        name: `Etapa ${stepNumber}`,
        status,
      };
    });
  }
  /**
   * Retorna a classe para a linha de fundo com base no status geral das etapas
   */
  const getBackgroundLineClass = (): string => {
    // Se todas as etapas estão completas, fundo verde
    if (steps.every((step) => step.status === 'complete')) {
      return 'before:bg-green-100 before:dark:bg-green-900/30';
    }

    // Se há alguma etapa com erro (você pode adicionar um status 'error' se necessário)
    // if (steps.some((step) => step.status === 'error')) {
    //   return 'before:bg-red-100 before:dark:bg-red-900/30';
    // }

    // Se pelo menos uma etapa está completa, fundo azul claro
    // if (steps.some((step) => step.status === 'complete')) {
    //   return 'before:bg-blue-200 before:dark:bg-blue-900/20';
    // }

    // Padrão (quando nenhuma etapa foi concluída)
    return 'before:bg-gray-200 before:dark:bg-white/15';
  };

  /**
   * Retorna a classe de espaçamento com base na prop spacing
   */
  const getSpacingClass = (): string => {
    switch (spacing) {
      case 'compact':
        return 'gap-4 sm:gap-10';
      case 'wide':
        return 'gap-24 sm:gap-32';
      default:
        return 'gap-16 sm:gap-24';
    }
  };

  // Calcula o índice do último passo completo ou atual
  const lastActiveIndex =
    steps.findIndex((step) => step.status === 'current') ||
    (steps.every((step) => step.status === 'complete') ? steps.length - 1 : 0);

  // Calcula a largura da linha de progresso
  const progressWidth = `${(100 / (steps.length - 1)) * lastActiveIndex}%`;

  // Renderiza o conteúdo do círculo (número ou ícone)
  const renderStepContent = (step: Step, index: number): React.ReactNode => {
    if (step.status === 'complete' && !numbered) {
      return <Check className="size-5 text-white" aria-hidden="true" />;
    } else {
      const textColorClass =
        step.status === 'upcoming'
          ? 'text-gray-500 dark:text-gray-400'
          : step.status === 'complete'
            ? 'text-white'
            : 'text-blue-500';

      return (
        <span className={`text-lg font-medium leading-none ${textColorClass}`}>{index + 1}</span>
      );
    }
  };

  return (
    <nav aria-label="Progress" className={cn(defaultLayout && 'max-w-5xl mx-auto px-4', className)}>
      <div
        className={cn(
          'relative flex justify-between w-full',
          getSpacingClass(),
          `before:absolute before:top-6 before:left-0 before:h-0.5 before:w-full ${getBackgroundLineClass()}`,
        )}
      >
        {/* Linha de progresso ativa */}
        <div
          className={cn(
            'absolute top-6 left-0 h-0.5 transition-all duration-300 ease-in-out',
            steps.every((step) => step.status === 'complete')
              ? 'bg-green-500 dark:bg-green-500'
              : 'bg-blue-500 dark:bg-blue-500',
          )}
          style={{ width: progressWidth }}
        />

        {/* Círculos e rótulos */}
        {steps.map((step, index) => {
          // Classes do círculo com base no status
          const circleClasses = cn(
            'relative z-10 flex size-12 items-center justify-center rounded-full border-2',
            step.status === 'complete'
              ? steps.every((s) => s.status === 'complete')
                ? 'bg-green-500 border-green-500 dark:bg-green-500 dark:border-green-500'
                : 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500'
              : step.status === 'current'
                ? 'bg-white border-blue-500 dark:bg-gray-900 dark:border-blue-500'
                : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-white/15',
          );

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Círculo */}
              {step.onClick ? (
                <button
                  type="button"
                  onClick={step.onClick}
                  className={cn(
                    circleClasses,
                    step.status === 'complete'
                      ? steps.every((s) => s.status === 'complete')
                        ? 'hover:bg-green-700 dark:hover:bg-green-400'
                        : 'hover:bg-blue-900 dark:hover:bg-blue-400'
                      : step.status === 'current'
                        ? 'hover:bg-blue-50 dark:hover:bg-blue-900'
                        : 'hover:border-gray-300 dark:hover:border-white/25',
                  )}
                  aria-current={step.status === 'current' ? 'step' : undefined}
                >
                  {renderStepContent(step, index)}
                  <span className="sr-only">{step.name}</span>
                </button>
              ) : (
                <div
                  className={circleClasses}
                  aria-current={step.status === 'current' ? 'step' : undefined}
                >
                  {renderStepContent(step, index)}
                  <span className="sr-only">{step.name}</span>
                </div>
              )}

              {/* Rótulo */}
              {showLabels && (
                <div className="absolute top-14 text-center">
                  <span
                    className={cn(
                      'text-sm font-medium inline-block w-[120px] break-words px-1',
                      step.status === 'complete'
                        ? steps.every((s) => s.status === 'complete')
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-blue-400'
                        : step.status === 'current'
                          ? 'text-gray-500 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400',
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ProgressBarCircle;
