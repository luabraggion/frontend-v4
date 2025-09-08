# Form Labels

Componentes de títulos, labels e elementos descritivos para formulários, garantindo acessibilidade e consistência visual em toda a aplicação.

## Componentes Disponíveis

### Label

Label principal para campos de formulário, baseado no componente Label do shadcn/ui com funcionalidades adicionais.

```tsx
import { Label } from '@/components/forms/Labels';

// Label básico
<Label htmlFor="campo-id">Nome do campo</Label>

// Label obrigatório
<Label htmlFor="email" required>
  E-mail
</Label>

// Label com descrição
<Label
  htmlFor="senha"
  description="Mínimo 8 caracteres com letras e números"
>
  Senha
</Label>
```

## Funcionalidades

### Acessibilidade

- Associação adequada com campos via `htmlFor`
- Indicadores visuais para campos obrigatórios
- Suporte a screen readers
- Contraste adequado para legibilidade

### Indicadores Visuais

- **Campos obrigatórios**: Asterisco (\*) vermelho
- **Campos opcionais**: Texto "(opcional)" em cor secundária
- **Descrições**: Texto menor com dicas para o usuário

### Responsividade

- Quebra de linha adequada em telas pequenas
- Tamanho de fonte legível em todas as resoluções
- Espaçamento otimizado para touch

## Padrões de Uso

### Formulário Simples

```tsx
<div className="space-y-4">
  <div>
    <Label htmlFor="nome" required>
      Nome completo
    </Label>
    <Input id="nome" />
  </div>

  <div>
    <Label htmlFor="telefone">Telefone</Label>
    <Input id="telefone" type="tel" />
  </div>
</div>
```

### Formulário com Descrições

```tsx
<div className="space-y-4">
  <div>
    <Label
      htmlFor="username"
      required
      description="Apenas letras, números e underscore"
    >
      Nome de usuário
    </Label>
    <Input id="username" />
  </div>

  <div>
    <Label htmlFor="bio" description="Máximo 160 caracteres">
      Biografia
    </Label>
    <Textarea id="bio" />
  </div>
</div>
```

### Agrupamento de Campos

```tsx
<fieldset className="space-y-4">
  <legend className="font-semibold">Informações pessoais</legend>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="nome" required>
        Nome
      </Label>
      <Input id="nome" />
    </div>
    <div>
      <Label htmlFor="sobrenome" required>
        Sobrenome
      </Label>
      <Input id="sobrenome" />
    </div>
  </div>
</fieldset>
```

## Customização

### Variações de Estilo

```tsx
// Label com cor personalizada
<Label className="text-blue-600">Campo especial</Label>

// Label com tamanho diferente
<Label className="text-lg font-bold">Título grande</Label>

// Label com ícone
<Label className="flex items-center gap-2">
  <InfoIcon size={16} />
  Campo com informação
</Label>
```

### Extensão de Funcionalidades

Para adicionar novas funcionalidades aos labels:

1. Estenda o componente base mantendo compatibilidade
2. Adicione props específicas quando necessário
3. Mantenha a acessibilidade como prioridade
4. Documente novos comportamentos

```tsx
// Exemplo de extensão
export function FieldGroup({ title, description, required, children }) {
  return (
    <fieldset className="space-y-2">
      <Label className="font-semibold" required={required}>
        {title}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </fieldset>
  );
}
```

## Boas Práticas

- Sempre associe labels aos campos correspondentes
- Use texto claro e descritivo
- Indique campos obrigatórios visualmente
- Forneça descrições úteis quando necessário
- Mantenha consistência visual em todo o formulário
- Teste com screen readers para garantir acessibilidade
