import { z } from 'zod';

/**
 * Schemas de Validação
 *
 * Utilitários para validação de dados usando Zod
 * Inclui schemas reutilizáveis e funções helper
 */

/**
 * Schemas básicos reutilizáveis
 */
export const EmailSchema = z.string().email('Email inválido');
export const SimpleIdSchema = z.string().min(1, 'ID é obrigatório');
export const UUIDSchema = z.string().uuid('UUID inválido');
export const PasswordSchema = z.string().min(8, 'Senha deve ter pelo menos 8 caracteres');

/**
 * Schema para validação de ID em objeto
 */
export const IdSchema = z.object({
  id: SimpleIdSchema,
});

/**
 * Schema de validação para parâmetros de paginação
 */
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema para intervalos de data
 */
export const DateRangeSchema = z.object({
  startDate: z.string().datetime('Data de início inválida').optional(),
  endDate: z.string().datetime('Data de fim inválida').optional(),
});

/**
 * Schemas específicos da aplicação
 */

// Autenticação
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: EmailSchema,
  password: PasswordSchema,
});

// Usuários
export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: EmailSchema.optional(),
});

// Campanhas
export const CreateCampaignSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['giveaway', 'contest', 'sweepstakes']),
  startDate: z.string().datetime('Data de início inválida'),
  endDate: z.string().datetime('Data de fim inválida'),
  settings: z
    .object({
      maxParticipants: z.number().positive().optional(),
      requiresApproval: z.boolean().default(false),
      allowMultipleEntries: z.boolean().default(false),
    })
    .optional(),
});

export const UpdateCampaignSchema = CreateCampaignSchema.partial();

/**
 * Função utilitária para validar dados de entrada
 */
export async function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Função para formatar erros de validação para exibição
 */
export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.errors.map((error) => {
    const path = error.path.join('.');
    return `${path}: ${error.message}`;
  });
}

/**
 * Função para extrair apenas as mensagens de erro
 */
export function getValidationErrorMessages(errors: z.ZodError): string[] {
  return errors.errors.map((error) => error.message);
}
