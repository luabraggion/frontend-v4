import { FileUpload } from '@/components/forms';
import { IPhoneMockup } from '@/components/index';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React, { useState, useEffect } from 'react';

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

  // Função para lidar com a seleção de arquivo
  const handleFileSelect = (file: File) => {
    // Criar URL para visualização da imagem
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    // Chamar o callback original
    onFileSelect(file);
  };

  // Limpar URLs de objeto ao desmontar o componente
  useEffect(() => {
    return () => {
      // Revogar a URL do objeto quando o componente for desmontado
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);
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
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
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
