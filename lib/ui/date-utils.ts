/**
 * Utilitários de data reutilizáveis para toda a aplicação
 */

/**
 * Configuração de localização brasileira
 */
export const ptBRLocale = {
  locale: 'pt-BR',
  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  weekdays: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  weekdaysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  firstDayOfWeek: 0, // Domingo como primeiro dia
} as const;

/**
 * Formata uma data no formato DD/MM/YYYY
 * @param date - Data a ser formatada
 * @returns String no formato DD/MM/YYYY ou string vazia se date for undefined
 */
export function formatDate(date: Date | undefined): string {
  if (!date) return '';
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

/**
 * Valida se uma data é válida
 * @param date - Data a ser validada
 * @returns true se a data for válida, false caso contrário
 */
export function isValidDate(date: Date | undefined): boolean {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

/**
 * Formata o nome do mês de forma abreviada com primeira letra maiúscula, sem ponto
 * @param date - Data para extrair o mês
 * @returns Nome do mês formatado (ex: "Jan", "Fev", "Mar")
 */
export function formatMonthShort(date: Date): string {
  const monthIndex = date.getMonth();
  return ptBRLocale.monthsShort[monthIndex];
}

/**
 * Formata o nome do dia da semana de forma abreviada com primeira letra maiúscula, sem ponto
 * @param date - Data para extrair o dia da semana
 * @returns Nome do dia da semana formatado (ex: "Seg", "Ter", "Qua")
 */
export function formatWeekdayShort(date: Date): string {
  const dayIndex = date.getDay();
  return ptBRLocale.weekdaysShort[dayIndex];
}

/**
 * Formata o nome completo do mês
 * @param date - Data para extrair o mês
 * @returns Nome completo do mês (ex: "Janeiro", "Fevereiro", "Março")
 */
export function formatMonthLong(date: Date): string {
  const monthIndex = date.getMonth();
  return ptBRLocale.months[monthIndex];
}

/**
 * Formata o nome completo do dia da semana
 * @param date - Data para extrair o dia da semana
 * @returns Nome completo do dia da semana (ex: "Segunda-feira", "Terça-feira")
 */
export function formatWeekdayLong(date: Date): string {
  const dayIndex = date.getDay();
  return ptBRLocale.weekdays[dayIndex];
}

/**
 * Formata uma data por extenso em português
 * @param date - Data a ser formatada
 * @returns String da data por extenso (ex: "Segunda-feira, 6 de Setembro de 2025")
 */
export function formatDateLong(date: Date): string {
  const weekday = formatWeekdayLong(date);
  const day = date.getDate();
  const month = formatMonthLong(date);
  const year = date.getFullYear();
  return `${weekday}, ${day} de ${month} de ${year}`;
}

/**
 * Obtém o ano atual
 * @returns Ano atual como número
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Calcula um intervalo de anos baseado no ano atual
 * @param yearsBefore - Quantidade de anos antes do ano atual
 * @param yearsAfter - Quantidade de anos depois do ano atual
 * @returns Objeto com fromYear e toYear
 */
export function getYearRange(
  yearsBefore: number = 5,
  yearsAfter: number = 5,
): {
  fromYear: number;
  toYear: number;
} {
  const currentYear = getCurrentYear();
  return {
    fromYear: currentYear - yearsBefore,
    toYear: currentYear + yearsAfter,
  };
}

/**
 * Converte uma string de data DD/MM/YYYY para objeto Date
 * @param dateString - String no formato DD/MM/YYYY
 * @returns Date object ou undefined se inválida
 */
export function parseDate(dateString: string): Date | undefined {
  if (!dateString || dateString.length < 8) return undefined;

  // Tenta diferentes formatos de entrada
  const formats = [
    // DD/MM/YYYY ou DD-MM-YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    // YYYY-MM-DD (formato ISO)
    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      let day, month, year;

      if (format === formats[0]) {
        // DD/MM/YYYY
        [, day, month, year] = match;
      } else {
        // YYYY-MM-DD
        [, year, month, day] = match;
      }

      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (isValidDate(date)) {
        return date;
      }
    }
  }

  // Fallback apenas se tiver conteúdo válido e não vazio
  if (!dateString || dateString.trim().length === 0) {
    return undefined;
  }

  // Não tentar criar Date com strings muito curtas ou inválidas
  if (dateString.trim().length < 3) {
    return undefined;
  }

  const date = new Date(dateString);
  // Verificar se a data é válida E se não é a data atual por acaso
  if (isValidDate(date)) {
    // Se a string original era algo como '' ou espaços, new Date retorna data atual
    // Verificamos se a string tem formato de data
    if (/\d/.test(dateString)) {
      return date;
    }
  }

  return undefined;
}

/**
 * Verifica se uma data está dentro de um intervalo
 * @param date - Data a ser verificada
 * @param startDate - Data inicial do intervalo
 * @param endDate - Data final do intervalo
 * @returns true se a data estiver no intervalo, false caso contrário
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * Adiciona dias a uma data
 * @param date - Data base
 * @param days - Quantidade de dias a adicionar (pode ser negativo)
 * @returns Nova data com os dias adicionados
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Adiciona meses a uma data
 * @param date - Data base
 * @param months - Quantidade de meses a adicionar (pode ser negativo)
 * @returns Nova data com os meses adicionados
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Obtém o primeiro dia do mês
 * @param date - Data de referência
 * @returns Primeiro dia do mês da data fornecida
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Obtém o último dia do mês
 * @param date - Data de referência
 * @returns Último dia do mês da data fornecida
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Compara duas datas ignorando o horário
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns true se as datas forem iguais (mesmo dia), false caso contrário
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Verifica se uma data é hoje
 * @param date - Data a ser verificada
 * @returns true se a data for hoje, false caso contrário
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Verifica se um ano está dentro de um intervalo permitido
 * @param year - Ano a ser verificado
 * @param fromYear - Ano mínimo permitido
 * @param toYear - Ano máximo permitido
 * @returns true se o ano estiver no intervalo, false caso contrário
 */
export function isYearInRange(year: number, fromYear: number, toYear: number): boolean {
  return year >= fromYear && year <= toYear;
}

/**
 * Verifica se uma data está dentro de um intervalo de anos permitidos
 * @param date - Data a ser verificada
 * @param fromYear - Ano mínimo permitido
 * @param toYear - Ano máximo permitido
 * @returns true se a data estiver no intervalo de anos, false caso contrário
 */
export function isDateInYearRange(date: Date, fromYear: number, toYear: number): boolean {
  return isYearInRange(date.getFullYear(), fromYear, toYear);
}

/**
 * Cria uma nova instância de Date a partir do ano atual mais um offset
 * @param yearsOffset - Número de anos a adicionar/subtrair do ano atual
 * @returns Nova data com o ano modificado
 */
export function getCurrentDateWithYearOffset(yearsOffset: number = 0): Date {
  const date = new Date();
  date.setFullYear(getCurrentYear() + yearsOffset);
  return date;
}

/**
 * Obtém os valores padrão para fromYear e toYear
 * Se os parâmetros forem undefined, usa offsets padrão
 * Se os parâmetros forem números, os trata como anos absolutos ou offsets baseado no valor
 * @param fromYearOrOffset - Ano absoluto ou offset do ano atual para fromYear
 * @param toYearOrOffset - Ano absoluto ou offset do ano atual para toYear
 * @returns Objeto com fromYear e toYear
 */
export function getDefaultYearRange(
  fromYearOrOffset?: number,
  toYearOrOffset?: number,
): { fromYear: number; toYear: number } {
  const currentYear = getCurrentYear();

  // Se não foram passados parâmetros, usa valores padrão
  if (fromYearOrOffset === undefined && toYearOrOffset === undefined) {
    return {
      fromYear: currentYear - 100,
      toYear: currentYear + 10,
    };
  }

  // Se foram passados valores, verifica se são anos absolutos ou offsets
  let fromYear: number;
  let toYear: number;

  if (fromYearOrOffset !== undefined) {
    // Se o valor é maior que 1900, trata como ano absoluto
    // Caso contrário, trata como offset
    fromYear = fromYearOrOffset > 1900 ? fromYearOrOffset : currentYear + fromYearOrOffset;
  } else {
    fromYear = currentYear - 100;
  }

  if (toYearOrOffset !== undefined) {
    // Se o valor é maior que 1900, trata como ano absoluto
    // Caso contrário, trata como offset
    toYear = toYearOrOffset > 1900 ? toYearOrOffset : currentYear + toYearOrOffset;
  } else {
    toYear = currentYear + 10;
  }

  return { fromYear, toYear };
}

/**
 * Aplica máscara DD/MM/YYYY em uma string
 * @param value - String a ser mascarada
 * @returns String com máscara DD/MM/YYYY aplicada
 */
export function applyDateMask(value: string): string {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}

/**
 * Formatters para uso com react-day-picker e outros componentes de calendário
 */
export const dayPickerFormatters = {
  formatMonthDropdown: formatMonthShort,
  formatWeekdayName: formatWeekdayShort,
  formatMonthLong: formatMonthLong,
  formatWeekdayLong: formatWeekdayLong,
  formatCaption: (date: Date) => {
    const month = formatMonthLong(date);
    const year = date.getFullYear();
    return `${month} ${year}`;
  },
};

/**
 * Labels em português para componentes de calendário
 */
export const ptBRLabels = {
  labelNext: () => 'Próximo mês',
  labelPrevious: () => 'Mês anterior',
  labelMonthDropdown: () => 'Selecionar mês',
  labelYearDropdown: () => 'Selecionar ano',
  labelDay: (date: Date) => `Dia ${date.getDate()}`,
  labelWeekday: (date: Date) => formatWeekdayLong(date),
};

/**
 * Calcula a diferença em dias entre duas datas
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns Número de dias de diferença
 */
export function getDaysDifference(startDate: Date, endDate: Date): number {
  const timeDifference = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
}

/**
 * Calcula a idade em anos baseado na data de nascimento
 * @param birthDate - Data de nascimento
 * @param referenceDate - Data de referência (padrão: data atual)
 * @returns Idade em anos
 */
export function getAge(birthDate: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Obtém o primeiro dia da semana de uma data
 * @param date - Data de referência
 * @returns Primeiro dia da semana (domingo)
 */
export function getFirstDayOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const firstDay = new Date(date);
  firstDay.setDate(date.getDate() - dayOfWeek);
  return firstDay;
}

/**
 * Obtém o último dia da semana de uma data
 * @param date - Data de referência
 * @returns Último dia da semana (sábado)
 */
export function getLastDayOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const lastDay = new Date(date);
  lastDay.setDate(date.getDate() + (6 - dayOfWeek));
  return lastDay;
}

/**
 * Verifica se uma data é fim de semana
 * @param date - Data a ser verificada
 * @returns true se for sábado ou domingo
 */
export function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Domingo ou Sábado
}

/**
 * Formata uma data no formato brasileiro mais completo
 * @param date - Data a ser formatada
 * @param includeTime - Se deve incluir horário (HH:mm)
 * @returns String formatada (ex: "06/09/2025" ou "06/09/2025 14:30")
 */
export function formatDateBR(date: Date, includeTime: boolean = false): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let formatted = `${day}/${month}/${year}`;

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    formatted += ` ${hours}:${minutes}`;
  }

  return formatted;
}

/**
 * Cria um array de datas entre duas datas (incluindo as datas inicial e final)
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns Array de datas
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Obtém o trimestre de uma data
 * @param date - Data de referência
 * @returns Número do trimestre (1, 2, 3 ou 4)
 */
export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * Formata data/hora relativa (ex: "há 2 horas", "em 3 dias")
 * @param date - Data a ser formatada
 * @param referenceDate - Data de referência (padrão: data atual)
 * @returns String formatada em português
 */
export function formatRelativeTime(date: Date, referenceDate: Date = new Date()): string {
  const diffInMs = date.getTime() - referenceDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const abs = Math.abs;
  const isPast = diffInMs < 0;

  if (abs(diffInMinutes) < 1) {
    return 'agora';
  } else if (abs(diffInMinutes) < 60) {
    const minutes = abs(diffInMinutes);
    return isPast
      ? `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
      : `em ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (abs(diffInHours) < 24) {
    const hours = abs(diffInHours);
    return isPast
      ? `há ${hours} hora${hours > 1 ? 's' : ''}`
      : `em ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (abs(diffInDays) < 30) {
    const days = abs(diffInDays);
    return isPast ? `há ${days} dia${days > 1 ? 's' : ''}` : `em ${days} dia${days > 1 ? 's' : ''}`;
  } else {
    return formatDateBR(date);
  }
}
