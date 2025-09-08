import { requireAuth } from '@/lib/api/middleware';
import { standardRateLimit } from '@/lib/api/rate-limit';
import {
  CreateCampaignSchema,
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
  ERROR_CODES,
  extractPaginationParams,
  handleApiError,
  HTTP_STATUS,
  validateHttpMethod,
  validateInput,
} from '@/utils/api';
import { NextRequest } from 'next/server';

// GET /api/campaigns - Listar campanhas
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

    // Extrair parâmetros de paginação
    const pagination = extractPaginationParams(request);

    // Simular dados de campanhas
    const mockCampaigns = [
      {
        id: '1',
        title: 'Sorteio de Natal 2024',
        description: 'Grande sorteio de fim de ano com prêmios incríveis!',
        type: 'giveaway' as const,
        status: 'active' as const,
        startDate: '2024-12-01T00:00:00.000Z',
        endDate: '2024-12-25T23:59:59.000Z',
        participantCount: 1250,
        createdAt: '2024-11-15T10:00:00.000Z',
      },
      {
        id: '2',
        title: 'Concurso de Fotos',
        description: 'Mostre sua criatividade e ganhe prêmios!',
        type: 'contest' as const,
        status: 'draft' as const,
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.000Z',
        participantCount: 0,
        createdAt: '2024-12-01T14:30:00.000Z',
      },
    ];

    // Simular paginação
    const total = mockCampaigns.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const data = mockCampaigns.slice(startIndex, endIndex);

    return createPaginatedResponse(
      data,
      {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
      'Campanhas recuperadas com sucesso',
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/campaigns - Criar nova campanha
export async function POST(request: NextRequest) {
  try {
    // Validar método HTTP
    const methodError = validateHttpMethod(request, ['POST']);
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

    // Verificar se o usuário tem permissão para criar campanhas
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return createErrorResponse(
        {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Apenas administradores e moderadores podem criar campanhas',
        },
        HTTP_STATUS.FORBIDDEN,
      );
    }

    try {
      const body = await request.json();

      // Validar dados de entrada
      const validationResult = await validateInput(CreateCampaignSchema, body);
      if (!validationResult.success) {
        return createErrorResponse(
          {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Dados da campanha inválidos',
            details: validationResult.errors.errors,
          },
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      const campaignData = validationResult.data;

      // Validar que a data de fim é posterior à de início
      if (new Date(campaignData.endDate) <= new Date(campaignData.startDate)) {
        return createErrorResponse(
          {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Data de fim deve ser posterior à data de início',
          },
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Simular criação da campanha
      const newCampaign = {
        id: Math.random().toString(36).substring(7),
        ...campaignData,
        status: 'draft' as const,
        participantCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.id,
      };

      return createSuccessResponse(newCampaign, 'Campanha criada com sucesso', HTTP_STATUS.CREATED);
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
