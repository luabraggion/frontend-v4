import { Label } from '@/components/forms/Labels';
import { Button } from '@/components/ui/button';
import { Input as UIInput } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/ui';
import {
  applyDateMask,
  formatDate,
  getDefaultYearRange,
  isDateInYearRange,
  isSameDay,
  isValidDate,
  parseDate,
} from '@/lib/ui/date-utils';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Calendar } from './Calendar';

interface DatePickerProps {
  label?: string;
  value?: string;
  date?: Date;
  onDateChange?: (date: Date | undefined, value: string) => void;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  className?: string;
}

export const DatePicker = ({
  label = '',
  value: valueProp,
  date: dateProp,
  onDateChange,
  placeholder = 'DD/MM/AAAA',
  fromYear,
  toYear,
  className,
}: DatePickerProps) => {
  // Estados internos para controle da data e valor do input
  const [internalDate, setInternalDate] = useState<Date | undefined>(dateProp);
  const [internalValue, setInternalValue] = useState(valueProp || '');
  const [open, setOpen] = useState(false);

  // Configuração do range de anos baseado nas props ou valores padrão
  const yearRange = getDefaultYearRange(fromYear, toYear);

  // Sincronização com props externas (modo controlado)
  useEffect(() => {
    if (dateProp !== undefined) {
      setInternalDate(dateProp);
    }
  }, [dateProp]);

  useEffect(() => {
    if (valueProp !== undefined) {
      setInternalValue(valueProp);
    }
  }, [valueProp]);

  // Handler para mudanças no input de texto
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const maskedValue = applyDateMask(rawValue);

      setInternalValue(maskedValue);

      // Tenta fazer o parse da data apenas se o input estiver completo
      if (maskedValue.length === 10) {
        const parsedDate = parseDate(maskedValue);

        if (
          parsedDate &&
          isValidDate(parsedDate) &&
          isDateInYearRange(parsedDate, yearRange.fromYear, yearRange.toYear)
        ) {
          setInternalDate(parsedDate);
          onDateChange?.(parsedDate, maskedValue);
        } else {
          // Data inválida - mantém o valor do input mas limpa a data
          setInternalDate(undefined);
          onDateChange?.(undefined, maskedValue);
        }
      } else {
        // Input incompleto - limpa a data mas mantém o valor
        setInternalDate(undefined);
        onDateChange?.(undefined, maskedValue);
      }
    },
    [onDateChange, yearRange.fromYear, yearRange.toYear],
  );

  // Handler para seleção de data no calendário
  const handleCalendarSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) {
        setInternalDate(undefined);
        setInternalValue('');
        onDateChange?.(undefined, '');
        setOpen(false);
        return;
      }

      // Verifica se a data está dentro do range permitido
      if (!isDateInYearRange(selectedDate, yearRange.fromYear, yearRange.toYear)) {
        return; // Não permite seleção fora do range
      }

      const formattedValue = formatDate(selectedDate);
      setInternalDate(selectedDate);
      setInternalValue(formattedValue);
      onDateChange?.(selectedDate, formattedValue);
      setOpen(false);
    },
    [onDateChange, yearRange.fromYear, yearRange.toYear],
  );

  // Handler para limpeza do campo via backspace/delete quando vazio
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && internalValue === '') {
        setInternalDate(undefined);
        onDateChange?.(undefined, '');
      }
    },
    [internalValue, onDateChange],
  );

  // Validação de exibição no calendário
  const isDateDisabled = useCallback(
    (date: Date) => {
      return !isDateInYearRange(date, yearRange.fromYear, yearRange.toYear);
    },
    [yearRange.fromYear, yearRange.toYear],
  );

  // Modificadores para o DayPicker
  const modifiers = {
    selected: internalDate ? (date: Date) => isSameDay(date, internalDate) : undefined,
    disabled: isDateDisabled,
  };

  return (
    <div className="flex flex-col gap-3 flex-grow w-full">
      {/* Label se fornecido */}
      {label && <Label>{label}</Label>}

      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <div className="relative flex">
            {/* Input de texto com máscara */}
            <UIInput
              value={internalValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn('pr-10', className)}
              maxLength={10}
            />

            {/* Botão do calendário */}
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setOpen(!open)}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Abrir calendário</span>
              </Button>
            </PopoverTrigger>
          </div>

          {/* Popover com calendário */}
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={internalDate}
              onSelect={handleCalendarSelect}
              disabled={isDateDisabled}
              modifiers={modifiers}
              fromYear={yearRange.fromYear}
              toYear={yearRange.toYear}
              captionLayout="dropdown"
              defaultMonth={internalDate || new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
