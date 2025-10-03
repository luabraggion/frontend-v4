'use client';

import { Button } from '@/components/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useCreateWizard } from './CreateWizardContext';

// Interface para expor métodos do componente
export interface StepResumoRef {
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Step 6: Resumo e Finalização
 * Exibe um resumo de todos os dados e permite enviar à API
 */
const StepResumo = forwardRef<StepResumoRef>((props, ref) => {
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
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expõe os métodos para o componente pai via ref
  useImperativeHandle(ref, () => ({
    handleSubmit,
    isSubmitting,
    error,
  }));

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
                <dt className="font-medium text-muted-foreground">Tipo de Campanha:</dt>
                <dd className="font-semibold">{wizardData.step1.tipoCampanha || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Título da Premiação:</dt>
                <dd className="font-semibold">{wizardData.step1.titulo || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Início da Campanha:</dt>
                <dd className="font-semibold">
                  {wizardData.step1.dataInicioCampanha
                    ? new Date(wizardData.step1.dataInicioCampanha).toLocaleDateString('pt-BR')
                    : '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Fim da Campanha:</dt>
                <dd className="font-semibold">
                  {wizardData.step1.dataFimCampanha
                    ? new Date(wizardData.step1.dataFimCampanha).toLocaleDateString('pt-BR')
                    : '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Início da Visualização:</dt>
                <dd className="font-semibold">
                  {wizardData.step1.dataInicioVisualizacao
                    ? new Date(wizardData.step1.dataInicioVisualizacao).toLocaleDateString('pt-BR')
                    : '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Fim da Visualização:</dt>
                <dd className="font-semibold">
                  {wizardData.step1.dataFimVisualizacao
                    ? new Date(wizardData.step1.dataFimVisualizacao).toLocaleDateString('pt-BR')
                    : '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Visualização sem cadastro:</dt>
                <dd className="font-semibold">
                  {wizardData.step1.habilitarVisualizacaoSemCadastro
                    ? 'Habilitado'
                    : 'Desabilitado'}
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
                <dt className="font-medium text-muted-foreground">Página de exibição:</dt>
                <dd className="font-semibold">{wizardData.step2.tipoPublico || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Tipo de público:</dt>
                <dd className="font-semibold">{wizardData.step2.tipoPublico || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Lojas participantes:</dt>
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
              {/* Filtros de Qualificação */}
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Filtrar por valor gasto:</dt>
                <dd className="font-semibold">
                  {wizardData.step3.filtrarPorValorGasto ? 'Sim' : 'Não'}
                </dd>
              </div>

              {wizardData.step3.filtrarPorValorGasto && wizardData.step3.valorMinimoGasto && (
                <div className="flex justify-between pl-4">
                  <dt className="font-medium text-muted-foreground">Valor mínimo:</dt>
                  <dd className="font-semibold">{wizardData.step3.valorMinimoGasto}</dd>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">
                  Filtrar por produto incentivador:
                </dt>
                <dd className="font-semibold">
                  {wizardData.step3.filtrarPorProduto ? 'Sim' : 'Não'}
                </dd>
              </div>

              {/* Tipo de Resgate */}
              <div className="flex justify-between pt-2 border-t">
                <dt className="font-medium text-muted-foreground">Tipo de resgate:</dt>
                <dd className="font-semibold">{wizardData.step3.tipoResgate || '-'}</dd>
              </div>

              {/* Tipo de Acumulação */}
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Tipo de acumulação:</dt>
                <dd className="font-semibold">{wizardData.step3.tipoAcumulacao || '-'}</dd>
              </div>

              {/* Tipo de Sorteio */}
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Tipo de sorteio:</dt>
                <dd className="font-semibold">{wizardData.step3.tipoSorteio || '-'}</dd>
              </div>

              {/* Arquivo de Regulamento */}
              <div className="flex justify-between pt-2 border-t">
                <dt className="font-medium text-muted-foreground">Documento de regulamento:</dt>
                <dd className="font-semibold">
                  {wizardData.step3.arquivoRegulamento
                    ? wizardData.step3.arquivoRegulamento.name
                    : 'Não enviado'}
                </dd>
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
            <dl className="space-y-4 text-sm">
              {/* Cores */}
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground">Cores da roleta:</dt>
                <dd className="flex gap-1">
                  {wizardData.step5.cores.slice(0, 6).map((cor, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: cor }}
                      title={cor}
                    />
                  ))}
                  {wizardData.step5.cores.length > 6 && (
                    <span className="text-xs text-muted-foreground">
                      +{wizardData.step5.cores.length - 6}
                    </span>
                  )}
                </dd>
              </div>

              {/* Cor do botão */}
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

              {/* Cor do texto do botão */}
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground">Cor do texto do botão:</dt>
                <dd className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: wizardData.step5.corTextoBotao }}
                  />
                  <span className="text-xs">{wizardData.step5.corTextoBotao}</span>
                </dd>
              </div>

              {/* Arquivos Enviados */}
              <div className="space-y-3 pt-2 border-t">
                <dt className="font-medium text-muted-foreground">Arquivos:</dt>

                {/* Banner de Chamada */}
                {wizardData.step5.arquivos.banner && (
                  <dd className="flex items-center justify-between bg-accent/30 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden flex items-center justify-center border">
                        {wizardData.step5.arquivos.banner.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(wizardData.step5.arquivos.banner)}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">IMG</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Banner de Chamada</p>
                        <p className="text-xs text-muted-foreground">
                          {wizardData.step5.arquivos.banner.name} (
                          {(wizardData.step5.arquivos.banner.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </dd>
                )}

                {/* Folheto de Regras */}
                {wizardData.step5.arquivos.folheto && (
                  <dd className="flex items-center justify-between bg-accent/30 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden flex items-center justify-center border">
                        {wizardData.step5.arquivos.folheto.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(wizardData.step5.arquivos.folheto)}
                            alt="Folheto preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">PDF</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Folheto de Regras</p>
                        <p className="text-xs text-muted-foreground">
                          {wizardData.step5.arquivos.folheto.name} (
                          {(wizardData.step5.arquivos.folheto.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </dd>
                )}

                {/* Imagem da Roleta */}
                {wizardData.step5.arquivos.roleta && (
                  <dd className="flex items-center justify-between bg-accent/30 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden flex items-center justify-center border">
                        {wizardData.step5.arquivos.roleta.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(wizardData.step5.arquivos.roleta)}
                            alt="Roleta preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">IMG</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Imagem da Roleta</p>
                        <p className="text-xs text-muted-foreground">
                          {wizardData.step5.arquivos.roleta.name} (
                          {(wizardData.step5.arquivos.roleta.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </dd>
                )}

                {/* Mensagem quando nenhum arquivo foi enviado */}
                {!wizardData.step5.arquivos.banner &&
                  !wizardData.step5.arquivos.folheto &&
                  !wizardData.step5.arquivos.roleta && (
                    <dd className="text-muted-foreground italic py-2">
                      Nenhum arquivo personalizado enviado
                    </dd>
                  )}
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}
    </section>
  );
});

StepResumo.displayName = 'StepResumo';

export default StepResumo;
