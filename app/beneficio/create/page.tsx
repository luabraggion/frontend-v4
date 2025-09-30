'use client';

import { Breadcrumb } from '@/components/layout';
import { PaginationWrapper, ProgressBarCircle } from '@/components/navigation';
import { Step } from '@/components/navigation/ProgressBarCircle';
import { usePageTitle } from '@/components/PageTitleContext';
import { useEffect, useMemo, useState } from 'react';

import { Drawer } from '@/components/Drawer';
import { AlertDialogWrapper } from '@/components/feedback';
import { CustomSelect, Input, Label } from '@/components/forms';
import { Button } from '@/components/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Premio, TablePremios } from '@/components/ui/table-premios';
import { Clock4, Plus, Trash } from 'lucide-react';
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

  // Estado para armazenar o prêmio que será editado ou adicionado
  const [premioParaEditar, setPremioParaEditar] = useState<Premio | null>(null);

  // Estado para armazenar o ID do prêmio que será excluído
  const [premioIdParaExcluir, setPremioIdParaExcluir] = useState<number | null>(null);

  // Estado para controle do Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectValueTipo, setSelectedValueTipo] = useState<string | null>(null);

  // Função unificada para abrir o drawer (adição ou edição)
  const abrirDrawerPremio = (premio?: Premio) => {
    // Se não receber um prêmio, cria um novo
    if (!premio) {
      // Cria um prêmio vazio para adicionar novo
      const novoPremio: Premio = {
        id: Math.max(0, ...premios.map((p) => p.id)) + 1, // Gera um novo ID
        posicao: premios.length + 1,
        tipo: 'Produto', // Tipo padrão
        nome: '', // Nome em branco para detectar que é um novo prêmio
        estoque: null, // Estoque ilimitado por padrão
        ativo: true, // Ativo por padrão
      };

      console.log('Iniciando adição de novo prêmio');
      setPremioParaEditar(novoPremio);
      setSelectedValueTipo('Produto');
    } else {
      // Caso de edição
      console.log('Preparando edição do prêmio:', premio);
      setPremioParaEditar(premio);
      setSelectedValueTipo(premio.tipo);
    }

    setIsDrawerOpen(true);
  };

  // Função para preparar exclusão (abre modal)
  const prepararExclusao = (id: number) => {
    console.log('Preparando exclusão do prêmio ID:', id);
    setPremioIdParaExcluir(id);
    setPauseMode(false);
    setOpenDialog(true);
  };

  // Função para confirmar exclusão (chamada após confirmar no modal)
  const confirmarExclusao = () => {
    if (premioIdParaExcluir !== null) {
      console.log('Excluindo prêmio ID:', premioIdParaExcluir);
      setPremios((prev) => prev.filter((p) => p.id !== premioIdParaExcluir));
      setPremioIdParaExcluir(null);
    }
    setOpenDialog(false);
  };

  // Estado para controle do AlertDialog de Excluir
  const [openDialog, setOpenDialog] = useState(false);

  // Estado para controlar o método se será pausar campanha ou excluído
  const [pauseMode, setPauseMode] = useState(false);

  // Estados para controle da paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 3;

  // Calcula o total de páginas
  const totalPaginas = Math.ceil(premios.length / itensPorPagina);

  // Filtra os prêmios para exibir apenas os da página atual
  const premiosExibidos = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return premios.slice(inicio, fim);
  }, [premios, paginaAtual, itensPorPagina]);

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
                  <Button onClick={() => abrirDrawerPremio()} className="gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    <span>Adicionar</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Prêmios são as recompensas que o cliente pode receber ao participar do benefício.
                </CardDescription>
              </CardHeader>
              <TablePremios
                premios={premiosExibidos}
                onEdit={abrirDrawerPremio}
                onDelete={prepararExclusao}
              />
              <div className="mt-6 flex justify-center">
                <PaginationWrapper
                  currentPage={paginaAtual}
                  totalPages={totalPaginas}
                  onPageChange={setPaginaAtual}
                  maxVisiblePages={5}
                  className="mt-4"
                />
              </div>
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
      {/* AlertDialog para ação Editar */}
      <AlertDialogWrapper
        open={openDialog}
        onOpenChange={setOpenDialog}
        trigger={null}
        showAction={true}
        actionVariant={pauseMode ? 'warning' : 'destructive'}
        icon={
          pauseMode ? (
            <Clock4 size={40} className="text-yellow-500" />
          ) : (
            <Trash size={40} className="text-red-500" />
          )
        }
        title={pauseMode ? 'Pausar Benefício' : 'Excluir Prêmio'}
        description={
          pauseMode
            ? 'Ele ficará indisponível até ser reativado e pode ser ativado a qualquer momento.'
            : 'Confirma a exclusão deste prêmio? Essa ação não poderá ser desfeita.'
        }
        actionText={pauseMode ? 'Pausar' : 'Excluir'}
        className="w-full max-w-xs"
        onAction={pauseMode ? () => setOpenDialog(false) : confirmarExclusao}
      />

      {/* Drawer para edição de prêmio */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setPremioParaEditar(null);
        }}
        actions={
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={() => {
                setIsDrawerOpen(false);
                setPremioParaEditar(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="flex-1 bg-sky-100 text-sky-800 font-semibold hover:border-sky-200 hover:bg-sky-100"
              onClick={() => {
                // Verifica se é uma edição ou adição de prêmio
                if (premioParaEditar) {
                  const isNewPremio = !premios.some((p) => p.id === premioParaEditar.id);
                  console.log(
                    isNewPremio ? 'Adicionando novo prêmio:' : 'Salvando alterações no prêmio:',
                    premioParaEditar,
                  );

                  if (isNewPremio) {
                    // Adicionar novo prêmio à lista
                    setPremios((prev) => [
                      ...prev,
                      { ...premioParaEditar, tipo: selectValueTipo as any },
                    ]);
                  } else {
                    // Atualizar prêmio existente
                    setPremios((prev) =>
                      prev.map((p) =>
                        p.id === premioParaEditar.id
                          ? { ...premioParaEditar, tipo: selectValueTipo as any }
                          : p,
                      ),
                    );
                  }
                }
                setIsDrawerOpen(false);
                setPremioParaEditar(null);
              }}
            >
              {premioParaEditar && premios.some((p) => p.id === premioParaEditar.id)
                ? 'Salvar'
                : 'Adicionar'}
            </Button>
          </div>
        }
        title={premioParaEditar && premioParaEditar.nome ? 'Editar Prêmio' : 'Adicionar Prêmio'}
        description={
          premioParaEditar && premioParaEditar.nome
            ? 'Edite os detalhes do prêmio como nome, tipo e estoque. Certifique-se de salvar as alterações ao finalizar.'
            : 'Adicione um novo prêmio preenchendo os campos abaixo. Todos os prêmios serão exibidos na lista de prêmios.'
        }
      >
        <div className="grid flex-1 auto-rows-min gap-6">
          <div className="grid gap-3">
            <Input
              id="premio-nome"
              label="Nome do Prêmio"
              defaultValue={premioParaEditar?.nome}
              onChange={(e) => {
                if (premioParaEditar) {
                  setPremioParaEditar({ ...premioParaEditar, nome: e.target.value });
                }
              }}
              className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-sky-200"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="premio-tipo">Tipo de Prêmio</Label>
            <CustomSelect
              options={[
                { label: 'Produto', value: 'Produto' },
                { label: 'Não premiado', value: 'Não premiado' },
                { label: 'Cupom', value: 'Cupom' },
                { label: 'Produto Externo', value: 'Produto Externo' },
              ]}
              value={selectValueTipo}
              onChange={(value) => setSelectedValueTipo(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione o tipo..."
            />
          </div>
          <div className="grid gap-3">
            <Input
              id="premio-estoque"
              label="Estoque"
              type="number"
              defaultValue={
                premioParaEditar?.estoque === null ? '' : String(premioParaEditar?.estoque)
              }
              onChange={(e) => {
                if (premioParaEditar) {
                  const valor = e.target.value === '' ? null : parseInt(e.target.value, 10);
                  setPremioParaEditar({ ...premioParaEditar, estoque: valor });
                }
              }}
              className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-sky-200"
              placeholder="Deixe em branco para ilimitado"
            />
          </div>
        </div>
      </Drawer>
    </Card>
  );
}
