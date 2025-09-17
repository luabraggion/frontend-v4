/**
 * Exportações centralizadas da biblioteca
 *
 * Organizada por categorias funcionais:
 * - auth: Sistema de autenticação e autorização
 * - api: Cliente API, middlewares e rate limiting
 * - ui: Utilitários de interface, variantes e datas
 * - config: Configurações e constantes globais
 */

// 🔐 Sistema de Autenticação
export * from './auth';

// 🌐 Cliente e Middlewares de API
export * from './api';

// 🎨 Utilitários de Interface
export * from './ui';

// ⚙️ Configurações Globais
export * from './config';

// Futuras bibliotecas:
// export * from './database';
// export * from './integrations';
// export * from './cache';
