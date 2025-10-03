'use client';

import { Button } from '@/components/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateWizard } from './CreateWizardContext';

/**
 * Step 6: Resumo e Finalização
 * Exibe um resumo de todos os dados e permite enviar à API
 */
export default function StepResumo() {
  const { wizardData, getFormData, resetWizard } = useCreateWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para enviar os dados à API
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = getFormData();

      // Aqui você pode transformar os dados antes de enviar
      const payload = {
        dadosBasicos: formData.step1,
        publico: formData.step2,
        configuracoes: formData.step3,
        premios: formData.step4,
        personalizacao: {
          cores: formData.step5.cores,
          corBotao: formData.step5.corBotao,
          corTextoBotao: formData.step5.corTextoBotao,
          // Arquivos serão tratados separadamente (FormData ou upload S3)
        },
      };

      console.log('Enviando dados:', payload);

      // Exemplo de chamada à API
      const response = await fetch('/api/beneficios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar benefício');
      }

      const result = await response.json();
      console.log('Benefício criado com sucesso:', result);

      setIsSuccess(true);

      // Opcional: resetar o wizard após sucesso
      // setTimeout(() => resetWizard(), 2000);
    } catch (err) {
      console.error('Erro ao enviar:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-semibold">Benefício criado com sucesso!</h2>
        <p className="text-muted-foreground">O benefício foi salvo e está pronto para uso.</p>
        <Button onClick={() => (window.location.href = '/')}>Voltar para o início</Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Resumo do Benefício</CardTitle>
        <CardDescription>
          Revise todos os dados antes de finalizar a criação do benefício.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {/* Resumo - Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Nome:</dt>
                <dd className="font-semibold">{wizardData.step1.nome || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Descrição:</dt>
                <dd className="font-semibold">{wizardData.step1.descricao || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Período:</dt>
                <dd className="font-semibold">
                  {wizardData.step1.dataInicio || '-'} até {wizardData.step1.dataFim || '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Resumo - Público */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Público Alvo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Tipo de público:</dt>
                <dd className="font-semibold">{wizardData.step2.tipoPublico || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Segmentos:</dt>
                <dd className="font-semibold">{wizardData.step2.segmentos?.join(', ') || '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Resumo - Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Configurações de Premiação</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Tipo:</dt>
                <dd className="font-semibold">{wizardData.step3.tipoPremiacoes || '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Resumo - Prêmios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">4. Prêmios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Total de {wizardData.step4.length} prêmios cadastrados
            </p>
            <ul className="space-y-1">
              {wizardData.step4.map((premio) => (
                <li key={premio.id} className="text-sm">
                  • {premio.nome} ({premio.tipo})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Resumo - Personalização */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">5. Personalização</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground">Cores da roleta:</dt>
                <dd className="flex gap-1">
                  {wizardData.step5.cores.slice(0, 6).map((cor, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                  {wizardData.step5.cores.length > 6 && (
                    <span className="text-xs text-muted-foreground">
                      +{wizardData.step5.cores.length - 6}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground">Cor do botão:</dt>
                <dd className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: wizardData.step5.corBotao }}
                  />
                  <span className="text-xs">{wizardData.step5.corBotao}</span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-4 justify-end pt-4">
        <Button variant="outline" onClick={resetWizard} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
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
      </div>
    </section>
  );
}
