# PaginationWrapper

Componente de paginação reutilizável baseado no shadcn/ui com suporte ao Link do Next.js.

## Props

- `currentPage`: Página atual (obrigatório)
- `totalPages`: Total de páginas (obrigatório)
- `onPageChange`: Callback executado quando a página muda (opcional - usado apenas para navegação por estado)
- `baseUrl`: URL base para navegação por Link do Next.js (opcional)
- `showEllipsis`: Mostra reticências quando há muitas páginas (padrão: true)
- `maxVisiblePages`: Máximo de páginas visíveis (padrão: 5)
- `className`: Classes CSS adicionais

## Modos de Uso

### 1. Navegação por Estado (Client-side)

```tsx
import { PaginationWrapper } from '@/components/navigation';

const [currentPage, setCurrentPage] = useState(1);
const totalPages = 10;

<PaginationWrapper
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>;
```

### 2. Navegação por URL (Server-side com Next.js Link)

```tsx
import { PaginationWrapper } from '@/components/navigation';

const currentPage = Number(searchParams.get('page')) || 1;
const totalPages = 10;

<PaginationWrapper
  currentPage={currentPage}
  totalPages={totalPages}
  baseUrl="/campanhas"
/>;
```

## Funcionalidades

- ✅ Navegação anterior/próxima
- ✅ Clique direto nas páginas
- ✅ Reticências para muitas páginas
- ✅ Estados desabilitados nos extremos
- ✅ Página ativa destacada
- ✅ **Suporte ao Next.js Link para SSR**
- ✅ **Navegação por estado ou URL**
- ✅ Responsivo e acessível
- ✅ Oculta automaticamente se há apenas 1 página
