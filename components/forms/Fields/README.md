# Form Fields

Campos de entrada de dados especializados, construídos sobre os componentes base do shadcn/ui com funcionalidades adicionais para melhor experiência do usuário.

## Componentes Disponíveis

### Input

Campo de texto genérico com suporte a vários tipos e estados visuais.

```tsx
import { Input } from '@/components/forms/Fields';

// Uso básico
<Input placeholder="Digite aqui..." />

// Com validação
<Input
  type="email"
  placeholder="seu@email.com"
  error="E-mail inválido"
/>

// Com ícone
<Input
  placeholder="Buscar..."
  icon={<SearchIcon />}
/>
```

### Combobox

Campo de seleção com busca, baseado no Combobox do shadcn/ui.

```tsx
import { Combobox } from '@/components/forms/Fields';

const options = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' },
];

<Combobox
  options={options}
  placeholder="Selecione um estado..."
  searchPlaceholder="Buscar estado..."
  emptyMessage="Nenhum estado encontrado"
  onValueChange={(value) => console.log(value)}
/>;
```

### DatePicker

Seletor de data com calendário em português brasileiro e máscara automática.

```tsx
import { DatePicker } from '@/components/forms/Fields';

// Data de nascimento
<DatePicker
  label="Data de nascimento"
  fromYear={1950}
  toYear={2010}
  onDateChange={(date, formattedValue) => {
    console.log(date); // Date object
    console.log(formattedValue); // "DD/MM/YYYY"
  }}
/>

// Data de evento futuro
<DatePicker
  label="Data do evento"
  fromDate={new Date()}
  toYear={new Date().getFullYear() + 5}
/>
```

## Padrões de Design

### Estados Visuais

- **Default**: Estado normal de entrada
- **Focus**: Destaque visual quando focado
- **Error**: Borda vermelha com mensagem de erro
- **Disabled**: Estado inativo com opacidade reduzida

### Acessibilidade

- Labels associados via `htmlFor` e `id`
- Suporte completo a navegação por teclado
- ARIA labels quando necessário
- Mensagens de erro anunciadas por screen readers

### Responsividade

- Adaptação automática para mobile
- Touch targets adequados (min 44px)
- Texto legível em todas as resoluções

## Extensibilidade

Para criar novos campos:

1. Estenda os componentes base do shadcn/ui
2. Mantenha a mesma interface de props básicas
3. Adicione funcionalidades específicas quando necessário
4. Inclua no barrel export `index.ts`
5. Documente os novos props e casos de uso

```tsx
// Exemplo de novo campo
export function CustomField({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Input {...props} />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
```
