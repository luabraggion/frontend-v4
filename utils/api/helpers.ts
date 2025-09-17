import { NextRequest } from 'next/server';
import { PaginationParams } from './constants';

/**
 * Utilitários simples para manipulação de dados da API
 */

/**
 * Extrai parâmetros de paginação da URL
 */
export function extractPaginationParams(request: NextRequest): PaginationParams {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Number(searchParams.get('limit')) || 10, 100), // Máximo 100 por página
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };
}

/**
 * Extrai IP do cliente considerando proxies
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

/**
 * Gera uma chave única para cache/rate limiting
 */
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return [prefix, ...parts].join(':');
}

/**
 * Formata uma data para ISO string
 */
export function formatTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Valida se uma string é um UUID válido
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Sanitiza uma string removendo caracteres especiais
 */
export function sanitizeString(input: string): string {
  return input.replace(/[<>\"'%;()&+]/g, '');
}

/**
 * Calcula offset para paginação
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calcula informações de paginação
 */
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    offset: calculateOffset(page, limit),
  };
}
