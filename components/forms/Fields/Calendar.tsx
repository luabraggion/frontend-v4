import { Calendar as UICalendar } from '@/components/ui/calendar';
import {
  dayPickerFormatters,
  formatMonthShort,
  formatWeekdayShort,
  getDefaultYearRange,
  isDateInYearRange,
  ptBRLabels,
} from '@/lib/ui/date-utils';
import { ptBR } from 'date-fns/locale';
import * as React from 'react';

interface CalendarWithRangeProps {
  /**
   * Ano inicial para o seletor de anos
   */
  fromYear?: number;
  /**
   * Ano final para o seletor de anos
   */
  toYear?: number;
  /**
   * Se deve usar localização brasileira (padrão: true)
   */
  useBrazilianLocale?: boolean;
  /**
   * Outras props passadas para o Calendar
   */
  [key: string]: unknown;
}

/**
 * Calendar - Wrapper seguro que adiciona localização brasileira ao calendar shadcn
 *
 * Este componente estende o Calendar original do shadcn com:
 * - Localização completa em português brasileiro
 * - Props fromYear/toYear para compatibilidade com DatePicker
 * - Validação de range de anos
 *
 * @example
 * ```tsx
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 *   fromYear={2020}
 *   toYear={2030}
 *   captionLayout="dropdown"
 * />
 * ```
 */
export const Calendar = ({
  fromYear,
  toYear,
  useBrazilianLocale = true,
  disabled,
  ...otherProps
}: CalendarWithRangeProps) => {
  // Configuração do range de anos
  const yearRange = React.useMemo(() => {
    return getDefaultYearRange(fromYear, toYear);
  }, [fromYear, toYear]);

  // Função para desabilitar datas fora do range de anos
  const isDateDisabled = React.useCallback(
    (date: Date) => {
      // Se já existe uma função disabled, combina com a validação de range
      if (typeof disabled === 'function') {
        return disabled(date) || !isDateInYearRange(date, yearRange.fromYear, yearRange.toYear);
      }

      // Caso padrão: apenas valida o range de anos
      return !isDateInYearRange(date, yearRange.fromYear, yearRange.toYear);
    },
    [disabled, yearRange.fromYear, yearRange.toYear],
  );

  // Props para localização brasileira
  const localeProps = useBrazilianLocale
    ? {
        locale: ptBR,
        formatters: {
          ...dayPickerFormatters,
          formatMonthDropdown: formatMonthShort,
          formatWeekdayName: formatWeekdayShort,
        },
        labels: ptBRLabels,
      }
    : {};

  return (
    <UICalendar
      disabled={isDateDisabled}
      fromYear={yearRange.fromYear}
      toYear={yearRange.toYear}
      {...otherProps}
      {...localeProps}
    />
  );
};

export { Calendar as default };
