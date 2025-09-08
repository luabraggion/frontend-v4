import jwt from 'jsonwebtoken';
import type { User } from './types';

// Configurações JWT
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  issuer: 'big2be-nextjs',
  audience: 'big2be-users',
} as const;

// Interface para payload do JWT
export interface JWTPayload {
  userId: string;
  email: string;
  role: User['role'];
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

// Gerar access token
export function generateAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.accessTokenExpiry,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
  });
}

// Gerar refresh token
export function generateRefreshToken(user: Pick<User, 'id' | 'email'>): string {
  const payload = {
    userId: user.id,
    email: user.email,
    type: 'refresh',
  };

  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.refreshTokenExpiry,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
  });
}

// Verificar e decodificar token
export function verifyToken(token: string): {
  isValid: boolean;
  payload?: JWTPayload;
  error?: string;
} {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    }) as JWTPayload;

    return {
      isValid: true,
      payload: decoded,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        isValid: false,
        error: error.message,
      };
    }

    return {
      isValid: false,
      error: 'Token verification failed',
    };
  }
}

// Gerar par de tokens (access + refresh)
export function generateTokenPair(user: Pick<User, 'id' | 'email' | 'role'>) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Calcular tempo de expiração em segundos
  const accessTokenExpiry = jwt.decode(accessToken) as JWTPayload;
  const expiresIn = accessTokenExpiry.exp
    ? accessTokenExpiry.exp - Math.floor(Date.now() / 1000)
    : 900; // 15min default

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

// Verificar se token está expirado
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded.exp) return true;

    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

// Decodificar token sem verificar (útil para obter info expirada)
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
