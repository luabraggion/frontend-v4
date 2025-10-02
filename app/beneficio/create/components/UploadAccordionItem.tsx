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
              <IPhoneMockup color="black" variant="with-buttons">
                {previewImage && (
                  <div className="flex items-center justify-center h-full bg-white">
                    <div className="relative w-full h-full flex items-center justify-center p-4">
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
                )}
              </IPhoneMockup>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
