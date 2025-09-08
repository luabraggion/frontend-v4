# PaginatedTable

Componente que combina DynamicTable com paginação automática.

## Quando Usar

- ✅ **Datasets grandes** que precisam de paginação
- ✅ **Casos simples** onde você quer paginação padrão
- ✅ **Prototipagem rápida** sem configuração complexa

## Props

Herda todas as props de `DynamicTable`, exceto `data`, plus:

- `allData`: Todos os dados (não paginados) - obrigatório
- `itemsPerPage`: Itens por página (padrão: 10)
- `initialPage`: Página inicial (padrão: 1)
- `showPaginationInfo`: Mostrar informações "X de Y registros" (padrão: true)
- `containerClassName`: Classes CSS do container
- `paginationClassName`: Classes CSS da paginação
- `paginationPosition`: Posição da paginação: 'top' | 'bottom' | 'both' (padrão: 'bottom')
- `onPageChange`: Callback quando página muda

## Exemplos de Uso

### 1. Uso Básico

```tsx
import { PaginatedTable } from '@/components/feedback';

<PaginatedTable
  allData={invoices}
  columns={columns}
  itemsPerPage={5}
  caption="Lista de Faturas"
/>;
```

### 2. Paginação no Topo e Base

```tsx
<PaginatedTable
  allData={users}
  columns={userColumns}
  paginationPosition="both"
  showPaginationInfo={true}
/>
```

### 3. Com Callback de Mudança

```tsx
<PaginatedTable
  allData={products}
  columns={productColumns}
  onPageChange={(page, data) => {
    console.log(`Página ${page} com ${data.length} items`);
  }}
/>
```

## Arquitetura Recomendada

### ✅ **Composição Manual (Recomendado para casos complexos)**

```tsx
const [currentPage, setCurrentPage] = useState(1);
const paginatedData = usePagination(allData, currentPage, itemsPerPage);

<div>
  <div className="mb-4">
    <SearchFilters />
    <SortControls />
  </div>

  <DynamicTable data={paginatedData} columns={columns} />

  <div className="mt-4 flex justify-between">
    <ExportButton />
    <PaginationWrapper
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
</div>;
```

### ✅ **PaginatedTable (Recomendado para casos simples)**

```tsx
<PaginatedTable allData={data} columns={columns} itemsPerPage={10} />
```

## Vantagens vs DynamicTable + PaginationWrapper

### **PaginatedTable:**

- ✅ Setup mais rápido
- ✅ Menos código boilerplate
- ✅ Paginação automática
- ❌ Menos flexibilidade de layout
- ❌ Não suporta filtros/busca externa

### **Composição Manual:**

- ✅ Controle total do layout
- ✅ Integração com filtros/busca
- ✅ Layouts customizados
- ✅ Melhor para casos complexos
- ❌ Mais código inicial
