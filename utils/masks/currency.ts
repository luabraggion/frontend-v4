/**
 * Formata um valor como moeda brasileira (R$)
 * @param value - Valor a ser formatado
 * @returns Valor formatado como R$ 0,00
 */
export function formatCurrency(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  if (!numbers) return '';

  // Converte para número e divide por 100 para ter os centavos
  const amount = parseInt(numbers) / 100;

  // Formata como moeda brasileira
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Remove a formatação de moeda, retornando apenas os números
 * @param value - Valor formatado
 * @returns Apenas os números
 */
export function unmaskCurrency(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Converte string formatada para número
 * @param value - Valor formatado como "R$ 150,00"
 * @returns Número decimal (150.00)
 */
export function parseCurrency(value: string): number {
  const numbers = value.replace(/\D/g, '');
  return parseInt(numbers || '0') / 100;
}

/**
 * Aplica máscara de moeda em tempo real durante digitação
 * @param event - Evento de input
 * @returns Valor formatado
 */
export function applyCurrencyMask(value: string): string {
  return formatCurrency(value);
}
