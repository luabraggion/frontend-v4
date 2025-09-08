# 📚 Documentação do Projeto - Sistema de Componentes

## 🎯 Visão Geral

Este projeto utiliza **Next.js 15.5.2** com **React 19**, **shadcn/ui v3.2.1**, **Tailwind CSS v4** e **TypeScript** para criar um sistema de componentes robusto e acessível em português brasileiro.

---

## 🏗️ Arquitetura dos Componentes

### 📋 Regra Fundamental - shadcn/ui

> **🚨 NUNCA MODIFICAR**: Componentes em `/src/components/ui/` são do shadcn e devem permanecer originais.
> **✅ USAR WRAPPERS**: Para customizações, criar wrappers em outras pastas.

### 📁 Estrutura Organizada

```
src/components/
├── ui/           # 🔒 shadcn/ui (NÃO MODIFICAR)
├── buttons/      # Botões customizados
├── forms/        # Formulários e campos
├── feedback/     # Alerts, badges, avatars
├── navigation/   # Navegação e breadcrumbs
├── layout/       # Headers e estruturas
└── index.ts      # Exports centralizados
```

---

## 🎨 Variante Warning (Amarela)

### 🔧 Implementação

Sistema de cores CSS customizadas para variante `warning` em botões:

```css
/* globals.css */
:root {
  --warning: 45 93% 47%; /* Amarelo vibrante */
  --warning-foreground: 26 83% 14%; /* Texto escuro */
}

.dark {
  --warning: 48 100% 67%; /* Amarelo claro no dark */
  --warning-foreground: 26 83% 14%; /* Texto consistente */
}
```

### 📖 Uso

```tsx
<Button variant="warning">Atenção</Button>
<Alert variant="warning">Aviso importante</Alert>
<Badge variant="warning">Pendente</Badge>
```

---

## 🧩 Componentes Principais

### 🔘 Botões

```tsx
// Botão básico com warning
<Button variant="warning">Salvar Rascunho</Button>

// Botão com ícone
<ButtonWithIcon icon={<SaveIcon />} variant="warning">
  Salvar
</ButtonWithIcon>

// Botão apenas ícone
<ButtonIcon icon={<EditIcon />} variant="secondary" />
```

### 📝 Formulários

```tsx
// Input avançado
<Input
  label="Email"
  type="email"
  required
  error="Email inválido"
  helpText="Usado para comunicações"
  prefixIcon={<MailIcon />}
/>

// Data picker brasileiro
<DatePicker
  label="Data de Nascimento"
  fromYear={1950}
  toYear={2010}
/>
```

### 🗺️ Navegação

```tsx
// Breadcrumb inteligente
<BreadcrumbNavigation
  items={[
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Produtos', href: '/produtos' },
    { label: 'Atual', isCurrent: true }
  ]}
  maxItems={3}
/>

// Header configurável
<Header
  title="Meu Sistema"
  rightContent={<UserMenu />}
  onLogoClick={() => router.push('/')}
/>
```

### 💬 Feedback

```tsx
// Alert contextual
<Alert variant="warning" title="Atenção!" dismissible>
  Dados não salvos serão perdidos.
</Alert>

// Badge de status
<StatusBadge>online</StatusBadge>
<NotificationBadge>5</NotificationBadge>

// Avatar com status
<Avatar
  src="/user.jpg"
  name="João Silva"
  status="online"
  showStatus
/>

// Dialog de confirmação
<AlertDialogWrapper
  trigger={<Button variant="warning">Ação Importante</Button>}
  title="⚠️ Confirmação Necessária"
  description="Esta ação requer sua atenção. Deseja prosseguir?"
  actionText="Sim, continuar"
  actionVariant="warning"
  onAction={() => console.log('Ação confirmada!')}
/>
```

### 🎨 Exemplos da Variante Warning

```tsx
// Botões com warning
<Button variant="warning">⚠️ Atenção</Button>
<Button variant="warning" size="sm">Pequeno</Button>
<Button variant="warning" disabled>Desabilitado</Button>

// Badges amarelos
<Badge variant="warning">Pendente</Badge>
<StatusBadge>pending</StatusBadge>

// Alert de aviso
<Alert variant="warning" title="Manutenção Programada">
  Sistema será atualizado hoje às 22h
</Alert>

// Componentes customizados
<div className={getVariantClasses('warning')}>
  Card com estilo warning completo
</div>

<div className={getVariantBackground('warning')}>
  <h3 className={getVariantText('warning')}>
    Apenas fundo e texto warning
  </h3>
</div>
```

---

## 📅 Utilitários de Data (Português BR)

### 🛠️ Funcionalidades Principais

```typescript
// Formatação brasileira
formatDate(new Date()); // "07/09/2025"
formatDateBR(new Date(), true); // "07/09/2025 14:30"
formatDateLong(new Date()); // "Sábado, 7 de Setembro de 2025"

// Cálculos úteis
getAge(new Date('1990-05-15')); // 35
getDaysDifference(start, end); // 10
isWeekend(new Date()); // true/false

// Tempo relativo
formatRelativeTime(pastDate); // "há 2 horas"
formatRelativeTime(futureDate); // "em 3 dias"

// Ranges e períodos
getDateRange(start, end); // [Date, Date, Date...]
getQuarter(new Date()); // 3
```

### 🗓️ Calendário Brasileiro

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  locale={ptBR}
  fromYear={2020}
  toYear={2030}
/>
```

---

## ♿ Acessibilidade

### ✅ Recursos Implementados

- **ARIA labels** em português
- **Navegação por teclado** funcional
- **Screen readers** suportados
- **Estados de foco** visuais
- **Contraste adequado** para daltonismo

### 📖 Exemplos

```tsx
// Input acessível
<Input
  label="Nome completo"
  required
  aria-describedby="name-help"
  helpText="Como deve aparecer no documento"
/>

// Botão acessível
<ButtonIcon
  icon={<DeleteIcon />}
  ariaLabel="Excluir item permanentemente"
  variant="destructive"
/>
```

---

## 🎭 Temas e Cores

### 🌙 Theme Provider

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  <App />
</ThemeProvider>
```

### 🎨 Cores Customizadas

- **Warning**: `hsl(45 93% 47%)` - Amarelo vibrante
- **Success**: Verde padrão do sistema
- **Error**: Vermelho padrão do sistema
- **Info**: Azul padrão do sistema

---

## 🚀 Performance

### ⚡ Otimizações Aplicadas

- **React.memo** em todos os componentes
- **useMemo** para cálculos custosos
- **useCallback** para funções estáveis
- **Lazy loading** de componentes pesados
- **Tree shaking** com exports específicos

### 📊 Métricas

- **Bundle size**: ~195kB total
- **Build time**: ~4-8 segundos
- **First Load JS**: 153kB compartilhado

---

## 🔧 Desenvolvimento

### 📦 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (porta 8000)
npm run build        # Build de produção
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript
```

### 🧪 Estrutura de Testes (Recomendado)

```bash
# Futuramente implementar
src/
├── __tests__/       # Testes unitários
├── __mocks__/       # Mocks para testes
└── components/
    └── Component/
        ├── Component.tsx
        ├── Component.test.tsx
        └── Component.stories.tsx
```

---

## ⚠️ Problemas Conhecidos

### ESLint Warning

```
⚠ The Next.js plugin was not detected in your ESLint configuration.
```

**Status**: Warning cosmético conhecido do Next.js 15 + ESLint v9  
**Impacto**: Zero - todas as regras funcionam normalmente  
**Ação**: Ignorar até correção upstream do Next.js

---

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de importação**: Verificar exports em `index.ts`
2. **Styles não aplicados**: Confirmar import do CSS global
3. **Data não formatada**: Usar utilitários de `date-utils.ts`
4. **Componente não funciona**: Verificar se é wrapper ou shadcn original

### 🔍 Debug

```typescript
// Verificar tema atual
import { useTheme } from 'next-themes';
const { theme } = useTheme();

// Verificar data
import { isValidDate } from '@/lib/date-utils';
console.log('Data válida:', isValidDate(myDate));
```

---

## 📈 Próximos Passos

### 🎯 Roadmap

1. **Testes unitários** com Jest + Testing Library
2. **Storybook** para documentação visual
3. **Performance monitoring** com métricas reais
4. **Acessibilidade** auditoria completa
5. **Internacionalização** para outros idiomas

### 🔄 Manutenção

- **Atualizar shadcn/ui** quando disponível
- **Monitorar breaking changes** do Next.js
- **Revisar acessibilidade** periodicamente
- **Otimizar performance** conforme crescimento

---

## 👥 Para o Time

### ✅ Boas Práticas

1. **Sempre usar wrappers** para customizar shadcn
2. **Seguir nomenclatura** em português brasileiro
3. **Documentar componentes** com JSDoc
4. **Testar acessibilidade** antes do commit
5. **Manter consistência** visual e funcional

### 🚫 Não Fazer

1. **Nunca modificar** `/components/ui/`
2. **Não usar any** sem justificativa
3. **Não quebrar** acessibilidade
4. **Não ignorar** warnings do TypeScript
5. **Não criar** componentes sem documentação

---

**📅 Última atualização**: Janeiro 2025  
**👨‍💻 Status**: Produção Ready  
**🔄 Próxima revisão**: Após feedback do time
