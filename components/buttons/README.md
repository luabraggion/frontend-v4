# Buttons Components

Componentes de botões especializados, construídos sobre o Button base do shadcn/ui com funcionalidades adicionais para diferentes casos de uso.

## ⚠️ Importante: Safe para Updates do shadcn/ui

Os componentes desta pasta são **wrappers customizados** que estendem os componentes base do shadcn/ui sem modificá-los. Isso garante que updates do shadcn não quebrem nossas customizações.

## Componentes Disponíveis

### Button (Customizado)

Button estendido que adiciona suporte à variante `warning` (amarela) mantendo compatibilidade total com shadcn/ui.

**Características:**

- ✅ Todas as variantes do shadcn/ui: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- ✅ **Nova variante:** `warning` (amarela)
- ✅ Compatibilidade total com shadcn/ui
- ✅ Safe para updates do shadcn

```tsx
import { Button } from '@/components/buttons';

// Variantes padrão (usa shadcn/ui internamente)
<Button variant="default">Botão Padrão</Button>
<Button variant="destructive">Botão Destrutivo</Button>

// Nova variante warning
<Button variant="warning">Atenção!</Button>
```

### ButtonWithIcon

Botão com ícone integrado, suportando diferentes posições e variações visuais.

### ButtonIcon

Botão apenas com ícone, ideal para barras de ferramentas e ações secundárias.

```tsx
import { ButtonWithIcon, ButtonIcon } from '@/components/buttons';
import { PlusIcon, SaveIcon, TrashIcon, EditIcon, SearchIcon } from 'lucide-react';

// ButtonWithIcon - Botão com ícone à esquerda (padrão)
<ButtonWithIcon icon={<PlusIcon />}>
  Adicionar item
</ButtonWithIcon>

// ButtonWithIcon - Botão com ícone à direita
<ButtonWithIcon icon={<SaveIcon />} iconPosition="right">
  Salvar alterações
</ButtonWithIcon>

// Apenas ícone (sem texto)
<ButtonWithIcon icon={<TrashIcon />} />

// Diferentes variantes
<ButtonWithIcon icon={<PlusIcon />} variant="outline">
  Botão outline
</ButtonWithIcon>

<ButtonWithIcon icon={<SaveIcon />} variant="destructive">
  Excluir
</ButtonWithIcon>

// ButtonIcon - Apenas ícone básico
<ButtonIcon icon={<EditIcon />} />

// ButtonIcon - Com variante e tamanho customizado
<ButtonIcon
  icon={<SearchIcon />}
  variant="outline"
  size="lg"
  ariaLabel="Pesquisar"
/>

// ButtonIcon - Para toolbar pequena
<ButtonIcon
  icon={<TrashIcon />}
  variant="ghost"
  size="sm"
  ariaLabel="Excluir item"
/>
```

## Documentação Detalhada

### ButtonIcon

Componente para botões apenas com ícone, ideal para barras de ferramentas e ações que não precisam de texto.

#### Props

| Prop        | Tipo                   | Padrão        | Descrição                    |
| ----------- | ---------------------- | ------------- | ---------------------------- |
| `icon`      | `React.ReactNode`      | **required**  | Ícone a ser exibido          |
| `variant`   | `ButtonVariant`        | `"secondary"` | Variante do botão            |
| `size`      | `ButtonSize`           | `"icon"`      | Tamanho do botão             |
| `className` | `string`               | `undefined`   | Classes CSS adicionais       |
| `disabled`  | `boolean`              | `false`       | Se o botão está desabilitado |
| `ariaLabel` | `string`               | `undefined`   | Texto para acessibilidade    |
| `...props`  | `ButtonHTMLAttributes` | -             | Props HTML nativas do button |

#### Exemplos de Uso

```tsx
// Botão básico para ação secundária
<ButtonIcon icon={<EditIcon />} ariaLabel="Editar" />

// Botão de confirmação
<ButtonIcon
  icon={<CheckIcon />}
  variant="default"
  ariaLabel="Confirmar"
  onClick={handleConfirm}
/>

// Botão destructivo
<ButtonIcon
  icon={<TrashIcon />}
  variant="destructive"
  ariaLabel="Excluir"
  onClick={handleDelete}
/>

// Toolbar de ações
<div className="flex gap-1">
  <ButtonIcon icon={<CopyIcon />} variant="ghost" ariaLabel="Copiar" />
  <ButtonIcon icon={<EditIcon />} variant="ghost" ariaLabel="Editar" />
  <ButtonIcon icon={<TrashIcon />} variant="ghost" ariaLabel="Excluir" />
</div>
```

## Filosofia de Design

### Consistência Visual

- Baseado no Button do shadcn/ui para manter consistência
- Espaçamentos padronizados entre ícone e texto
- Tamanhos de ícone otimizados para cada variante de botão

### Acessibilidade

- Suporte completo a navegação por teclado
- Estados de foco claramente visíveis
- Labels adequados para screen readers
- Área de toque adequada para dispositivos móveis

### Flexibilidade

- Suporte a todos os variants do Button base
- Posicionamento flexível do ícone
- Compatível com todos os ícones do lucide-react
- Props customizáveis para casos específicos

## Padrões de Uso

### Ações Primárias

```tsx
// Salvar/Confirmar
<ButtonWithIcon icon={<CheckIcon />} variant="default">
  Confirmar
</ButtonWithIcon>

// Adicionar/Criar
<ButtonWithIcon icon={<PlusIcon />} variant="default">
  Criar novo
</ButtonWithIcon>
```

### Ações Secundárias

```tsx
// Editar
<ButtonWithIcon icon={<EditIcon />} variant="outline">
  Editar
</ButtonWithIcon>

// Download
<ButtonWithIcon icon={<DownloadIcon />} variant="outline">
  Baixar arquivo
</ButtonWithIcon>
```

### Ações Destrutivas

```tsx
// Excluir
<ButtonWithIcon icon={<TrashIcon />} variant="destructive">
  Excluir item
</ButtonWithIcon>

// Cancelar
<ButtonWithIcon icon={<XIcon />} variant="destructive">
  Cancelar operação
</ButtonWithIcon>
```

### Botões Apenas com Ícone

Para botões que precisam apenas de ícone, use o `ButtonIcon` que é otimizado para este caso:

```tsx
// Recomendado: ButtonIcon para barras de ferramentas
<div className="flex gap-2">
  <ButtonIcon icon={<EditIcon />} variant="ghost" size="sm" ariaLabel="Editar" />
  <ButtonIcon icon={<CopyIcon />} variant="ghost" size="sm" ariaLabel="Copiar" />
  <ButtonIcon icon={<TrashIcon />} variant="ghost" size="sm" ariaLabel="Excluir" />
</div>

// Alternativa: ButtonWithIcon sem texto (menos recomendado)
<div className="flex gap-2">
  <ButtonWithIcon icon={<EditIcon />} variant="ghost" size="sm" title="Editar" />
  <ButtonWithIcon icon={<CopyIcon />} variant="ghost" size="sm" title="Copiar" />
  <ButtonWithIcon icon={<TrashIcon />} variant="ghost" size="sm" title="Excluir" />
</div>
```

> **💡 Dica:** Use `ButtonIcon` quando precisar apenas de ícone, e `ButtonWithIcon` quando precisar de ícone + texto.

## Customização

### Tamanhos Personalizados

```tsx
// Botão pequeno
<ButtonWithIcon icon={<PlusIcon />} size="sm">
  Adicionar
</ButtonWithIcon>

// Botão grande
<ButtonWithIcon icon={<SaveIcon />} size="lg">
  Salvar documento
</ButtonWithIcon>
```

### Estados Especiais

```tsx
// Carregando
<ButtonWithIcon
  icon={<LoaderIcon className="animate-spin" />}
  disabled
>
  Salvando...
</ButtonWithIcon>

// Desabilitado
<ButtonWithIcon
  icon={<PlusIcon />}
  disabled
>
  Não disponível
</ButtonWithIcon>
```

## Extensibilidade

Para criar novos tipos de botões especializados:

1. Estenda o `ButtonWithIcon`, `ButtonIcon` ou o `Button` base
2. Mantenha a mesma interface de props quando possível
3. Adicione funcionalidades específicas para o caso de uso
4. Inclua no barrel export `index.ts`
5. Documente os novos comportamentos

```tsx
// Exemplo: Botão especializado com texto
export function SaveButton({ isSaving, onSave, children, ...props }) {
  return (
    <ButtonWithIcon
      icon={isSaving ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
      disabled={isSaving}
      onClick={onSave}
      {...props}
    >
      {isSaving ? 'Salvando...' : children || 'Salvar'}
    </ButtonWithIcon>
  );
}

// Exemplo: Botão especializado apenas com ícone
export function RefreshButton({ isRefreshing, onRefresh, ...props }) {
  return (
    <ButtonIcon
      icon={isRefreshing ? <LoaderIcon className="animate-spin" /> : <RefreshIcon />}
      disabled={isRefreshing}
      onClick={onRefresh}
      ariaLabel={isRefreshing ? 'Atualizando...' : 'Atualizar'}
      {...props}
    />
  );
}
      icon={isSaving ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
      disabled={isSaving}
      onClick={onSave}
      {...props}
    >
      {isSaving ? 'Salvando...' : children || 'Salvar'}
    </ButtonWithIcon>
  );
}
```

## Diretrizes de UX

### Escolha do Ícone

- Use ícones universalmente reconhecidos
- Mantenha consistência em toda a aplicação
- Prefira ícones do lucide-react para uniformidade

### Posicionamento

- **Ícone à esquerda**: Padrão para a maioria dos casos
- **Ícone à direita**: Para ações que implicam "próximo passo" (ex: "Continuar →")
- **Apenas ícone**: Para barras de ferramentas e ações secundárias

### Texto do Botão

- Use verbos de ação claros
- Seja específico sobre o que acontecerá
- Mantenha textos concisos mas descritivos

## Guia de Uso: Quando Usar Cada Componente

### 🎯 ButtonWithIcon

**Quando usar:**

- Botões principais que precisam de ícone + texto
- Call-to-actions importantes
- Formulários e modais
- Quando o texto ajuda na compreensão da ação

**Exemplos:**

```tsx
<ButtonWithIcon icon={<SaveIcon />}>Salvar alterações</ButtonWithIcon>
<ButtonWithIcon icon={<PlusIcon />}>Adicionar item</ButtonWithIcon>
<ButtonWithIcon icon={<DownloadIcon />}>Baixar arquivo</ButtonWithIcon>
```

### 🔘 ButtonIcon

**Quando usar:**

- Barras de ferramentas compactas
- Ações secundárias em cards/listas
- Interfaces com espaço limitado
- Quando o ícone é autoexplicativo

**Exemplos:**

```tsx
<ButtonIcon icon={<EditIcon />} ariaLabel="Editar" />
<ButtonIcon icon={<DeleteIcon />} ariaLabel="Excluir" />
<ButtonIcon icon={<MoreIcon />} ariaLabel="Mais opções" />
```

### 📋 Regra Geral

- **Com texto importante**: Use `ButtonWithIcon`
- **Apenas ícone**: Use `ButtonIcon`
- **Sempre**: Inclua `ariaLabel` em botões apenas com ícone para acessibilidade
