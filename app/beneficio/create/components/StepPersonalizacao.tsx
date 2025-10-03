import { Wheel } from '@/components/feedback/Wheel';
import { Label } from '@/components/forms';
import { Button, ButtonWithIcon } from '@/components/index';
import { IPhoneMockup } from '@/components/mockups';
import { Accordion } from '@/components/ui/accordion';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DownloadIcon, MinusIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import ColorPickerFixed from './ColorPickerFixed';
import { useCreateWizard } from './CreateWizardContext';
import { SingleColorPicker } from './SingleColorPicker';
import { UploadAccordionItem } from './UploadAccordionItem';
import { useFileUploads, useItensPersonalizacao, useItensUpload } from './useFileUploads';

/**
 * Componente para a etapa de personalização do benefício
 * Responsável por gerenciar uploads e mostrar pré-visualização
 */
const StepPersonalizacao: React.FC = () => {
  // Hook para gerenciar os uploads de arquivos
  const { handleFileSelect: originalHandleFileSelect } = useFileUploads();

  // Função personalizada para lidar com a seleção de arquivos
  const handleFileSelect = (uploadId: string, file: File | null) => {
    // Chama a função original do hook apenas se o arquivo não for nulo
    if (file !== null) {
      originalHandleFileSelect(uploadId, file);
    }

    // Salva o arquivo no estado local
    setDadosPersonalizacao((prev) => ({
      ...prev,
      arquivos: {
        ...prev.arquivos,
        [uploadId]: file,
      },
    }));

    console.log(`Arquivo selecionado para ${uploadId}:`, file);
  };

  // Estado para controlar qual bloco está ativo (personalização ativa por padrão)
  const [blocoAtivo, setBlocoAtivo] = useState('personalizacao');

  // Propriedades derivadas para verificar qual bloco está ativo
  const personalizacaoAtiva = blocoAtivo === 'personalizacao';
  const envioAtivo = blocoAtivo === 'envio';

  // Estado para armazenar as cores selecionadas para a roleta
  const [coresRoleta, setCoresRoleta] = useState<string[]>([
    '#F97316',
    '#FACC15',
    '#8B5CF6',
    '#4338CA',
  ]);

  // Estado para armazenar a cor do botão girar
  const [corBotaoGirar, setCorBotaoGirar] = useState<string>('#FFFFFF');

  // Estado para armazenar a cor do texto do botão girar
  const [corTextoBotao, setCorTextoBotao] = useState<string>('#000000');

  // Número de divisões agora reflete a quantidade de prêmios do passo 4
  const { premios } = useCreateWizard();
  const numeroDivisoes = useMemo(() => premios.length || 12, [premios.length]);
  const maxDivisoes = 12; // mantém para validações e textos

  // Referência para controlar o giro da roleta externamente
  const wheelSpinRef = useRef<(opts?: { forceIndex?: number }) => void>(null);

  // Estado para controlar se a roleta está girando
  const [roletaGirando, setRoletaGirando] = useState<boolean>(false);

  // Estado para armazenar arquivos e dados de personalização
  const [dadosPersonalizacao, setDadosPersonalizacao] = useState<{
    cores: string[];
    divisoes: number;
    corBotao: string;
    corTextoBotao: string;
    arquivos: Record<string, File | null>;
  }>({
    cores: coresRoleta,
    divisoes: numeroDivisoes,
    corBotao: corBotaoGirar,
    corTextoBotao: corTextoBotao,
    arquivos: {},
  });

  // Função para lidar com clique no botão de envio
  const handleEnvioClick = () => {
    setBlocoAtivo('envio'); // Ativa o bloco de envio e desativa o de personalização
  };

  // Função para lidar com clique no botão de personalização
  const handlePersonalizarClick = () => {
    setBlocoAtivo('personalizacao'); // Ativa o bloco de personalização e desativa o de envio
  };

  // Funções para ajustar o número de divisões da roleta
  // Controles de divisão ficam desabilitados, pois é derivado de prêmios
  const aumentarDivisoes = () => {};
  const diminuirDivisoes = () => {};
  const handleChangeDivisoes = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  // Função para ajustar o array de cores quando o número de divisões muda
  const ajustarCoresPorDivisoes = (novasDivisoes: number) => {
    // Cores padrão para preencher quando necessário
    const coresPadrao = [
      '#F97316',
      '#FACC15',
      '#8B5CF6',
      '#4338CA',
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF33A8',
      '#33A8FF',
      '#FFA833',
      '#A833FF',
      '#33FFA8',
    ];

    if (novasDivisoes > coresRoleta.length) {
      // Adicionar cores até atingir o número desejado
      const coresAdicionais = coresPadrao.slice(coresRoleta.length, novasDivisoes);
      setCoresRoleta([...coresRoleta, ...coresAdicionais]);
    } else if (novasDivisoes < coresRoleta.length) {
      // Remover cores excedentes
      setCoresRoleta(coresRoleta.slice(0, novasDivisoes));
    }
  };

  // Reage às mudanças de quantidade de prêmios (numeroDivisoes) para ajustar as cores
  // evitando descompasso entre slots e array de cores
  React.useEffect(() => {
    ajustarCoresPorDivisoes(numeroDivisoes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeroDivisoes]);

  // Função para salvar os dados de personalização
  const salvarPersonalizacao = (itemId?: string) => {
    // Atualiza o estado com os dados atuais
    setDadosPersonalizacao((prev) => {
      const novosDados = {
        ...prev,
        cores: coresRoleta,
        divisoes: numeroDivisoes,
        corBotao: corBotaoGirar,
        corTextoBotao: corTextoBotao,
      };

      // Sincroniza os estados individuais com os dados salvos
      setCoresRoleta(novosDados.cores);
      // numeroDivisoes é derivado e não deve ser setado diretamente aqui
      setCorBotaoGirar(novosDados.corBotao);
      setCorTextoBotao(novosDados.corTextoBotao);

      return novosDados;
    });

    // Exibe mensagem de feedback
    console.log(`Configurações de ${itemId || 'personalização'} salvas com sucesso!`);

    // Retorna os dados para uso externo (por exemplo, para enviar à API)
    return {
      cores: coresRoleta,
      divisoes: numeroDivisoes,
      corBotao: corBotaoGirar,
      corTextoBotao: corTextoBotao,
      arquivos: dadosPersonalizacao.arquivos,
    };
  };

  return (
    <section className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Personalização</CardTitle>
        <CardDescription>
          A Personalização permite ajustar a roleta e as artes visuais, escolhendo cores, imagens e
          elementos graficos para que a campanha reflita a identidade e o estilo da sua marca.
        </CardDescription>
      </CardHeader>
      <section className="flex gap-4">
        <div
          className={`grid grid-flow-col grid-rows-3 gap-x-6 gap-y-2 border rounded-2xl p-10 items-center basis-1/2 transition-all duration-300 ${
            personalizacaoAtiva ? 'border-warning ring-2 ring-warning/20' : 'border'
          }`}
        >
          <div className="row-span-3 justify-items-center">
            <Image
              src="/images/persona.png"
              alt="Personalização"
              width={100}
              height={100}
              priority
              className={personalizacaoAtiva ? 'scale-105 transition-transform' : ''}
            />
          </div>
          <div className="col-span-2 text-2xl font-medium">Personalize sua roleta</div>
          <div className="col-span-2 text-sm text-gray-500">
            Ajuste o design da roleta escolhendo cores, botão de giro e banners do aplicativo.
          </div>
          <div className="col-span-2">
            <Button
              variant={personalizacaoAtiva ? 'warning' : 'outline'}
              className="w-full"
              onClick={handlePersonalizarClick}
            >
              {personalizacaoAtiva ? 'Personalizar' : 'Selecionar para personalizar'}
            </Button>
          </div>
        </div>
        <div
          className={`grid grid-flow-col grid-rows-3 gap-x-6 gap-y-2 border rounded-2xl p-10 items-center basis-1/2 transition-all duration-300 ${
            envioAtivo ? 'border-success ring-2 ring-success/20' : 'border'
          }`}
        >
          <div className="row-span-3 justify-items-center">
            <Image
              src="/images/envio.png"
              alt="Envio"
              width={100}
              height={100}
              priority
              className={envioAtivo ? 'scale-105 transition-transform' : ''}
            />
          </div>
          <div className="col-span-2 text-2xl font-medium">Faça upload de seus arquivos</div>
          <div className="col-span-2 text-sm text-gray-500">
            Envie imagens proprias para a roleta, banner de chamadas e folheto de regras.
          </div>
          <div className="col-span-2">
            <Button
              variant={envioAtivo ? 'success' : 'outline'}
              className="w-full"
              onClick={handleEnvioClick}
            >
              {envioAtivo ? 'Enviar Arquivos' : 'Selecionar para enviar'}
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <Label className="text-[1.2rem]">Estrutura da Roleta</Label>
        <CardDescription className="mb-4">
          A estrutura da roleta define como os prêmios serão distribuídos visualmente. Aqui você
          pode ajustar as configurações de cada prêmio, incluindo a imagem, o valor e a quantidade
          disponível.
        </CardDescription>
        {blocoAtivo === 'envio' && (
          <div className="mt-10">
            <div>
              <h1>Formatos dos arquivos</h1>
              <p className="text-sm text-muted-foreground">
                Baixe os formatos recomendados para que suas imagens fiquem no tamanho ideal no app.
              </p>
              <ButtonWithIcon variant="info" icon={<DownloadIcon />} className="mt-4">
                Baixar formatos
              </ButtonWithIcon>
              <Accordion type="single" collapsible className="flex flex-col gap-y-4 mt-10">
                {/* Utilizando o componente reutilizável para os itens de upload com configuração */}
                {useItensUpload.map((item, index) => (
                  <UploadAccordionItem
                    key={item.id}
                    value={`item-${index + 1}`}
                    title={item.title}
                    description={item.description}
                    uploadLabel={item.uploadLabel}
                    onFileSelect={(file) => handleFileSelect(item.id, file)}
                    accept={item.accept}
                    acceptText={item.acceptText}
                    maxSizeMB={item.maxSizeMB}
                  />
                ))}
              </Accordion>
            </div>
          </div>
        )}
        {blocoAtivo === 'personalizacao' && (
          <div className="mt-10">
            <Accordion type="single" collapsible className="flex flex-col gap-y-4">
              {/* Utilizando o componente reutilizável para os itens de upload com configuração */}
              {useItensPersonalizacao.map((item, index) => (
                <UploadAccordionItem
                  key={item.id}
                  value={`item-${index + 1}`}
                  title={item.title}
                  description={item.description}
                  uploadLabel={item.uploadLabel}
                  onFileSelect={(file) => handleFileSelect(item.id, file)}
                  accept={item.accept}
                  acceptText={item.acceptText}
                  maxSizeMB={item.maxSizeMB}
                >
                  {/* Renderização condicional com if/else baseado no id do item */}
                  {(() => {
                    if (item.id === 'divisao-roleta') {
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                          {/* Lado esquerdo - Controle do número de divisões */}
                          <div className="lg:col-span-2">
                            <div className="flex flex-col space-y-4">
                              <Label htmlFor="num-divisoes" className="text-base font-medium">
                                Número de divisões
                              </Label>
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  type="button"
                                  onClick={diminuirDivisoes}
                                  disabled
                                  className="h-9 w-9 flex items-center justify-center"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </Button>
                                <div className="relative w-24">
                                  <Input
                                    id="num-divisoes"
                                    type="number"
                                    min={2}
                                    max={maxDivisoes}
                                    value={numeroDivisoes}
                                    onChange={handleChangeDivisoes}
                                    className="text-center"
                                    disabled
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  type="button"
                                  onClick={aumentarDivisoes}
                                  disabled
                                  className="h-9 w-9 flex items-center justify-center"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                A quantidade de divisões é definida automaticamente pela quantidade
                                de prêmios no passo 4.
                              </p>
                            </div>
                          </div>

                          {/* Lado direito - Visualização */}
                          <div className="flex flex-col items-center justify-start">
                            <h3 className="text-lg font-semibold mb-2">Visualização da Roleta</h3>
                            <div className="relative flex justify-center">
                              <IPhoneMockup>
                                <div className="flex flex-col justify-between h-full">
                                  <div className="p-3 text-center">
                                    <h4 className="font-medium text-base">Prévia da Roleta</h4>
                                  </div>
                                  <div className="flex-grow flex items-center justify-center">
                                    <Wheel
                                      size={250}
                                      options={coresRoleta
                                        .slice(0, numeroDivisoes)
                                        .map((cor, index) => ({
                                          label: premios[index]?.nome || `Prêmio ${index + 1}`,
                                          color: cor,
                                        }))}
                                      showSpinButton={true}
                                      spinButtonLabel="Girar"
                                      spinButtonColor={dadosPersonalizacao.corBotao}
                                      spinButtonTextColor={dadosPersonalizacao.corTextoBotao}
                                      textOrientation="horizontal"
                                    />
                                  </div>
                                  <div className="p-3 flex justify-center">
                                    <span className="text-xs text-muted-foreground">
                                      Roleta com {numeroDivisoes} segmentos
                                    </span>
                                  </div>
                                </div>
                              </IPhoneMockup>
                            </div>

                            {/* Botão para salvar as configurações */}
                            <div className="mt-6">
                              <Button
                                variant="success"
                                onClick={() => {
                                  const dados = salvarPersonalizacao('divisao-roleta');
                                  console.log('Dados salvos:', dados);
                                }}
                              >
                                Salvar Configurações
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (item.id === 'cores-roleta') {
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                          {/* Lado esquerdo - Seletor de cores */}
                          <div className="lg:col-span-2">
                            <ColorPickerFixed
                              count={numeroDivisoes || 12}
                              defaultColors={coresRoleta}
                              onChange={(colors: string[]) => {
                                // Mantém o mesmo número de cores (fixo via count) e apenas edita valores
                                setCoresRoleta(colors);
                                // Não permitir alterar numeroDivisoes por aqui; ele vem de outra etapa/regra
                                console.log('Cores atualizadas (fixas):', colors);
                              }}
                            />
                          </div>

                          {/* Lado direito - Visualização */}
                          <div className="flex flex-col items-center justify-start">
                            <h3 className="text-lg font-semibold mb-2">Visualização da Roleta</h3>
                            <div className="relative flex justify-center">
                              <IPhoneMockup>
                                <div className="flex flex-col justify-between h-full">
                                  <div className="p-3 text-center">
                                    <h4 className="font-medium text-base">Prévia da Roleta</h4>
                                  </div>
                                  <div className="flex-grow flex items-center justify-center">
                                    <Wheel
                                      size={250}
                                      options={coresRoleta
                                        .slice(0, numeroDivisoes)
                                        .map((cor, index) => ({
                                          label: premios[index]?.nome || `Prêmio ${index + 1}`,
                                          color: cor,
                                        }))}
                                      showSpinButton={true}
                                      spinButtonLabel="Girar"
                                      spinButtonColor={dadosPersonalizacao.corBotao}
                                      spinButtonTextColor={dadosPersonalizacao.corTextoBotao}
                                      textOrientation="vertical"
                                    />
                                  </div>
                                  <div className="p-3 flex justify-center">
                                    <span className="text-xs text-muted-foreground">
                                      Roleta com {numeroDivisoes} segmentos
                                    </span>
                                  </div>
                                </div>
                              </IPhoneMockup>
                            </div>

                            {/* Botão para salvar as configurações */}
                            <div className="mt-6">
                              <Button
                                variant="success"
                                onClick={() => {
                                  const dados = salvarPersonalizacao('cores-roleta');
                                  console.log('Dados salvos:', dados);
                                  // Aqui você pode adicionar uma notificação de sucesso ou outro feedback visual
                                }}
                              >
                                Salvar Configurações
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (item.id === 'botao-girar') {
                      // Verificar se a cor atual do botão não está em uso na roleta para evitar conflitos visuais
                      const isColorAlreadyUsed = coresRoleta.includes(corBotaoGirar);

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                          {/* Lado esquerdo - Seletor de cores */}
                          <div className="lg:col-span-2">
                            <div className="space-y-4">
                              <div className="p-4 bg-accent/30 rounded-lg text-sm">
                                <p className="font-medium mb-1">Personalização do Botão de Giro</p>
                                <p>
                                  Este botão será utilizado pelos usuários para girar a roleta.
                                  Escolha uma cor que combine com as cores da sua roleta e chame a
                                  atenção.
                                </p>
                              </div>

                              {isColorAlreadyUsed && (
                                <div className="p-3 bg-warning/20 border border-warning rounded-md text-sm">
                                  <p className="flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    A cor selecionada para o botão também está sendo usada na
                                    roleta. Considere escolher uma cor diferente para melhor
                                    contraste visual.
                                  </p>
                                </div>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <SingleColorPicker
                                    defaultColor={corBotaoGirar}
                                    label="Escolha a cor do botão girar"
                                    onChange={(color: string) => {
                                      setCorBotaoGirar(color);
                                      console.log('Cor do botão atualizada:', color);
                                    }}
                                  />
                                </div>
                                <div>
                                  <SingleColorPicker
                                    defaultColor={corTextoBotao}
                                    label="Escolha a cor do texto do botão"
                                    onChange={(color: string) => {
                                      setCorTextoBotao(color);
                                      console.log('Cor do texto do botão atualizada:', color);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lado direito - Visualização */}
                          <div className="flex flex-col items-center justify-start">
                            <h3 className="text-lg font-semibold mb-2">
                              Visualização da Roleta com Botão
                            </h3>
                            <div className="relative flex justify-center">
                              <IPhoneMockup>
                                <div className="flex flex-col justify-between h-full">
                                  <div className="p-3 text-center">
                                    <h4 className="font-medium text-base">Prévia da Roleta</h4>
                                  </div>
                                  <div className="flex-grow flex flex-col items-center justify-center gap-4">
                                    {/* Roleta */}
                                    <Wheel
                                      size={250}
                                      options={coresRoleta
                                        .slice(0, numeroDivisoes)
                                        .map((cor, index) => ({
                                          label: premios[index]?.nome || `Prêmio ${index + 1}`,
                                          color: cor,
                                        }))}
                                      showSpinButton={false}
                                      textOrientation="vertical"
                                      externalSpinRef={wheelSpinRef}
                                      onFinish={(option) => {
                                        setTimeout(() => {
                                          setRoletaGirando(false);
                                        }, 100);
                                        console.log('Roleta parou na opção:', option);
                                      }}
                                    />

                                    {/* Botão personalizado */}
                                    <button
                                      style={{
                                        backgroundColor: corBotaoGirar,
                                        borderColor: corBotaoGirar,
                                        color: corTextoBotao,
                                        cursor: roletaGirando ? 'not-allowed' : 'pointer',
                                      }}
                                      className="px-8 py-2 hover:opacity-90 transition-opacity hover:cursor-pointer rounded-lg"
                                      onClick={() => {
                                        if (wheelSpinRef.current && !roletaGirando) {
                                          setRoletaGirando(true);
                                          wheelSpinRef.current();
                                        }
                                      }}
                                      aria-pressed={roletaGirando}
                                      disabled={roletaGirando}
                                    >
                                      {roletaGirando ? 'Girando...' : 'Girar'}
                                    </button>
                                  </div>
                                  <div className="p-3 flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground">
                                      Botão: {corBotaoGirar} | Texto: {corTextoBotao}
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                      <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: corBotaoGirar }}
                                      ></div>
                                      <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: corTextoBotao }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </IPhoneMockup>
                            </div>

                            {/* Botão para salvar as configurações */}
                            <div className="mt-6 flex flex-col gap-2">
                              <Button
                                variant="success"
                                onClick={() => {
                                  const dados = salvarPersonalizacao('botao-girar');
                                  console.log('Dados salvos:', dados);
                                  // Aqui você pode adicionar uma notificação de sucesso ou outro feedback visual
                                }}
                              >
                                Salvar Configurações
                              </Button>
                              <p className="text-xs text-muted-foreground text-center">
                                Roleta com {numeroDivisoes} segmentos e botão personalizado
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Caso para outros tipos de itens que possam ser adicionados no futuro
                      return null;
                    }
                  })()}
                </UploadAccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </section>
    </section>
  );
};

export default StepPersonalizacao;
