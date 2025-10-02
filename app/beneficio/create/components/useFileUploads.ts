import { useState } from 'react';

/**
 * Interface para as informações básicas de um arquivo
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

/**
 * Interface para as opções de upload
 */
export interface UploadItemConfig {
  id: string;
  title: string;
  description: string;
  uploadLabel: string;
  accept?: string;
  acceptText?: string;
  maxSizeMB?: number;
}

/**
 * Hook para gerenciar uploads de múltiplos arquivos
 *
 * @returns - Funções e estado para gerenciamento de uploads
 */
export const useFileUploads = () => {
  // Estado para armazenar os arquivos enviados pelo usuário
  const [files, setFiles] = useState<Record<string, File | null>>({});

  /**
   * Manipula a seleção de um arquivo para um item específico
   *
   * @param id - ID do item de upload
   * @param file - Arquivo selecionado
   */
  const handleFileSelect = (id: string, file: File) => {
    setFiles((prev) => ({
      ...prev,
      [id]: file,
    }));

    // Log das informações do arquivo
    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    console.warn(`Arquivo selecionado (${id}):`, fileInfo);
  };

  /**
   * Limpa o arquivo selecionado para um item específico
   *
   * @param id - ID do item de upload
   */
  const clearFile = (id: string) => {
    setFiles((prev) => ({
      ...prev,
      [id]: null,
    }));
  };

  /**
   * Obtém o arquivo selecionado para um item específico
   *
   * @param id - ID do item de upload
   * @returns O arquivo selecionado ou null
   */
  const getFile = (id: string): File | null => {
    return files[id] || null;
  };

  /**
   * Verifica se todos os arquivos obrigatórios foram enviados
   *
   * @param requiredIds - Lista de IDs dos itens obrigatórios
   * @returns true se todos os arquivos obrigatórios foram enviados, false caso contrário
   */
  const areRequiredFilesUploaded = (requiredIds: string[]): boolean => {
    return requiredIds.every((id) => !!files[id]);
  };

  return {
    handleFileSelect,
    clearFile,
    getFile,
    areRequiredFilesUploaded,
    files,
  };
};

/**
 * Configurações dos itens de upload para a personalização da roleta
 */
export const useItensUpload: UploadItemConfig[] = [
  {
    id: 'banner',
    title: 'Banner de chamada',
    description:
      'Configuração do banner de chamada, é o banner que atraí o cliente e serve como página de entrada para acessar o benefício.',
    uploadLabel: 'Enviar banner de chamada',
    acceptText: 'PNG, JPG, GIF até 10MB',
  },
  {
    id: 'folheto',
    title: 'Folheto de Regras',
    description:
      'Configuração do folheto de regras, é o documento que reune as condições e orientações da campanha ou sorteio.',
    uploadLabel: 'Enviar folheto de regras',
    accept: 'application/pdf,image/jpeg,image/png',
    acceptText: 'PDF, PNG, JPG até 10MB',
  },
  {
    id: 'roleta',
    title: 'Imagem da Roleta',
    description:
      'Configuração da imagem da roleta, é a imagem que representa a roleta e será exibida para o cliente girar.',
    uploadLabel: 'Enviar imagem da roleta',
  },
  {
    id: 'fundo',
    title: 'Plano de Fundo',
    description:
      'Imagem que representa o plano de fundo do app, é exibida atrás da roleta e dos botões.',
    uploadLabel: 'Enviar plano de fundo',
  },
];

/**
 * Configurações dos itens de upload para a personalização da roleta
 */
export const useItensPersonalizacao: UploadItemConfig[] = [
  {
    id: 'banner',
    title: 'Banner de chamada',
    description:
      'Configuração do banner de chamada, é o banner que atraí o cliente e serve como página de entrada para acessar o benefício.',
    uploadLabel: 'Enviar banner de chamada',
    acceptText: 'PNG, JPG, GIF até 10MB',
  },
  {
    id: 'folheto',
    title: 'Folheto de Regras',
    description:
      'Configuração do folheto de regras, é o documento que reune as condições e orientações da campanha ou sorteio.',
    uploadLabel: 'Enviar folheto de regras',
    accept: 'application/pdf,image/jpeg,image/png',
    acceptText: 'PDF, PNG, JPG até 10MB',
  },
  {
    id: 'divisao-roleta',
    title: 'Número de divisões da Roleta',
    description:
      'Configuração do número de divisões da roleta, define quantos prêmios diferentes a roleta terá.',
    uploadLabel: 'Enviar imagem da roleta',
  },
  {
    id: 'cores-roleta',
    title: 'Cores da Roleta',
    description: 'Definição das cores da roleta, é exibida atrás da roleta e dos botões.',
    uploadLabel: 'Enviar plano de fundo',
  },
  {
    id: 'botao-girar',
    title: 'Botão Girar',
    description:
      'Definição das cores do botão girar, é o botão que o cliente interage para girar a roleta.',
    uploadLabel: 'Enviar plano de fundo',
  },
];
