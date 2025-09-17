import { NextRequest, NextResponse } from 'next/server';
import { ApiError, ApiResponse, ERROR_CODES, HTTP_STATUS, PaginatedResponse } from './constants';
import { formatTimestamp } from './helpers';

// Re-exportar constantes para facilitar importação
export { ERROR_CODES, HTTP_STATUS } from './constants';

/**
 * Utilitários para criação de respostas padronizadas da API
 */

/**
 * Cria uma resposta de sucesso padronizada
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = HTTP_STATUS.OK,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: formatTimestamp(),
    },
    { status },
  );
}

/**
 * Cria uma resposta de erro padronizada
 */
export function createErrorResponse(
  error: string | ApiError,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  const errorObj = typeof error === 'string' ? { code: 'UNKNOWN', message: error } : error;

  return NextResponse.json(
    {
      success: false,
      error: errorObj.message,
      timestamp: formatTimestamp(),
    },
    {
      status,
      headers: headers ? new Headers(headers) : undefined,
    },
  );
}

/**
 * Cria uma resposta paginada padronizada
 */
export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
  message?: string,
): NextResponse<ApiResponse<PaginatedResponse<T>>> {
  return NextResponse.json(
    {
      success: true,
      data: {
        data,
        pagination,
      },
      message,
      timestamp: formatTimestamp(),
    },
    { status: HTTP_STATUS.OK },
  );
}

/**
 * Valida métodos HTTP permitidos
 */
export function validateHttpMethod(
  request: NextRequest,
  allowedMethods: string[],
): NextResponse | null {
  if (!allowedMethods.includes(request.method)) {
    return createErrorResponse(
      {
        code: ERROR_CODES.NOT_FOUND,
        message: `Método ${request.method} não permitido`,
      },
      HTTP_STATUS.METHOD_NOT_ALLOWED,
    );
  }
  return null;
}

/**
 * Trata erros de forma padronizada
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return createErrorResponse(
      {
        code: ERROR_CODES.INTERNAL_ERROR,
        message:
          process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  return createErrorResponse(
    {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Erro interno do servidor',
    },
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  );
}
