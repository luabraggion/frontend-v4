import { Button } from '@/components/buttons';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import * as React from 'react';

interface CustomSheetProps {
  triggerLabel: string;
  title: string;
  description: string;
  onSave: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const CustomSheet: React.FC<CustomSheetProps> = ({
  triggerLabel,
  title,
  description,
  onSave,
  onCancel,
  children,
  className,
}) => {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </SheetTrigger>
      <SheetContent className={className || 'min-w-xl'}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1">{children}</div>

        <SheetFooter className="flex flex-row justify-between">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1" size="lg" onClick={onCancel}>
              Cancelar
            </Button>
          </SheetClose>
          <Button type="button" variant="default" size="lg" className="flex-1" onClick={onSave}>
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
