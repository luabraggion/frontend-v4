'use client';

import { Drawer } from '@/components/Drawer';
import { AlertDialogWrapper } from '@/components/feedback';
import { CustomSelect, Input, Label } from '@/components/forms';
import { Button } from '@/components/index';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Premio, TablePremios } from '@/components/ui/table-premios';
import { Clock4, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { useCreateWizard } from './CreateWizardContext';

export interface StepPremiosProps {
  // Se necessário, adicionar props específicas que podem ser passadas pelo componente pai
}

export default function StepPremios() {
  // Usa o contexto compartilhado para ler/editar os prêmios
  const { premios, setPremios } = useCreateWizard();

  // Limite máximo de prêmios permitidos
  const MAX_PREMIOS = 12;

  // Estado para armazenar o prêmio que será editado ou adicionado
  const [premioParaEditar, setPremioParaEditar] = useState<Premio | null>(null);

  // Estado para armazenar o ID do prêmio que será excluído
  const [premioIdParaExcluir, setPremioIdParaExcluir] = useState<number | null>(null);

  // Estado para controle do Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectValueTipo, setSelectedValueTipo] = useState<string | null>(null);

  // Estado para indicar se é um novo prêmio
  const [isNovoPremioPendente, setIsNovoPremioPendente] = useState(false);

  // Estado para seleção múltipla
  const [premiosSelecionados, setPremiosSelecionados] = useState<number[]>([]);

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
      setIsNovoPremioPendente(true); // Marca que é um novo prêmio
    } else {
      // Caso de edição
      console.log('Preparando edição do prêmio:', premio);
      setPremioParaEditar(premio);
      setSelectedValueTipo(premio.tipo);
      setIsNovoPremioPendente(false); // Não é novo prêmio
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

  // Função para confirmar exclusão múltipla
  const confirmarExclusaoMultipla = () => {
    if (premiosSelecionados.length > 0) {
      console.log('Excluindo prêmios IDs:', premiosSelecionados);
      setPremios((prev) => prev.filter((p) => !premiosSelecionados.includes(p.id)));
      setPremiosSelecionados([]);
    }
    setOpenDialog(false);
  };

  // Função para selecionar/desselecionar um prêmio
  const toggleSelecaoPremio = (id: number) => {
    setPremiosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((premioId) => premioId !== id) : [...prev, id],
    );
  };

  // Função para selecionar/desselecionar todos
  const toggleSelecaoTodos = () => {
    if (premiosSelecionados.length === premios.length) {
      setPremiosSelecionados([]);
    } else {
      setPremiosSelecionados(premios.map((p) => p.id));
    }
  };

  // Função para preparar exclusão múltipla
  const prepararExclusaoMultipla = () => {
    if (premiosSelecionados.length > 0) {
      setPauseMode(false);
      setOpenDialog(true);
    }
  };

  // Estado para controle do AlertDialog de Excluir
  const [openDialog, setOpenDialog] = useState(false);

  // Estado para controlar o método se será pausar campanha ou excluído
  const [pauseMode, setPauseMode] = useState(false);

  // Estados para controle da paginação (desabilitado por enquanto)
  // const [paginaAtual, setPaginaAtual] = useState(1);
  // const itensPorPagina = 3;
  // const totalPaginas = Math.ceil(premios.length / itensPorPagina);

  return (
    <>
      <section className="space-y-6">
        <CardHeader className="px-0 gap-0">
          <CardTitle className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Lista de Prêmios{' '}
              {premios.length >= MAX_PREMIOS && `(${premios.length}/${MAX_PREMIOS})`}
            </span>
            <div className="flex gap-2">
              {premiosSelecionados.length > 0 && (
                <Button
                  onClick={prepararExclusaoMultipla}
                  variant="destructive"
                  className="gap-2"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                  <span>Excluir ({premiosSelecionados.length})</span>
                </Button>
              )}
              {premios.length < MAX_PREMIOS && (
                <Button onClick={() => abrirDrawerPremio()} className="gap-2" size="sm">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar</span>
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Prêmios são as recompensas que o cliente pode receber ao participar do benefício.
            {premios.length >= MAX_PREMIOS && (
              <span className="text-yellow-600 font-medium">
                {' '}
                Limite máximo de {MAX_PREMIOS} prêmios atingido.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <TablePremios
          premios={premios}
          onEdit={abrirDrawerPremio}
          onDelete={prepararExclusao}
          selectedIds={premiosSelecionados}
          onToggleSelect={toggleSelecaoPremio}
          onToggleSelectAll={toggleSelecaoTodos}
        />
        {/* <div className="mt-6 flex justify-center">
          <PaginationWrapper
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            onPageChange={setPaginaAtual}
            maxVisiblePages={5}
            className="mt-4"
          />
        </div> */}
      </section>

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
        title={
          pauseMode
            ? 'Pausar Benefício'
            : premiosSelecionados.length > 1
              ? 'Excluir Prêmios'
              : 'Excluir Prêmio'
        }
        description={
          pauseMode
            ? 'Ele ficará indisponível até ser reativado e pode ser ativado a qualquer momento.'
            : premiosSelecionados.length > 1
              ? `Confirma a exclusão de ${premiosSelecionados.length} prêmios selecionados? Essa ação não poderá ser desfeita.`
              : 'Confirma a exclusão deste prêmio? Essa ação não poderá ser desfeita.'
        }
        actionText={pauseMode ? 'Pausar' : 'Excluir'}
        className="w-full max-w-xs"
        onAction={
          pauseMode
            ? () => setOpenDialog(false)
            : premiosSelecionados.length > 1
              ? confirmarExclusaoMultipla
              : confirmarExclusao
        }
      />

      {/* Drawer para edição de prêmio */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setPremioParaEditar(null);
          setIsNovoPremioPendente(false);
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
                setIsNovoPremioPendente(false);
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
                  console.log(
                    isNovoPremioPendente
                      ? 'Adicionando novo prêmio:'
                      : 'Salvando alterações no prêmio:',
                    premioParaEditar,
                  );

                  if (isNovoPremioPendente) {
                    // Adicionar novo prêmio à lista
                    console.log('Adicionando à lista de premios:', {
                      ...premioParaEditar,
                      tipo: selectValueTipo,
                    });
                    setPremios((prev) => {
                      const novaLista = [
                        ...prev,
                        { ...premioParaEditar, tipo: selectValueTipo as any },
                      ];
                      console.log('Nova lista de premios:', novaLista);
                      return novaLista;
                    });
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
                setIsNovoPremioPendente(false);
              }}
            >
              {isNovoPremioPendente ? 'Adicionar' : 'Salvar'}
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
              value={premioParaEditar?.nome || ''}
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
              value={
                premioParaEditar?.estoque === null ? '' : String(premioParaEditar?.estoque || '')
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
    </>
  );
}
