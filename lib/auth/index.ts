// Exportações centralizadas da autenticação
export * from './config';
export {
  JWT_CONFIG,
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  isTokenExpired,
  verifyToken as verifyJWTToken,
  type JWTPayload,
} from './jwt';
export * from './types';
export * from './utils';
