import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/feedback/Dialog';
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Command as UICommand,
  CommandEmpty as UICommandEmpty,
} from '@/components/ui/command';
import { cn } from '@/lib/ui';
import * as React from 'react';

/**
 * CommandDialog - Versão em português do Command Dialog
 */
function CommandDialog({
  title = 'Paleta de Comandos',
  description = 'Pesquise por um comando para executar...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('overflow-hidden p-0', className)}
        showCloseButton={showCloseButton}
      >
        <UICommand className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </UICommand>
      </DialogContent>
    </Dialog>
  );
}

/**
 * CommandEmpty - Versão em português do CommandEmpty
 */
function CommandEmpty({
  children = 'Nenhum resultado encontrado.',
  ...props
}: React.ComponentProps<typeof UICommandEmpty>) {
  return <UICommandEmpty {...props}>{children}</UICommandEmpty>;
}

/**
 * Command - Wrapper que exporta todos os componentes com localização brasileira
 *
 * Este wrapper mantém compatibilidade total com o Command original do shadcn,
 * mas substitui textos padrão por versões em português.
 *
 * @example
 * ```tsx
 * import {
 *   Command,
 *   CommandDialog,
 *   CommandInput,
 *   CommandList,
 *   CommandEmpty,
 *   CommandGroup,
 *   CommandItem
 * } from '@/components/forms/Command'
 *
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Digite um comando..." />
 *   <CommandList>
 *     <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
 *     <CommandGroup heading="Sugestões">
 *       <CommandItem>Calendário</CommandItem>
 *       <CommandItem>Pesquisar</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 * ```
 */
const Command = UICommand;

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
