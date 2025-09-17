import { Label as UILabel } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/ui';
import * as React from 'react';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string;
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
  }) => {
    const autoId = React.useId();
    const selectId = id || autoId;
    const hasError = !!error;

    const selectElement = (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={selectId}
          aria-invalid={hasError}
          aria-describedby={
            cn(helpText && `${selectId}-help`, error && `${selectId}-error`) || undefined
          }
          className={cn(
            'w-full py-[18px]',
            className,
            hasError && 'border-destructive focus-visible:ring-destructive',
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-w-10 w-10" position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

    if (!label) return selectElement;

    return (
      <div className={cn('flex flex-col gap-3 w-full', containerClassName)}>
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
