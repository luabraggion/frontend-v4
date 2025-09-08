# Components

Esta pasta contém todos os componentes React reutilizáveis do projeto, organizados por tipo e responsabilidade para facilitar a escalabilidade e manutenção.

## Estrutura Organizada

- **`ui/`**: Componentes genéricos do shadcn/ui (Button, Input, Dialog, Calendar, Tooltip, etc).
- **`layout/`**: Componentes de estrutura/layout da aplicação (Header, Footer, Sidebar).
- **`forms/`**: Componentes relacionados a formulários, organizados por responsabilidade:
  - **`Fields/`**: Campos de entrada (Input, Combobox, DatePicker)
  - **`Labels/`**: Labels e títulos para formulários
- **`buttons/`**: Botões especializados e variações customizadas.
- **`navigation/`**: Componentes de navegação (Breadcrumbs, Menus, etc).
- **`feedback/`**: Componentes para feedback visual e interação do usuário (Tooltips, Avatars, etc).

## Componentes Disponíveis

### 🎯 Feedback Components

- **`TooltipWrapper`**: Tooltip otimizado e reutilizável com memoização
- **`TooltipInfo/Warning/Error/Success`**: Variações pré-configuradas de tooltips
- **`Avatar`**: Avatar altamente performático com fallbacks inteligentes
- **`AvatarGroup`**: Grupo de avatars com contador de itens extras

### 📝 Form Components

- **`Input`**: Campo de entrada otimizado
- **`Combobox`**: Seletor com busca
- **`DatePicker`**: Seletor de data com validações
- **`Label`**: Labels consistentes para formulários

### 🔘 Button Components

- **`ButtonIcon`**: Botão apenas com ícone
- **`ButtonWithIcon`**: Botão com ícone e texto

### 🧭 Navigation Components

- **`BreadcrumbNavigation`**: Navegação breadcrumb otimizada

## Imports Simplificados

Cada categoria possui barrel exports (arquivo `index.ts`) que permite imports limpos:

```tsx
// Imports de feedback
import { TooltipWrapper, Avatar } from '@/components/feedback';

// Imports de formulários
import { Input, Combobox, DatePicker } from '@/components/forms/Fields';
import { Label } from '@/components/forms/Labels';

// Imports de botões
import { ButtonIcon, ButtonWithIcon } from '@/components/buttons';

// Import global (todos os componentes)
import { TooltipWrapper, Input, ButtonIcon } from '@/components';
```

## Características de Performance

### ✅ Otimizações Implementadas

- **React.memo**: Todos os componentes customizados são memoizados
- **useMemo**: Props complexas são memoizadas para evitar re-renders
- **useCallback**: Callbacks são otimizados
- **Imports Modernos**: React imports otimizados (sem namespace desnecessário)
- **Tree Shaking**: Imports específicos para melhor bundle size

### 📊 Resultados

- **Bundle Size**: Otimizado (176 kB First Load JS)
- **Build Time**: Rápido com Turbopack
- **Runtime Performance**: Mínimos re-renders desnecessários

## Diretrizes de Desenvolvimento

### 🏗️ Criação de Novos Componentes

1. **Localização**: Escolha a pasta adequada pela responsabilidade
2. **Tipagem**: Use TypeScript com interfaces claras
3. **Performance**: Aplique `memo`, `useMemo`, `useCallback` quando necessário
4. **Documentação**: Adicione JSDoc com exemplos de uso
5. **Exports**: Atualize o `index.ts` da categoria

### 🎨 Padrões de Design

- **Acessibilidade**: Sempre considere `aria-*` attributes
- **Responsividade**: Use classes Tailwind responsivas
- **Consistência**: Siga os padrões visuais estabelecidos
- **Flexibilidade**: Permita customização via props

### 📝 Exemplos de Uso

```tsx
// Tooltip básico
<TooltipWrapper content="Informação útil">
  <Button>Hover me</Button>
</TooltipWrapper>

// Avatar com status
<Avatar
  name="João Silva"
  size="lg"
  status="online"
  showStatus
  bordered
/>

// Form completo
<form>
  <Label>Nome completo</Label>
  <Input placeholder="Digite seu nome..." />

  <Label>Data de nascimento</Label>
  <DatePicker />

  <ButtonWithIcon icon={<Save />}>
    Salvar
  </ButtonWithIcon>
</form>
```

## Estrutura de Arquivos

```
components/
├── ui/                    # shadcn/ui base components
├── forms/
│   ├── Fields/           # Input, Combobox, DatePicker
│   ├── Labels/           # Label components
│   └── index.ts          # Barrel exports
├── buttons/              # ButtonIcon, ButtonWithIcon
├── navigation/           # BreadcrumbNavigation
├── feedback/            # TooltipWrapper, Avatar
├── layout/              # Header, Footer
├── theme-provider.tsx   # Theme context
├── index.ts            # Global barrel exports
└── README.md           # Esta documentação
```

Consulte o README de cada subpasta para mais detalhes e exemplos específicos de cada categoria.
