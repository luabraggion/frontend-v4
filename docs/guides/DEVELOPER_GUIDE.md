# 👩‍💻 Guia do Desenvolvedor

Este documento fornece informações detalhadas para desenvolvedores que trabalharão no projeto.

## 📋 Índice

- [🚀 Início Rápido](#-início-rápido)
- [🏗️ Arquitetura e Padrões](#️-arquitetura-e-padrões)
- [🎨 Sistema de Design](#-sistema-de-design)
- [📝 Convenções de Código](#-convenções-de-código)
- [🧪 Testes](#-testes)
- [📊 Performance](#-performance)
- [🔧 Troubleshooting](#-troubleshooting)

## 🚀 Início Rápido

### Para Novos Desenvolvedores

1. **Configuração do Ambiente:**

   ```bash
   # Clone e configure
   git clone <repo-url>
   cd nextjs
   npm install

   # Configure Git hooks
   npx husky init

   # Inicie desenvolvimento
   npm run dev
   ```

2. **Configure Variáveis de Ambiente:**

   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env.local

   # Edite as variáveis necessárias
   # Pelo menos JWT_SECRET deve ser alterado!
   ```

   **⚠️ Variáveis Críticas:**

   ```bash
   JWT_SECRET=sua-chave-secreta-32-chars-minimo
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Instale as Extensões Recomendadas:**
   - VS Code irá sugerir automaticamente
   - Ou use: `Ctrl+Shift+P` → "Extensions: Show Recommended Extensions"

4. **Verifique se tudo está funcionando:**
   ```bash
   npm run check-all
   ```

### Fluxo de Trabalho Diário

```bash
# 1. Atualize sua branch
git pull origin main

# 2. Crie nova feature branch
git checkout -b feature/sua-feature

# 3. Desenvolva com hot reload
npm run dev

# 4. Verifique qualidade antes de commitar
npm run check-all

# 5. Commit (hooks automáticos executam)
git add .
git commit -m "feat: sua nova feature"

# 6. Push e crie PR
git push origin feature/sua-feature
```

## 🏗️ Arquitetura e Padrões

### 📁 Organização de Componentes

```
src/components/
├── ui/           # Componentes base do shadcn/ui
├── forms/        # Componentes relacionados a formulários
│   ├── Fields/   # Inputs, Selects, etc.
│   └── Labels/   # Labels reutilizáveis
├── buttons/      # Variações de botões
├── navigation/   # Componentes de navegação
├── feedback/     # Alerts, Toasts, Modals
└── layout/       # Componentes de layout
```

### 🎯 Padrões de Componentes

#### 1. **Estrutura Base de Componente:**

```tsx
'use client'; // Se precisar de interatividade

import { memo, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Interface sempre com Props suffix
interface MineuComponenteProps extends ComponentProps<'div'> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// Componente sempre em memo para performance
const MeuComponente = memo<MeuComponenteProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }) => {
    return (
      <div
        className={cn(
          // Classes base
          'flex items-center justify-center',
          // Variantes
          {
            'bg-primary text-primary-foreground': variant === 'default',
            'bg-secondary text-secondary-foreground': variant === 'secondary',
          },
          // Tamanhos
          {
            'p-2 text-sm': size === 'sm',
            'p-4 text-base': size === 'md',
            'p-6 text-lg': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// DisplayName para debugging
MeuComponente.displayName = 'MeuComponente';

export default MeuComponente;
```

#### 2. **Export Pattern:**

```tsx
// src/components/categoria/index.ts
export { default as MeuComponente } from './MeuComponente';
export { default as OutroComponente } from './OutroComponente';

// Uso
import { MeuComponente, OutroComponente } from '@/components/categoria';
```

#### 3. **Tipagem com Variantes:**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

### 🔄 Hooks Customizados

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
```

## 🎨 Sistema de Design

### 🎨 Tokens de Design (Tailwind)

```tsx
// Cores primárias
const colors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  destructive: 'hsl(var(--destructive))',
};

// Espaçamentos consistentes
const spacing = {
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
};

// Tipografia
const typography = {
  xs: 'text-xs', // 12px
  sm: 'text-sm', // 14px
  base: 'text-base', // 16px
  lg: 'text-lg', // 18px
  xl: 'text-xl', // 20px
  '2xl': 'text-2xl', // 24px
};
```

### 🎯 Classes Utilitárias Personalizadas

```css
/* src/app/globals.css */

/* Container responsivo */
.container-responsive {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

/* Botão base */
.btn-base {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background;
}

/* Card padrão */
.card-base {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}

/* Input padrão */
.input-base {
  @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}
```

## 📝 Convenções de Código

### 🔤 Nomenclatura

```tsx
// ✅ Correto
const UserProfile = () => {}; // PascalCase para componentes
const useUserData = () => {}; // camelCase para hooks
const API_ENDPOINT = 'https://...'; // UPPER_CASE para constantes
const isUserLoggedIn = true; // camelCase para variáveis

// ❌ Incorreto
const userProfile = () => {}; // Componente deve ser PascalCase
const UseUserData = () => {}; // Hook deve ser camelCase
const apiEndpoint = 'https://...'; // Constante deve ser UPPER_CASE
```

### 📂 Arquivos e Pastas

```
✅ Correto:
- UserProfile.tsx          (PascalCase para componentes)
- user-profile.types.ts    (kebab-case para tipos)
- useUserData.ts          (camelCase para hooks)
- user-profile.utils.ts   (kebab-case para utilitários)

❌ Incorreto:
- userProfile.tsx
- UserProfile.types.ts
- user-data-hook.ts
```

### 🎯 Imports

```tsx
// ✅ Ordem correta de imports
// 1. React e libs externas
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Button } from '@/components/ui/button';

// 2. Imports internos
import { UserCard } from '@/components/users';
import { useUserData } from '@/hooks/useUserData';
import { formatDate } from '@/lib/utils';

// 3. Imports relativos
import './styles.css';
```

### 🔧 Configurações ESLint

O projeto já tem regras configuradas para:

- **Import order**: Ordem automática de imports
- **Unused variables**: Detecta variáveis não utilizadas
- **Console logs**: Avisa sobre console.log em produção
- **Type safety**: Regras específicas para TypeScript

## 🧪 Testes

### 🏗️ Estrutura de Testes (Preparada para futuro)

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── Button.stories.tsx
├── hooks/
│   └── useUserData/
│       ├── useUserData.ts
│       └── useUserData.test.ts
└── __tests__/
    ├── setup.ts
    └── utils.tsx
```

### 🧪 Exemplo de Teste de Componente

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
```

### 🎭 Exemplo de Teste de Hook

```tsx
// useUserData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUserData } from './useUserData';

describe('useUserData', () => {
  it('fetches user data successfully', async () => {
    const { result } = renderHook(() => useUserData('123'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

## 📊 Performance

### ⚡ Otimizações Implementadas

1. **Bundle Splitting**: Automático com Next.js
2. **Image Optimization**: Next.js Image component
3. **Font Optimization**: Next.js Font optimization
4. **Code Splitting**: React.lazy + Suspense quando necessário

### 📈 Monitoramento

```bash
# Análise de bundle
npm run build:analyze

# Lighthouse (adicionar no futuro)
npm run lighthouse

# Build size
npm run build
```

### 🎯 Métricas Importantes

- **First Load JS**: < 200 kB (atualmente: ~184 kB)
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

### ⚡ Dicas de Performance

```tsx
// ✅ Use memo para componentes pesados
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => expensiveCalculation(data), [data]);

  return <div>{processedData}</div>;
});

// ✅ Lazy loading para rotas
const LazyPage = lazy(() => import('./LazyPage'));

// ✅ Dynamic imports para libs pesadas
const heavyLibrary = dynamic(() => import('heavy-library'), {
  loading: () => <p>Loading...</p>,
});
```

## 🔧 Troubleshooting

### ❌ Problemas Comuns

#### 1. **Build falha com erro de tipos**

```bash
# Solução
npm run type-check
# Corrija os erros mostrados
npm run build
```

#### 2. **ESLint/Prettier conflitos**

```bash
# Solução
npm run format
npm run lint:fix
```

#### 3. **Git hooks não funcionam**

```bash
# Solução
npx husky init
chmod +x .husky/pre-commit
```

#### 4. **Componente não aparece**

```tsx
// Verifique:
// 1. Export/import corretos
export default MeuComponente; // no arquivo
import MeuComponente from '@/components/MeuComponente'; // no uso

// 2. CSS classes aplicadas
<div className="block"> // não "hidden"

// 3. Conditional rendering
{condition && <Component />} // condition é true?
```

#### 5. **Styles não aplicam**

```tsx
// Verifique ordem das classes Tailwind
className={cn(
  'base-classes',
  'hover:override-classes', // Específico depois do geral
  className // Props sempre por último
)}
```

### 🐛 Debug Úteis

```tsx
// Debug de props
console.log('Props:', { variant, size, className });

// Debug de computed values
const computedClasses = cn('base', { active: isActive });
console.log('Classes:', computedClasses);

// Debug de estado
useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

### 📞 Onde Buscar Ajuda

1. **Documentação do projeto**: Arquivos README.md
2. **Next.js Docs**: https://nextjs.org/docs
3. **shadcn/ui**: https://ui.shadcn.com/
4. **Tailwind CSS**: https://tailwindcss.com/docs
5. **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🎯 Checklist do Desenvolvedor

### ✅ Antes de cada commit:

- [ ] `npm run check-all` passa sem erros
- [ ] Componentes têm `displayName`
- [ ] Props têm tipagem correta
- [ ] Imports seguem a ordem correta
- [ ] Classes Tailwind estão organizadas

### ✅ Antes de cada PR:

- [ ] Build de produção funciona
- [ ] Documentação atualizada se necessário
- [ ] Componentes têm exemplos de uso
- [ ] Performance verificada (bundle size)

### ✅ Ao criar novos componentes:

- [ ] Seguir estrutura padrão
- [ ] Adicionar ao index.ts da categoria
- [ ] Documentar no README.md da categoria
- [ ] Adicionar variantes se necessário
- [ ] Testar responsividade

---

**💡 Lembre-se**: A consistência é mais importante que a perfeição. Siga os padrões estabelecidos!
