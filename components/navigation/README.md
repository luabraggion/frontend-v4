# Navigation Components

Componentes de navegação que ajudam os usuários a entender onde estão na aplicação e como navegar entre diferentes seções.

## Componentes Disponíveis

### BreadcrumbNavigation

Componente de navegação em trilha (breadcrumb) com suporte a data atual e customização completa.

```tsx
import { BreadcrumbNavigation } from '@/components/navigation';

// Breadcrumb básico
<BreadcrumbNavigation
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Usuários', href: '/dashboard/users' },
    { label: 'Perfil' } // Item atual (sem href)
  ]}
/>

// Com data atual
<BreadcrumbNavigation
  items={breadcrumbItems}
  showCurrentDate={true}
/>

// Com separador customizado
<BreadcrumbNavigation
  items={breadcrumbItems}
  separator=">"
/>
```

## Funcionalidades

### Acessibilidade

- Navegação por teclado completa
- ARIA labels adequados para screen readers
- Indicação clara do item atual vs navegáveis
- Estrutura semântica correta com `nav` e `ol`

### Responsividade

- Adaptação automática para telas pequenas
- Truncamento inteligente em dispositivos móveis
- Touch targets adequados para navegação touch

### Localização Brasileira

- Data atual em português brasileiro
- Formatação de data por extenso
- Integração com utilitários de data localizados

## Padrões de Uso

### Navegação Simples

```tsx
const breadcrumbItems = [
  { label: 'Início', href: '/' },
  { label: 'Produtos', href: '/produtos' },
  { label: 'Eletrônicos', href: '/produtos/eletronicos' },
  { label: 'Smartphone Galaxy S23' }, // Página atual
];

<BreadcrumbNavigation items={breadcrumbItems} />;
```

### Com Data para Relatórios

```tsx
// Ideal para páginas de relatórios ou dashboards
<BreadcrumbNavigation
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Relatórios', href: '/dashboard/relatorios' },
    { label: 'Vendas Mensais' },
  ]}
  showCurrentDate={true}
/>
// Resultado: Dashboard > Relatórios > Vendas Mensais | Quinta-feira, 6 de Janeiro de 2025
```

### Navegação Profunda

```tsx
// Para estruturas com muitos níveis
<BreadcrumbNavigation
  items={[
    { label: 'Admin', href: '/admin' },
    { label: 'Configurações', href: '/admin/config' },
    { label: 'Usuários', href: '/admin/config/users' },
    { label: 'Grupos', href: '/admin/config/users/groups' },
    { label: 'Administradores', href: '/admin/config/users/groups/admin' },
    { label: 'João Silva' },
  ]}
/>
```

## Customização

### Separadores Personalizados

```tsx
// Diferentes estilos de separadores
<BreadcrumbNavigation items={items} separator="/" />
<BreadcrumbNavigation items={items} separator="•" />
<BreadcrumbNavigation items={items} separator="→" />
```

### Styling Customizado

```tsx
// Com classes CSS customizadas
<BreadcrumbNavigation items={items} className="bg-gray-50 p-4 rounded-lg" />
```

### Estados Especiais

```tsx
// Breadcrumb para páginas de erro
<BreadcrumbNavigation
  items={[{ label: 'Início', href: '/' }, { label: 'Página não encontrada' }]}
  className="text-red-600"
/>
```

## Integração com Roteamento

### Next.js App Router

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation } from '@/components/navigation';

function DynamicBreadcrumb() {
  const pathname = usePathname();

  const generateBreadcrumbs = (path: string) => {
    const segments = path.split('/').filter(Boolean);

    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;

      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : href,
      };
    });
  };

  return <BreadcrumbNavigation items={generateBreadcrumbs(pathname)} />;
}
```

### Com Metadados de Página

```tsx
// Usando metadados para labels mais amigáveis
const pageMetadata = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'Usuários',
  '/dashboard/users/profile': 'Perfil do Usuário',
};

function SmartBreadcrumb({ pathname }: { pathname: string }) {
  const items = generateBreadcrumbsFromMetadata(pathname, pageMetadata);

  return <BreadcrumbNavigation items={items} showCurrentDate />;
}
```

## Extensibilidade

Para criar novos componentes de navegação:

1. Mantenha a acessibilidade como prioridade
2. Use estrutura semântica adequada (`nav`, `ol`, `li`)
3. Implemente navegação por teclado
4. Considere responsividade desde o início
5. Adicione ao barrel export `index.ts`

```tsx
// Exemplo de componente de navegação secundária
export function SecondaryNavigation({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Navegação secundária">
      <ul className="flex space-x-4">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href} className="text-blue-600 hover:text-blue-800">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## Boas Práticas

### Estrutura de Navegação

- Sempre comece com a página inicial ou dashboard
- Use labels descritivos e claros
- Mantenha hierarquia lógica
- Evite breadcrumbs muito longos (máximo 7 níveis)

### Acessibilidade

- Use `aria-label` adequados
- Implemente navegação por teclado
- Mantenha contraste adequado
- Teste com screen readers

### UX/UI

- Indique claramente o item atual
- Use separadores consistentes
- Considere truncamento em telas pequenas
- Posicione de forma consistente na interface
