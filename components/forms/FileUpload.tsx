'use client';

import { Label } from '@/components/index';
import { ImageUp } from 'lucide-react';
import { InputHTMLAttributes, forwardRef } from 'react';

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto do rótulo acima do componente de upload */
  label: string;
  /** Texto da chamada principal para carregar o arquivo */
  uploadText?: string;
  /** Texto secundário após o botão principal */
  secondaryText?: string;
  /** Texto informativo sobre os tipos de arquivos aceitos */
  acceptText?: string;
  /** Classes adicionais para o container principal */
  className?: string;
  /** Classes adicionais para o botão de upload */
  buttonClassName?: string;
  /** Ícone customizado para exibir no lugar do ícone padrão */
  icon?: React.ReactNode;
  /** Tipo de arquivo(s) aceito(s) */
  accept?: string;
  /** Limite de tamanho em MB */
  maxSizeMB?: number;
  /** Função chamada quando o arquivo é selecionado */
  onFileSelect?: (file: File) => void;
}

/**
 * Componente reutilizável para upload de arquivos com arrastar e soltar
 */
const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      uploadText = 'Carregar arquivo',
      secondaryText = 'ou arraste e solte',
      acceptText = 'PNG, JPG, GIF up max 10MB',
      className = '',
      buttonClassName = 'relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300',
      icon = (
        <ImageUp className="mx-auto size-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
      ),
      accept,
      maxSizeMB = 10,
      id,
      name = 'file-upload',
      onFileSelect,
      ...props
    },
    ref,
  ) => {
    // Usar useId para gerar um ID estável entre servidor e cliente
    const inputId = id || `file-upload-${label.toLowerCase().replace(/\s+/g, '-')}`;

    // Handler para quando um arquivo é selecionado
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Verificar o tamanho do arquivo (MB)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          alert(`Arquivo muito grande. O tamanho máximo é ${maxSizeMB}MB.`);
          e.target.value = '';
          return;
        }

        // Chamar o callback se fornecido
        if (onFileSelect) {
          onFileSelect(file);
        }
      }
    };

    return (
      <div className={className}>
        <Label
          htmlFor={inputId}
          className="block text-sm/6 font-medium text-gray-900 dark:text-white"
        >
          {label}
        </Label>
        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25 bg-white">
          <div className="text-center">
            {icon}
            <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
              <label htmlFor={inputId} className={buttonClassName}>
                <span>{uploadText}</span>
                <input
                  id={inputId}
                  name={name}
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileChange}
                  ref={ref}
                  {...props}
                />
              </label>
              <p className="pl-1">{secondaryText}</p>
            </div>
            <p className="text-xs/5 text-gray-600 dark:text-gray-400">{acceptText}</p>
          </div>
        </div>
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
