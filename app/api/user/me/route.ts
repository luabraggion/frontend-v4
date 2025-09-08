import { requireAuth } from '@/lib/api/middleware';
import { standardRateLimit } from '@/lib/api/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  ERROR_CODES,
  handleApiError,
  HTTP_STATUS,
  validateHttpMethod,
} from '@/utils/api';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Validar método HTTP
    const methodError = validateHttpMethod(request, ['GET']);
    if (methodError) return methodError;

    // Aplicar rate limiting
    const rateLimitResult = await standardRateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Verificar autenticação
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const user = authResult.user;

    // Simular busca de dados do usuário
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: {
        avatar: null,
        bio: 'Usuário do sistema',
        preferences: {
          theme: 'light',
          language: 'pt-BR',
          notifications: true,
        },
      },
      stats: {
        loginCount: 42,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    };

    return createSuccessResponse(userData, 'Dados do usuário recuperados com sucesso');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Validar método HTTP
    const methodError = validateHttpMethod(request, ['PUT']);
    if (methodError) return methodError;

    // Aplicar rate limiting
    const rateLimitResult = await standardRateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Verificar autenticação
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const user = authResult.user;

    try {
      const body = await request.json();

      // Validar dados básicos
      if (!body.name || typeof body.name !== 'string') {
        return createErrorResponse(
          {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Nome é obrigatório',
          },
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Simular atualização do usuário
      const updatedUser = {
        id: user.id,
        name: body.name,
        email: user.email,
        role: user.role,
        updatedAt: new Date().toISOString(),
      };

      return createSuccessResponse(updatedUser, 'Usuário atualizado com sucesso');
    } catch {
      return createErrorResponse(
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Dados JSON inválidos',
        },
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
