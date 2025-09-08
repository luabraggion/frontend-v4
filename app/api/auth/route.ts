import { authRateLimit } from '@/lib/api/rate-limit';
import { generateTokenPair } from '@/lib/auth/jwt';
import type { User } from '@/lib/auth/types';
import {
  createErrorResponse,
  createSuccessResponse,
  ERROR_CODES,
  handleApiError,
  HTTP_STATUS,
  LoginSchema,
  validateHttpMethod,
  validateInput,
} from '@/utils/api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validar método HTTP
    const methodError = validateHttpMethod(request, ['POST']);
    if (methodError) return methodError;

    // Aplicar rate limiting específico para auth
    const rateLimitResult = await authRateLimit(request, 'login');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    try {
      const body = await request.json();

      // Validar dados de entrada com Zod
      const validationResult = await validateInput(LoginSchema, body);
      if (!validationResult.success) {
        return createErrorResponse(
          {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Dados de login inválidos',
            details: validationResult.errors,
          },
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      const { email, password } = validationResult.data;

      // Simular validação de credenciais
      // Em produção, aqui você validaria com o banco de dados
      if (email === 'admin@example.com' && password === 'password123') {
        const user: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          role: 'admin',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };

        // Gerar tokens JWT reais
        const tokens = generateTokenPair(user);

        return createSuccessResponse(
          {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role,
            },
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn,
          },
          'Login realizado com sucesso',
        );
      }

      // Credenciais inválidas
      return createErrorResponse(
        {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Email ou senha incorretos',
        },
        HTTP_STATUS.UNAUTHORIZED,
      );
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
