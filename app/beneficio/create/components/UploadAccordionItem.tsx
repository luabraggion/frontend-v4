import { FileUpload } from '@/components/forms';
import { IPhoneMockup } from '@/components/index';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

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
            <IPhoneMockup color="black" variant="with-buttons">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <FileUpload
                  label=""
                  onFileSelect={onFileSelect}
                  accept={accept}
                  maxSizeMB={maxSizeMB}
                  className=""
                  acceptText={acceptText}
                />
              </div>
            </IPhoneMockup>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
