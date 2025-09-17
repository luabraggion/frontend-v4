# 📚 Estrutura Híbrida: `utils/` vs `lib/`

Esta documentação explica a **arquitetura híbrida** implementada no projeto, que separa claramente **utilitários simples** de **bibliotecas complexas**.

## 🎯 **Filosofia da Organização**

### **`utils/` - Utilitários e Helpers**

- ✅ **Funções puras** e stateless
- ✅ **Helpers simples** e reutilizáveis
- ✅ **Constantes** e tipos básicos
- ✅ **Validações** e transformações
- ✅ **Facilmente testáveis**

### **`lib/` - Bibliotecas e Middlewares**

- ✅ **Módulos complexos** com estado
- ✅ **Middlewares** e interceptadores
- ✅ **Configurações** e integrações
- ✅ **Classes** e serviços
- ✅ **Lógica de negócio** complexa

---

## 📁 **Nova Estrutura Organizada**

```
src/
├── utils/                      # 🔧 UTILITÁRIOS SIMPLES
│   ├── api/                   # Helpers da API
│   │   ├── constants.ts       # HTTP_STATUS, ERROR_CODES, tipos básicos
│   │   ├── helpers.ts         # Funções puras (extractPaginationParams, getClientIp)
│   │   ├── responses.ts       # Criadores de resposta (createSuccessResponse)
│   │   ├── validation.ts      # Schemas Zod e validadores
│   │   └── index.ts          # Exportações centralizadas
│   ├── common.ts             # Utilitários gerais (cn, clsx)
│   └── date.ts               # Manipulação de datas
│
├── lib/                       # 📚 BIBLIOTECAS COMPLEXAS
│   ├── middleware/           # Middlewares com estado
│   │   ├── auth.ts          # Sistema de autenticação JWT
│   │   ├── rateLimit.ts     # Rate limiting com store
│   │   └── index.ts         # Exportações centralizadas
│   ├── database/            # (futuro) Configurações do DB
│   ├── integrations/        # (futuro) APIs externas
│   └── index.ts            # Exportações centralizadas
│
├── types/                    # 📝 DEFINIÇÕES DE TIPOS
│   └── api/
│       └── index.ts         # Interfaces completas da API
│
└── app/api/                  # 🛣️ ROTAS DA API
    ├── auth/login/
    ├── users/me/
    ├── campaigns/
    └── README.md            # Documentação específica das rotas
```

---

## 🔄 **Comparação: Antes vs Depois**

### **❌ Estrutura Anterior (Confusa)**

```
src/lib/api/          # Tudo misturado
├── responses.ts      # Funções puras + constantes + tipos
├── validation.ts     # Schemas + validadores
├── auth.ts          # Middleware complexo
└── rateLimit.ts     # Middleware com estado
```

### **✅ Estrutura Atual (Organizada)**

```
src/utils/api/        # Helpers simples e puros
├── constants.ts      # Apenas constantes
├── helpers.ts        # Apenas funções puras
├── responses.ts      # Apenas criadores de resposta
└── validation.ts     # Apenas schemas e validação

src/lib/middleware/   # Bibliotecas complexas
├── auth.ts          # Sistema completo de autenticação
└── rateLimit.ts     # Sistema completo de rate limiting
```

---

## 📦 **Importações Simplificadas**

### **Antes (Múltiplas Importações)**

```typescript
import { createSuccessResponse, HTTP_STATUS } from '@/lib/api/responses';
import { validateInput, LoginSchema } from '@/lib/api/validation';
import { requireAuth } from '@/lib/api/auth';
import { standardRateLimit } from '@/lib/api/rateLimit';
```

### **Depois (Importações Centralizadas)**

```typescript
// Para utilitários simples - TUDO de uma vez
import {
  createSuccessResponse,
  HTTP_STATUS,
  validateInput,
  LoginSchema,
} from '@/utils/api';

// Para middlewares complexos
import { requireAuth, standardRateLimit } from '@/lib/middleware';
```

---

## 🎨 **Padrões de Uso**

### **1. Utils - Para Funções Puras**

```typescript
// ✅ Bom uso de utils/
import {
  extractPaginationParams,
  formatTimestamp,
  getClientIp,
} from '@/utils/api';

// Função pura, sem estado
const params = extractPaginationParams(request);
const timestamp = formatTimestamp();
const ip = getClientIp(request);
```

### **2. Lib - Para Bibliotecas Complexas**

```typescript
// ✅ Bom uso de lib/
import { requireAuth, createRateLimit } from '@/lib/middleware';

// Middleware com estado e configuração
const authResult = await requireAuth(request);
const customRateLimit = createRateLimit({ maxRequests: 50, windowMs: 60000 });
```

### **3. Tipos - Para Definições**

```typescript
// ✅ Tipos específicos
import type { User, Campaign, AuthenticatedUser } from '@/types/api';
```

---

## 🔧 **Exemplos Práticos**

### **Criando uma Nova Rota API**

```typescript
// src/app/api/exemplo/route.ts
import { NextRequest } from 'next/server';

// Utilitários simples (funções puras)
import {
  createSuccessResponse,
  validateHttpMethod,
  handleApiError,
  HTTP_STATUS,
} from '@/utils/api';

// Middlewares complexos (com estado)
import { requireAuth, standardRateLimit } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // 1. Validação simples
    const methodError = validateHttpMethod(request, ['GET']);
    if (methodError) return methodError;

    // 2. Middleware complexo
    const rateLimitResult = await standardRateLimit(request);
    if (!rateLimitResult.success) return rateLimitResult.response;

    // 3. Middleware de autenticação
    const authResult = await requireAuth(request);
    if (!authResult.success) return authResult.response;

    // 4. Lógica da rota
    const data = { message: 'Hello World!' };

    // 5. Resposta padronizada
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 📋 **Regras de Organização**

### **Use `utils/` quando:**

- ✅ Função é **pura** (sem efeitos colaterais)
- ✅ Não mantém **estado**
- ✅ É **facilmente testável**
- ✅ É um **helper simples**
- ✅ Retorna sempre o mesmo resultado para a mesma entrada

### **Use `lib/` quando:**

- ✅ Módulo é **complexo** ou tem estado
- ✅ É um **middleware** ou interceptador
- ✅ Gerencia **configurações** ou conexões
- ✅ Implementa **lógica de negócio** complexa
- ✅ É uma **classe** ou **serviço**

### **Use `types/` quando:**

- ✅ Definindo **interfaces** globais
- ✅ Criando **tipos** reutilizáveis
- ✅ Documentando **contratos** da API

---

## 🚀 **Benefícios da Nova Estrutura**

1. **🎯 Clareza**: Fácil entender onde cada código pertence
2. **🔄 Reutilização**: Utilitários facilmente reutilizáveis
3. **🧪 Testabilidade**: Funções puras são fáceis de testar
4. **📚 Manutenibilidade**: Separação clara de responsabilidades
5. **🔍 Descobribilidade**: Importações centralizadas
6. **⚡ Performance**: Tree-shaking otimizado
7. **📖 Documentação**: Estrutura auto-documentada

Esta estrutura híbrida nos dá o melhor dos dois mundos: **simplicidade** para helpers e **robustez** para bibliotecas complexas! 🎯
