import { StepProgressBar } from '../../../components/navigation';

export default function StepProgressBarExample() {
  return (
    <div className="p-6">
      <h1 className="mb-8 text-2xl font-bold">Exemplo de Uso do StepProgressBar</h1>

      <div className="space-y-12">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Etapas Padrão</h2>
          <StepProgressBar currentStep={2} />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Etapas Personalizadas</h2>
          <StepProgressBar
            currentStep={2}
            steps={[
              { id: 1, name: 'Informações Pessoais' },
              { id: 2, name: 'Endereço' },
              { id: 3, name: 'Revisão' },
              { id: 4, name: 'Pagamento' },
            ]}
          />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Configuração de Cores</h2>
          <div className="space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium">Cor Padrão (Azul)</p>
              <StepProgressBar
                currentStep={2}
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Espaçamentos</h2>
          <div className="space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium">Compacto</p>
              <StepProgressBar
                currentStep={2}
                spacing="compact"
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Padrão</p>
              <StepProgressBar
                currentStep={2}
                spacing="default"
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Amplo</p>
              <StepProgressBar
                currentStep={2}
                spacing="wide"
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Diferentes Etapas Atuais</h2>
          <div className="space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium">Etapa 1 - Início</p>
              <StepProgressBar
                currentStep={1}
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Etapa 2 - Meio</p>
              <StepProgressBar
                currentStep={2}
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Etapa 3 - Final</p>
              <StepProgressBar
                currentStep={3}
                steps={[
                  { id: 1, name: 'Passo 1' },
                  { id: 2, name: 'Passo 2' },
                  { id: 3, name: 'Passo 3' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-medium">Como usar:</h2>
        <pre className="overflow-x-auto p-2 text-sm">
          {`// Importe o componente
import { StepProgressBar } from 'components/navigation';

// Use com configuração mínima
<StepProgressBar currentStep={2} />

// Ou personalize completamente
<StepProgressBar 
  currentStep={2}
  steps={[
    { id: 1, name: 'Etapa Um' },
    { id: 2, name: 'Etapa Dois' },
    { id: 3, name: 'Etapa Três' }
  ]}
  spacing="compact"
  showLabels={true}
  numbered={false}
  className="my-8"
/>`}
        </pre>
      </div>
    </div>
  );
}
