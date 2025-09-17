// Constantes da aplicação
export const APP_CONFIG = {
  name: 'Portal de Benefícios',
  version: '4.0.0',
  description: 'Sistema completo para gestão de benefícios, premiações e sorteios',
  company: 'Big2be.',
} as const;

// URLs e rotas importantes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  ADMIN: {
    USERS: '/(admin)/users',
    SETTINGS: '/(admin)/settings',
  },
} as const;

// Configurações de temas
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Roles de usuário
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Constantes de tempo
export const TIME_CONSTANTS = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Limites de rate limiting
export const RATE_LIMITS = {
  STANDARD: 100, // requisições por hora
  AUTH: 5, // tentativas de login por minuto
  SENSITIVE: 10, // operações sensíveis por hora
} as const;

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

// Mensagens padrão
export const MESSAGES = {
  ERRORS: {
    GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Você não tem permissão para acessar este recurso.',
    NOT_FOUND: 'Recurso não encontrado.',
    VALIDATION: 'Dados inválidos fornecidos.',
  },
  SUCCESS: {
    SAVED: 'Dados salvos com sucesso!',
    DELETED: 'Item removido com sucesso!',
    UPDATED: 'Dados atualizados com sucesso!',
    LOGIN: 'Login realizado com sucesso!',
  },
} as const;
