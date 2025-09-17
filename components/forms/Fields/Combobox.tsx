import { Label } from '@/components/forms/Labels';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/ui';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// Tipos para as opções e props do combobox
interface Option {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  id?: string;
  label?: string;
  name?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function Combobox({
  options,
  placeholder = 'Selecione...',
  value,
  onChange,
  id,
  label = 'Título',
  name,
  className,
}: ComboboxProps) {
  const autoId = useId(); // Gera um id único para o input se não for passado via prop
  const inputId = id || `combobox-input-${autoId}`; // Garante que o id seja string (useId pode retornar string)
  const inputName = name || inputId; // Se não passar name, usa inputId como valor padrão
  const [open, setOpen] = useState(false); // Estado de abertura do popover
  const [selected, setSelected] = useState(value ?? ''); // Valor selecionado

  // Atualiza o valor selecionado se o prop value mudar (modo controlado)
  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  // Função chamada ao selecionar uma opção
  function handleSelect(currentValue: string) {
    setSelected(currentValue === selected ? '' : currentValue);
    setOpen(false);
    onChange?.(currentValue === selected ? '' : currentValue); // Chama o callback externo, se existir
  }

  // Renderização do combobox com popover, busca e seleção
  return (
    <div className="flex flex-col gap-3 flex-grow w-full">
      {/* Label acessível vinculado ao campo de busca do combobox */}
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between font-normal', className)}
          >
            {/* Exibe o label da opção selecionada ou o placeholder */}
            {selected ? options.find((option) => option.value === selected)?.label : placeholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-max p-0" align="end" sideOffset={5}>
          <Command>
            {/* Campo de busca acessível */}
            <CommandInput
              id={inputId}
              name={inputName}
              placeholder="Buscar..."
              aria-labelledby={inputId}
            />
            <CommandList>
              <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
              <CommandGroup>
                {/* Lista de opções filtradas */}
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={[option.value, option.label]}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    {/* Ícone de check para opção selecionada */}
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4',
                        selected === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
