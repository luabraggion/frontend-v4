import { Label as UILabel } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/ui';
import { X } from 'lucide-react';
import * as React from 'react';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  id?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  clearable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = React.memo(
  ({
    options,
    value,
    onChange,
    placeholder = 'Selecione uma opção',
    className,
    label,
    labelClassName,
    id,
    helpText,
    error,
    required = false,
    containerClassName,
    clearable = false,
  }) => {
    const autoId = React.useId();
    const selectId = id || autoId;
    const hasError = !!error;
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange('');
        return false;
      },
      [onChange],
    );

    const selectElement = (
      <div className="relative group">
        <Select
          defaultValue=""
          value={value ?? undefined}
          onValueChange={onChange}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={
              cn(helpText && `${selectId}-help`, error && `${selectId}-error`) || undefined
            }
            className={cn(
              'w-full py-[18px] group',
              className,
              hasError && 'border-destructive focus-visible:ring-destructive',
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent
            className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
            position="popper"
          >
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botão de limpar fora do Select para evitar propagação de eventos */}
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 -translate-y-1/2 right-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 text-destructive rounded-sm z-10"
            aria-label="Limpar seleção"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    );

    if (!label) return selectElement;

    return (
      <div className={cn('flex flex-col gap-3 flex-grow w-full', containerClassName)}>
        <UILabel htmlFor={selectId} className={cn(labelClassName, hasError && 'text-destructive')}>
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="obrigatório">
              *
            </span>
          )}
        </UILabel>
        {selectElement}
        {helpText && !error && (
          <p id={`${selectId}-help`} className="text-muted-foreground text-xs mt-1">
            {helpText}
          </p>
        )}
        {error && (
          <p id={`${selectId}-error`} className="text-destructive text-xs mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
