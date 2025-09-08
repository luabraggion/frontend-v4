import { createErrorResponse, ERROR_CODES, HTTP_STATUS } from '@/utils/api/responses';
import { NextRequest } from 'next/server';

/**
 * Sistema de Autenticação
 *
 * Biblioteca responsável por:
 * - Autenticação JWT
 * - Autorização baseada em roles
 * - Validação de tokens
 * - Gerenciamento de sessões
 */

/**
 * Interface para o usuário autenticado
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  name: string;
}

/**
 * Extrai token do cabeçalho Authorization
 */
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}

/**
 * Valida e decodifica token JWT
 * NOTA: Esta é uma implementação de exemplo.
 * Em produção, use uma biblioteca como jose ou jsonwebtoken
 */
export async function validateToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    // TODO: Implementar validação real do JWT
    // Por enquanto, retorna um usuário mock para desenvolvimento
    if (token === 'dev-token') {
      return {
        id: '1',
        email: 'admin@example.com',
        role: 'admin',
        name: 'Admin User',
      };
    }

    // Aqui você validaria o token real:
    // const payload = await jose.jwtVerify(token, secret);
    // return payload.sub as AuthenticatedUser;

    return null;
  } catch {
    return null;
  }
}

/**
 * Middleware principal de autenticação
 */
export async function requireAuth(request: NextRequest): Promise<
  | {
      success: true;
      user: AuthenticatedUser;
    }
  | {
      success: false;
      response: Response;
    }
> {
  const token = extractTokenFromHeader(request);

  if (!token) {
    return {
      success: false,
      response: createErrorResponse(
        {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Token de acesso necessário',
        },
        HTTP_STATUS.UNAUTHORIZED,
      ),
    };
  }

  const user = await validateToken(token);

  if (!user) {
    return {
      success: false,
      response: createErrorResponse(
        {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Token inválido ou expirado',
        },
        HTTP_STATUS.UNAUTHORIZED,
      ),
    };
  }

  return {
    success: true,
    user,
  };
}

/**
 * Factory para criar middleware de verificação de roles
 */
export function requireRole(allowedRoles: AuthenticatedUser['role'][]) {
  return async (
    request: NextRequest,
    user: AuthenticatedUser,
  ): Promise<
    | {
        success: true;
      }
    | {
        success: false;
        response: Response;
      }
  > => {
    if (!allowedRoles.includes(user.role)) {
      return {
        success: false,
        response: createErrorResponse(
          {
            code: ERROR_CODES.FORBIDDEN,
            message: 'Permissão insuficiente para esta operação',
          },
          HTTP_STATUS.FORBIDDEN,
        ),
      };
    }

    return {
      success: true,
    };
  };
}

/**
 * Middleware pré-configurado para admin
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Middleware pré-configurado para moderadores
 */
export const requireModerator = requireRole(['admin', 'moderator']);
