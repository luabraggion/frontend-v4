import { verifyToken as verifyJWT } from './jwt';
import { User } from './types';

// Validação de token e busca de usuário
export function validateTokenAndGetUser(token: string): { isValid: boolean; user?: User } {
  const result = verifyJWT(token);

  if (!result.isValid || !result.payload) {
    return { isValid: false };
  }

  // Simular busca de usuário no banco baseado no payload
  // Em produção, você faria uma consulta ao banco de dados
  const user: User = {
    id: result.payload.userId,
    name: 'Admin User', // Em produção, buscar do banco
    email: result.payload.email,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: result.payload.role,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  };

  return {
    isValid: true,
    user,
  };
}

// Manter compatibilidade com código existente
export const verifyToken = validateTokenAndGetUser;

// Verificação de sessão do usuário
export function getSession(request: Request): { user?: User; isAuthenticated: boolean } {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { isAuthenticated: false };
  }

  const { isValid, user } = verifyToken(token);

  return {
    isAuthenticated: isValid,
    user: isValid ? user : undefined,
  };
}
