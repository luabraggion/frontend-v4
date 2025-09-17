# Estrutura Next.js 15 - Portal de Benefícios

Este projeto segue a estrutura recomendada para Next.js 15 com App Router, TypeScript e organização modular.

## 📁 Estrutura de Diretórios

```
nextjs/
├── app/                     # App Router: páginas, layouts, templates
│   ├── layout.tsx           # Layout raiz (header, footer, etc.)
│   ├── page.tsx             # Página inicial
│   ├── loading.tsx          # Skeleton global
│   ├── error.tsx            # Tratamento de erro global
│   ├── not-found.tsx        # Página 404
│   ├── dashboard/           # Rota protegida
│   │   ├── layout.tsx       # Layout específico do dashboard
│   │   └── page.tsx         # Página principal do dashboard
│   ├── auth/                # Login, registro, etc.
│   │   ├── login/page.tsx   # Página de login
│   │   └── register/page.tsx # Página de registro
│   ├── api/                 # Rotas de API internas
│   │   ├── auth/route.ts    # Autenticação
│   │   ├── user/me/route.ts # Dados do usuário
│   │   └── campaigns/route.ts # Campanhas
│   └── (admin)/             # Route group para área administrativa
│       ├── users/page.tsx   # Gerenciar usuários
│       └── settings/page.tsx # Configurações do sistema
│
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Design system: Button, Input, Modal...
│   ├── layout/             # Header, Sidebar, Footer...
│   ├── forms/              # Formulários específicos
│   ├── buttons/            # Componentes de botões
│   ├── feedback/           # Alertas, tooltips, badges
│   └── navigation/         # Navegação e breadcrumbs
│
├── lib/                    # Funções utilitárias e helpers
│   ├── auth.ts             # Verificação de token, sessão...
│   ├── api.ts              # Configuração de fetch/api calls
│   ├── constants.ts        # Constantes globais
│   ├── utils.ts            # Utilitários do shadcn/ui
│   └── date-utils.ts       # Utilitários de data
│
├── hooks/                  # Custom React hooks
│   ├── useUser.ts          # Hook para dados do usuário
│   └── useForm.ts          # Hook para gerenciar formulários
│
├── store/                  # Gerenciamento de estado
│   └── userStore.ts        # Store do usuário (Context API)
│
├── styles/                 # Estilos globais e temas
│   ├── globals.css         # Estilos globais e variáveis CSS
│   └── theme.ts            # Configuração de temas e design tokens
│
├── middleware/             # Middleware personalizado (interno)
│   ├── auth.ts             # Middleware de autenticação
│   ├── rateLimit.ts        # Limitação de taxa
│   └── index.ts            # Exportações centralizadas
│
├── utils/                  # Utilitários simples da API
│   └── api/                # Helpers de API, validação, responses
│
├── types/                  # Definições de tipos TypeScript
│   └── api/                # Tipos específicos da API
│
├── public/                 # Imagens, fontes, ícones
│   ├── images/             # Imagens da aplicação
│   ├── icons/              # Ícones e favicons
│   └── ...                 # Outros assets estáticos
│
├── middleware.ts           # Proteção de rotas global (Next.js)
├── next.config.ts          # Configuração do Next.js
├── tailwind.config.js      # Configuração do Tailwind
├── tsconfig.json           # Configuração do TypeScript
└── package.json            # Dependências e scripts
```

## 🎯 Principais Mudanças Implementadas

### 1. **Organização por Funcionalidade**

- `app/` - Todas as rotas e páginas usando App Router
- `components/` - Componentes organizados por categoria
- `lib/` - Bibliotecas e configurações complexas
- `hooks/` - Custom hooks reutilizáveis
- `store/` - Gerenciamento de estado centralizado
- `styles/` - Temas e estilos globais

### 2. **API Routes Reorganizadas**

- `/api/auth` - Autenticação (login, registro)
- `/api/user/me` - Dados do usuário atual
- `/api/campaigns` - Gestão de campanhas

### 3. **Middleware Global**

- Proteção automática de rotas
- Headers de segurança
- Rate limiting integrado
- Redirecionamento inteligente

### 4. **Route Groups**

- `(admin)/` - Área administrativa isolada
- Layouts específicos por seção
- Proteção de acesso por role

### 5. **Error Handling**

- `error.tsx` - Tratamento global de erros
- `not-found.tsx` - Página 404 customizada
- `loading.tsx` - Estados de loading

## 🚀 Como Usar

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 📋 Próximos Passos

1. **Implementar autenticação JWT real**
2. **Conectar com banco de dados**
3. **Adicionar testes unitários**
4. **Implementar PWA features**
5. **Configurar CI/CD**

## 🔧 Configurações

### ESLint

- Configurado para Next.js 15
- Regras TypeScript strict
- Import organization

### Tailwind CSS

- Design system customizado
- Temas light/dark
- Componentes shadcn/ui

### TypeScript

- Configuração strict
- Path mapping (@/)
- Tipos bem definidos

## 🛡️ Segurança

- Headers de segurança automáticos
- Rate limiting por endpoint
- Validação de entrada com Zod
- Sanitização de dados

Esta estrutura fornece uma base sólida e escalável para o desenvolvimento do Portal de Benefícios, seguindo as melhores práticas do Next.js 15 e do ecossistema React moderno.
