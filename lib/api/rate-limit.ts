import { generateCacheKey, getClientIp } from '@/utils/api/helpers';
import { createErrorResponse, ERROR_CODES, HTTP_STATUS } from '@/utils/api/responses';
import { NextRequest } from 'next/server';

/**
 * Sistema de Rate Limiting
 *
 * Biblioteca responsável por:
 * - Controle de taxa de requisições
 * - Armazenamento em memória (desenvolvimento)
 * - Configurações flexíveis por endpoint
 * - Headers informativos
 */

/**
 * Interface para configuração de rate limiting
 */
export interface RateLimitConfig {
  /** Número máximo de requests */
  maxRequests: number;
  /** Janela de tempo em milissegundos */
  windowMs: number;
  /** Mensagem personalizada de erro */
  message?: string;
  /** Cabeçalhos a incluir na resposta */
  headers?: boolean;
}

/**
 * Configurações pré-definidas de rate limiting
 */
export const RATE_LIMIT_CONFIGS = {
  /** 100 requests por minuto - uso geral */
  STANDARD: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    message: 'Muitas tentativas. Tente novamente em 1 minuto.',
    headers: true,
  } as RateLimitConfig,

  /** 10 requests por minuto - autenticação sensível */
  AUTH: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: 'Muitas tentativas de login. Tente novamente em 1 minuto.',
    headers: true,
  } as RateLimitConfig,

  /** 1000 requests por hora - APIs públicas */
  PUBLIC: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Limite de requisições excedido. Tente novamente em 1 hora.',
    headers: true,
  } as RateLimitConfig,

  /** 5 requests por minuto - operações críticas */
  CRITICAL: {
    maxRequests: 5,
    windowMs: 60 * 1000,
    message: 'Operação crítica. Limite muito restritivo.',
    headers: true,
  } as RateLimitConfig,
};

/**
 * Store em memória para rate limiting
 * NOTA: Em produção, use Redis ou outra solução distribuída
 */
class MemoryRateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  /**
   * Obtém registro do store, removendo se expirado
   */
  get(key: string): { count: number; resetTime: number } | undefined {
    const record = this.store.get(key);

    // Remove registros expirados automaticamente
    if (record && Date.now() > record.resetTime) {
      this.store.delete(key);
      return undefined;
    }

    return record;
  }

  /**
   * Define um registro no store
   */
  set(key: string, value: { count: number; resetTime: number }): void {
    this.store.set(key, value);
  }

  /**
   * Incrementa contador ou cria novo registro
   */
  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.get(key);

    if (existing) {
      existing.count++;
      this.set(key, existing);
      return existing;
    }

    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };

    this.set(key, newRecord);
    return newRecord;
  }

  /**
   * Limpa registros expirados (manutenção)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Obtém estatísticas do store
   */
  getStats() {
    return {
      totalKeys: this.store.size,
      activeRecords: Array.from(this.store.values()).filter((r) => Date.now() <= r.resetTime)
        .length,
    };
  }
}

// Instância global do store
const rateLimitStore = new MemoryRateLimitStore();

// Limpeza automática a cada 5 minutos
setInterval(() => rateLimitStore.cleanup(), 5 * 60 * 1000);

/**
 * Gera chave única para rate limiting
 */
function getRateLimitKey(request: NextRequest, suffix?: string): string {
  const ip = getClientIp(request);
  const pathname = new URL(request.url).pathname;

  return generateCacheKey('rate_limit', ip, pathname, suffix || '');
}

/**
 * Factory para criar middleware de rate limiting
 */
export function createRateLimit(config: RateLimitConfig = RATE_LIMIT_CONFIGS.STANDARD) {
  return async (
    request: NextRequest,
    suffix?: string,
  ): Promise<
    | {
        success: true;
        remaining: number;
        resetTime: number;
      }
    | {
        success: false;
        response: Response;
      }
  > => {
    const key = getRateLimitKey(request, suffix);
    const record = rateLimitStore.increment(key, config.windowMs);

    const remaining = Math.max(0, config.maxRequests - record.count);

    if (record.count > config.maxRequests) {
      const headers = config.headers
        ? {
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
            'Retry-After': Math.ceil((record.resetTime - Date.now()) / 1000).toString(),
          }
        : undefined;

      return {
        success: false,
        response: createErrorResponse(
          {
            code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            message: config.message || 'Muitas requisições',
            details: {
              limit: config.maxRequests,
              windowMs: config.windowMs,
              resetTime: record.resetTime,
            },
          },
          HTTP_STATUS.TOO_MANY_REQUESTS,
          headers,
        ),
      };
    }

    return {
      success: true,
      remaining,
      resetTime: record.resetTime,
    };
  };
}

/**
 * Middleware pré-configurados
 */
export const standardRateLimit = createRateLimit(RATE_LIMIT_CONFIGS.STANDARD);
export const authRateLimit = createRateLimit(RATE_LIMIT_CONFIGS.AUTH);
export const publicRateLimit = createRateLimit(RATE_LIMIT_CONFIGS.PUBLIC);
export const criticalRateLimit = createRateLimit(RATE_LIMIT_CONFIGS.CRITICAL);

/**
 * Adiciona headers de rate limit à resposta
 */
export function addRateLimitHeaders(
  response: Response,
  limit: number,
  remaining: number,
  resetTime: number,
): Response {
  const headers = new Headers(response.headers);

  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Obtém estatísticas do rate limiting
 */
export function getRateLimitStats() {
  return rateLimitStore.getStats();
}
