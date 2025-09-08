# BreadcrumbNavigation

Componente de navegação em migalhas de pão (breadcrumb) baseado no shadcn/ui.

## Props

- `items`: Array de objetos representando os itens do breadcrumb (obrigatório)
  - `label`: Texto a ser exibido (obrigatório)
  - `href`: Link de navegação (opcional)
  - `isCurrent`: Marca se é a página atual (opcional, padrão: false)

## Exemplo de Uso

```tsx
import { BreadcrumbNavigation } from '@/components/navigation';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Campanhas', href: '/campanhas' },
  { label: 'Nova Campanha', isCurrent: true },
];

<BreadcrumbNavigation items={breadcrumbItems} />;
```

## Funcionalidades

- ✅ Navegação hierárquica clara
- ✅ Link automático para itens não-atuais
- ✅ Página atual sem link (apenas texto)
- ✅ Separadores automáticos entre itens
- ✅ Acessível com marcação semântica
- ✅ Responsivo e estilizado
- ✅ Baseado no shadcn/ui breadcrumb

## Estrutura dos Items

```typescript
interface BreadcrumbItem {
  label: string; // Texto exibido
  href?: string; // Link (opcional)
  isCurrent?: boolean; // É página atual? (opcional)
}
```

## Casos de Uso

- Navegação em formulários multi-etapa
- Hierarquia de páginas
- Localização do usuário na aplicação
- Breadcrumbs de categoria/subcategoria
