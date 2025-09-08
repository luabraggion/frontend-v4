// Configurações de autenticação
export const AUTH_CONFIG = {
  tokenExpiry: 3600, // 1 hora em segundos
  refreshTokenExpiry: 604800, // 7 dias em segundos
  sessionName: 'portal-session',
  cookieName: 'portal-token',
} as const;
