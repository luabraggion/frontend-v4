# API Centralizada - Next.js 15 (Estrutura Híbrida)

Esta é uma estrutura de API centralizada seguindo as melhores práticas do Next.js 15 com App Router e **arquitetura híbrida** `utils/` vs `lib/`.

## 📁 Estrutura Híbrida dos Diretórios

```
nextjs/
├── utils/api/                  # 🔧 UTILITÁRIOS SIMPLES
│   ├── constants.ts           # HTTP_STATUS, ERROR_CODES, tipos básicos
│   ├── helpers.ts             # Funções puras (extractPaginationParams, getClientIp)
│   ├── responses.ts           # Criadores de resposta padronizada
│   ├── validation.ts          # Schemas Zod e validadores
│   └── index.ts              # Exportações centralizadas
│
├── middleware/                # 📚 BIBLIOTECAS COMPLEXAS
│   ├── auth.ts               # Sistema completo de autenticação JWT
│   ├── rateLimit.ts          # Rate limiting com store em memória
│   └── index.ts              # Exportações centralizadas
│
├── types/api/                 # 📝 DEFINIÇÕES DE TIPOS
│   └── index.ts              # Interfaces completas da API
│
└── app/api/                   # 🛣️ ROTAS DA API
    ├── auth/login/           # POST /api/auth/login
    ├── users/me/             # GET/PUT /api/users/me
    ├── campaigns/            # GET/POST /api/campaigns
    └── README.md             # Esta documentação
```

## 🚀 Funcionalidades

### ✅ Implementadas

- **Respostas Padronizadas**: Formato consistente para todas as APIs
- **Validação de Entrada**: Usando Zod para validação robusta
- **Autenticação**: Middleware JWT com roles
- **Rate Limiting**: Proteção contra abuso com limites configuráveis
- **Paginação**: Sistema completo de paginação
- **Tratamento de Erros**: Captura e formatação automática
- **TypeScript**: Tipagem completa e segura

### 🔧 Utilitários Disponíveis

#### Respostas (`lib/api/responses.ts`)

```typescript
// Resposta de sucesso
createSuccessResponse(data, message?, status?)

// Resposta de erro
createErrorResponse(error, status?, headers?)

// Resposta paginada
createPaginatedResponse(data, pagination, message?)

// Extração de parâmetros de paginação
extractPaginationParams(request)

// Validação de métodos HTTP
validateHttpMethod(request, allowedMethods)

// Tratamento de erros
handleApiError(error)
```

#### Validação (`lib/api/validation.ts`)

```typescript
// Schemas disponíveis
(LoginSchema, RegisterSchema, UpdateUserSchema);
(CreateCampaignSchema, PaginationSchema);
(EmailSchema, IdSchema, DateRangeSchema);

// Funções utilitárias
validateInput(schema, data);
formatValidationErrors(errors);
```

#### Autenticação (`lib/api/auth.ts`)

```typescript
// Middleware de autenticação
requireAuth(request);

// Middleware de roles
requireRole(allowedRoles);
requireAdmin(request, user);
requireModerator(request, user);

// Funções utilitárias
extractTokenFromHeader(request);
validateToken(token);
```

#### Rate Limiting (`lib/api/rateLimit.ts`)

```typescript
// Configurações predefinidas
RATE_LIMIT_CONFIGS.STANDARD; // 100 req/min
RATE_LIMIT_CONFIGS.AUTH; // 10 req/min
RATE_LIMIT_CONFIGS.PUBLIC; // 1000 req/hour

// Middlewares
standardRateLimit(request);
authRateLimit(request);
publicRateLimit(request);

// Utilitários
addRateLimitHeaders(response, limit, remaining, resetTime);
```

## 📋 Endpoints Disponíveis

### Autenticação

#### POST `/api/auth/login`

```json
// Request
{
  "email": "admin@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "...",
      "expiresIn": 3600
    }
  },
  "message": "Login realizado com sucesso",
  "timestamp": "2024-12-19T..."
}
```

### Usuários

#### GET `/api/users/me`

Retorna dados do usuário autenticado.

**Headers**: `Authorization: Bearer <token>`

#### PUT `/api/users/me`

Atualiza dados do usuário autenticado.

### Campanhas

#### GET `/api/campaigns`

Lista campanhas com paginação.

**Query Params**:

- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máx: 100)
- `sortBy`: Campo de ordenação (padrão: 'createdAt')
- `sortOrder`: Direção (asc/desc, padrão: 'desc')

#### POST `/api/campaigns`

Cria nova campanha (apenas admin/moderator).

## 🔒 Segurança

### Rate Limiting

- **Padrão**: 100 requests/minuto
- **Autenticação**: 10 requests/minuto
- **APIs Públicas**: 1000 requests/hora

### Autenticação

- Bearer Token JWT
- Validação de roles (admin, moderator, user)
- Extração segura de IP para rate limiting

### Validação

- Schemas Zod para todas as entradas
- Sanitização automática de dados
- Mensagens de erro detalhadas em desenvolvimento

## 🚦 Status HTTP

```typescript
HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
```

## 🎯 Códigos de Erro

```typescript
ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE: 'MAINTENANCE',
};
```

## 📚 Exemplos de Uso

### Criando uma Nova Rota

```typescript
// src/app/api/exemplo/route.ts
import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  validateHttpMethod,
  handleApiError,
  requireAuth,
  standardRateLimit,
} from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // 1. Validar método
    const methodError = validateHttpMethod(request, ['GET']);
    if (methodError) return methodError;

    // 2. Rate limiting
    const rateLimitResult = await standardRateLimit(request);
    if (!rateLimitResult.success) return rateLimitResult.response;

    // 3. Autenticação (se necessária)
    const authResult = await requireAuth(request);
    if (!authResult.success) return authResult.response;

    // 4. Lógica da API
    const data = { message: 'Hello World!' };

    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Validando Entrada

```typescript
import { validateInput, CreateCampaignSchema } from '@/lib/api/validation';

const body = await request.json();
const validationResult = await validateInput(CreateCampaignSchema, body);

if (!validationResult.success) {
  return createErrorResponse(
    {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Dados inválidos',
      details: validationResult.errors.errors,
    },
    HTTP_STATUS.BAD_REQUEST,
  );
}

const data = validationResult.data;
```

## 🛠️ Próximos Passos

1. **Banco de Dados**: Integrar com Prisma/Drizzle
2. **Middleware Global**: Implementar middleware.ts
3. **Autenticação Real**: Implementar JWT real
4. **Testes**: Adicionar testes unitários e de integração
5. **OpenAPI**: Gerar documentação Swagger
6. **Cache**: Implementar Redis para rate limiting distribuído

## 📝 Notas de Desenvolvimento

- Use `dev-token` para testes de autenticação
- Email de teste: `admin@example.com` / `password123`
- Rate limiting usa armazenamento em memória (desenvolvimento)
- Logs detalhados em modo development
- Build validado e funcionando ✅
