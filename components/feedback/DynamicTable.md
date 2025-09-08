# DynamicTable

Componente de tabela dinâmica e altamente reutilizável baseado no shadcn/ui com funcionalidades avançadas.

## Props

### `DynamicTableProps<T>`

- `data`: Array de dados para exibir na tabela (obrigatório)
- `columns`: Array de definições de colunas (obrigatório)
- `caption`: Texto/elemento de legenda da tabela (opcional)
- `footer`: Array de colunas do rodapé (opcional)
- `emptyMessage`: Mensagem/elemento quando não há dados (opcional)
- `className`: Classes CSS para a tabela (opcional)
- `rowClassName`: Classes CSS para as linhas ou função que retorna classes (opcional)
- `onRowClick`: Callback executado ao clicar em uma linha (opcional)
- `getRowKey`: Função para gerar chave única da linha (opcional, padrão: index)
- `highlightHoverRows`: Se deve destacar linhas clicáveis no hover (opcional, padrão: true)
- `tableProps`: Props adicionais passadas para o componente Table (opcional)

### `TableColumn<T>`

- `key`: Chave do campo nos dados (obrigatório)
- `header`: Texto/elemento do cabeçalho da coluna (obrigatório)
- `className`: Classes CSS aplicadas ao cabeçalho e células (opcional)
- `headerClassName`: Classes CSS apenas para o cabeçalho (opcional)
- `cellClassName`: Classes CSS apenas para as células (opcional)
- `render`: Função customizada de renderização (opcional)
- `width`: Largura da coluna em CSS (opcional)
- `sortable`: Se a coluna pode ser ordenada (opcional)
- `align`: Alinhamento do conteúdo: 'left' | 'center' | 'right' (opcional)

### `TableFooterColumn`

- `content`: Conteúdo da célula do rodapé (obrigatório)
- `colSpan`: Número de colunas que a célula ocupa (opcional)
- `className`: Classes CSS da célula (opcional)

## Exemplos de Uso

### 1. Tabela Básica

```tsx
import { DynamicTable, type TableColumn } from '@/components/feedback';

interface Invoice {
  id: string;
  status: string;
  amount: number;
  method: string;
}

const invoices: Invoice[] = [
  { id: 'INV001', status: 'Paid', amount: 250, method: 'Credit Card' },
  { id: 'INV002', status: 'Pending', amount: 150, method: 'PayPal' },
];

const columns: TableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', width: '100px' },
  { key: 'status', header: 'Status' },
  { key: 'method', header: 'Method' },
  {
    key: 'amount',
    header: 'Amount',
    className: 'text-right',
    render: (value) => `$${value.toFixed(2)}`,
  },
];

<DynamicTable
  data={invoices}
  columns={columns}
  caption="Lista de faturas recentes"
/>;
```

### 2. Tabela com Rodapé

```tsx
const footer = [
  { content: 'Total', colSpan: 3 },
  { content: '$400.00', className: 'text-right font-bold' },
];

<DynamicTable data={invoices} columns={columns} footer={footer} />;
```

### 3. Tabela com Interação

```tsx
const handleRowClick = (invoice: Invoice, index: number) => {
  console.log('Clicked on:', invoice.id);
};

<DynamicTable
  data={invoices}
  columns={columns}
  onRowClick={handleRowClick}
  rowClassName="hover:bg-gray-50"
/>;
```

### 4. Alinhamento e Formatação Avançada

```tsx
const columns: TableColumn<Invoice>[] = [
  {
    key: 'id',
    header: 'Invoice',
    width: '120px',
    align: 'left',
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (value, row) => (
      <Badge variant={value === 'Paid' ? 'success' : 'warning'}>{value}</Badge>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    cellClassName: 'font-mono',
    render: (value) => (
      <span className="font-semibold">
        {(value as number).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    ),
  },
];
```

### 5. Chaves Customizadas e Performance

```tsx
<DynamicTable
  data={invoices}
  columns={columns}
  getRowKey={(invoice) => invoice.id} // Usa ID ao invés de index
  highlightHoverRows={false} // Desabilita highlight no hover
/>
```

### 6. Estado Vazio Customizado

```tsx
<DynamicTable
  data={[]}
  columns={columns}
  emptyMessage={
    <div className="flex flex-col items-center gap-2">
      <div className="text-2xl">📄</div>
      <p>Nenhuma fatura encontrada</p>
      <Button variant="outline" size="sm">
        Criar Nova Fatura
      </Button>
    </div>
  }
/>
```

## Funcionalidades

- ✅ **Tipagem TypeScript forte** com generics
- ✅ **Renderização customizada** por coluna
- ✅ **Alinhamento configurável** (left, center, right)
- ✅ **Classes CSS granulares** (header/cell específicas)
- ✅ **Larguras de coluna** configuráveis
- ✅ **Rodapé dinâmico** com colspan
- ✅ **Estados vazios** personalizáveis com ReactNode
- ✅ **Clique em linhas** com callback
- ✅ **Chaves customizadas** para performance
- ✅ **Hover highlights** configuráveis
- ✅ **Tratamento inteligente** de tipos de dados
- ✅ **Formatação automática** (números, booleanos, null/undefined)
- ✅ **Transições suaves** no hover
- ✅ **Props passthrough** para Table
- ✅ **Acessibilidade** com marcação semântica
- ✅ **Responsivo** baseado no shadcn/ui
- ✅ **Altamente reutilizável** para qualquer tipo de dados

## Casos de Uso

- Listas de dados administrativos
- Relatórios e dashboards
- Tabelas de produtos/serviços
- Histórico de transações
- Listagens com ações customizadas
