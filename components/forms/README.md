# Forms Components

Componentes relacionados a formulários, organizados por responsabilidade para facilitar o desenvolvimento de interfaces de entrada de dados consistentes e acessíveis.

## Estrutura

- **`Fields/`**: Campos de entrada de dados (Input, Combobox, DatePicker, etc)
- **`Labels/`**: Labels, títulos e elementos de descrição para formulários

## Imports

```tsx
// Campos de entrada
import { Input, Combobox, DatePicker } from '@/components/forms/Fields';

// Labels e títulos
import { Label } from '@/components/forms/Labels';
```

## Filosofia de Design

### Acessibilidade Primeiro

- Todos os componentes seguem as diretrizes WCAG
- Labels associados corretamente aos campos
- Suporte completo a navegação por teclado
- Estados visuais claros para foco e erro

### Consistência Visual

- Design system unificado baseado no shadcn/ui
- Espaçamentos e tipografia padronizados
- Estados de loading, erro e sucesso consistentes

### Experiência do Desenvolvedor

- Props intuitivas e bem documentadas
- TypeScript com tipos específicos
- Barrel exports para imports limpos
- Exemplos de uso incluídos

## Padrões de Uso

### Formulário Básico

```tsx
import { Input } from '@/components/forms/Fields';
import { Label } from '@/components/forms/Labels';

function MyForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome completo</Label>
        <Input id="nome" placeholder="Digite seu nome" />
      </div>
    </div>
  );
}
```

### Formulário com Validação

```tsx
import { Input, DatePicker } from '@/components/forms/Fields';
import { Label } from '@/components/forms/Labels';

function ContactForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="email" required>
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          error="Digite um e-mail válido"
        />
      </div>

      <div>
        <Label htmlFor="nascimento">Data de nascimento</Label>
        <DatePicker id="nascimento" fromYear={1950} toYear={2010} />
      </div>
    </form>
  );
}
```

## Contribuições

Ao adicionar novos componentes de formulário:

1. **Fields/**: Para qualquer campo de entrada de dados
2. **Labels/**: Para elementos de título, descrição ou legendas
3. Mantenha a consistência com os padrões existentes
4. Inclua props para acessibilidade (`aria-*`, `id`, etc)
5. Adicione ao barrel export do `index.ts`
6. Documente com exemplos de uso
