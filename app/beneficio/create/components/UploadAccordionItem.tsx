import { FileUpload } from '@/components/forms';
import { IPhoneMockup } from '@/components/index';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

/**
 * Interface para as propriedades do componente UploadAccordionItem
 */
interface UploadAccordionItemProps {
  value: string;
  title: string;
  description: string;
  uploadLabel: string;
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  acceptText?: string;
  accept?: string;
  children?: React.ReactNode; // Conteúdo opcional para o slot dentro do IPhoneMockup
}

/**
 * Componente reutilizável que representa um item de acordeão para upload de arquivo
 * com título, descrição e componente de upload integrado
 */
export const UploadAccordionItem: React.FC<UploadAccordionItemProps> = ({
  value,
  title,
  description,
  uploadLabel,
  onFileSelect,
  maxSizeMB = 10,
  acceptText = 'PNG, JPG, GIF até 10MB',
  accept = 'image/jpeg,image/png,image/gif',
  children,
}) => {
  // Estado para armazenar a URL da imagem selecionada
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Estado para armazenar as dimensões da imagem
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Função para lidar com a seleção de arquivo
  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setPreviewImage(null);
      onFileSelect(file);
      return;
    }

    // Para compatibilidade com o Next.js, vamos usar uma abordagem otimizada
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setPreviewImage(event.target.result);

        // Determinar dimensões da imagem
        const img = document.createElement('img');
        img.onload = () => {
          setImageDimensions({
            width: img.width,
            height: img.height,
          });
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);

    // Chamar o callback original
    onFileSelect(file);
  };

  // Efeito para limpeza quando o componente é desmontado
  useEffect(() => {
    return () => {
      // Limpeza de recursos ao desmontar
      setPreviewImage(null);
    };
  }, []);
  return (
    <AccordionItem value={value} className="last:border border rounded-xl p-4">
      <AccordionTrigger className="group hover:no-underline">
        <div>
          <span className="block hover:underline">{title}</span>
          <span className="text-muted-foreground block">{description}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground flex justify-center items-center gap-4 mt-4">
        <div className="flex justify-center w-full">
          {children || (
            <div className="flex justify-center gap-4 p-5">
              <FileUpload
                label=""
                onFileSelect={handleFileSelect}
                accept={accept}
                maxSizeMB={maxSizeMB}
                className="flex-1 min-w-96"
                acceptText={acceptText}
              />
              <div className="flex flex-col items-center">
                <IPhoneMockup color="black" variant="with-buttons" className="flex flex-col">
                  <div className="p-3 text-center">
                    <h4 className="font-medium text-base">Prévia da Roleta</h4>
                  </div>
                  {previewImage ? (
                    <div className="flex items-center justify-center h-full bg-white">
                      <div className="relative w-full h-full flex items-center justify-center p-4 -mt-14">
                        {imageDimensions.width > 0 ? (
                          <Image
                            src={previewImage}
                            alt="Preview"
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                            className="max-h-full max-w-full object-contain"
                            priority
                            unoptimized // Necessário para usar com Data URLs
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-blue-500 animate-spin" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-white text-center p-4 h-full -mt-14">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400 mb-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                        <line x1="9.69" y1="8" x2="21.17" y2="8" />
                        <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                        <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                        <line x1="14.31" y1="16" x2="2.83" y2="16" />
                        <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
                      </svg>
                      <p className="text-gray-600 font-medium">
                        Faça o upload da imagem
                        <br />
                        para visualizar a prévia
                      </p>
                    </div>
                  )}
                </IPhoneMockup>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
