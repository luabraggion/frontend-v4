# AlertDialog Components

## AlertDialogWrapper

Componente base para criação de diálogos de alerta reutilizáveis com diferentes estilos e funcionalidades.

### Características

- Interface TypeScript completa
- Estados de loading
- Callbacks configuráveis
- Múltiplas variantes predefinidas
- Totalmente acessível
- Design consistente com shadcn/ui

### Uso Básico

```tsx
import { AlertDialogWrapper } from '@/components/feedback';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialogWrapper
      trigger={<Button>Abrir Dialog</Button>}
      title="Confirmar Ação"
      description="Tem certeza que deseja continuar?"
      onAction={() => console.log('Confirmado!')}
      onCancel={() => setIsOpen(false)}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
```

### Props

| Propriedade     | Tipo                                                                          | Obrigatório | Descrição                                            |
| --------------- | ----------------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `trigger`       | `ReactNode`                                                                   | ✓           | Elemento que abre o dialog                           |
| `title`         | `ReactNode`                                                                   | ✓           | Título do dialog                                     |
| `description`   | `ReactNode`                                                                   | -           | Descrição do dialog                                  |
| `onAction`      | `() => void \| Promise<void>`                                                 | -           | Callback de ação principal                           |
| `onCancel`      | `() => void`                                                                  | -           | Callback de cancelamento                             |
| `actionText`    | `string`                                                                      | -           | Texto do botão de ação (padrão: "Confirmar")         |
| `cancelText`    | `string`                                                                      | -           | Texto do botão cancelar (padrão: "Cancelar")         |
| `actionVariant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | -           | Variante visual do botão de ação (padrão: "default") |
| `open`          | `boolean`                                                                     | -           | Estado de abertura do dialog                         |
| `onOpenChange`  | `(open: boolean) => void`                                                     | -           | Callback para mudança de estado                      |
| `showCancel`    | `boolean`                                                                     | -           | Se deve mostrar botão cancelar (padrão: true)        |
| `showAction`    | `boolean`                                                                     | -           | Se deve mostrar botão de ação (padrão: true)         |
| `isLoading`     | `boolean`                                                                     | -           | Estado de carregamento                               |
| `customFooter`  | `ReactNode`                                                                   | -           | Footer customizado                                   |
| `className`     | `string`                                                                      | -           | Classes CSS adicionais                               |

## Componentes Predefinidos

### ConfirmDialog

Dialog de confirmação padrão com botões de confirmar/cancelar.

```tsx
import { ConfirmDialog } from '@/components/feedback';

<ConfirmDialog
  trigger={<Button>Salvar Alterações</Button>}
  title="Salvar Alterações"
  description="Deseja salvar as alterações feitas?"
  onAction={handleSave}
  onCancel={() => setShowConfirm(false)}
  open={showConfirm}
  onOpenChange={setShowConfirm}
/>;
```

### DestructiveDialog

Dialog para ações destrutivas (exclusões, etc.) com estilo de alerta.

```tsx
import { DestructiveDialog } from '@/components/feedback';

<DestructiveDialog
  trigger={<Button variant="destructive">Excluir Item</Button>}
  title="Excluir Item"
  description="Esta ação não pode ser desfeita."
  onAction={handleDelete}
  onCancel={() => setShowDelete(false)}
  actionText="Excluir"
  open={showDelete}
  onOpenChange={setShowDelete}
/>;
```

### InfoDialog

Dialog informativo apenas com botão de fechar.

```tsx
import { InfoDialog } from '@/components/feedback';

<InfoDialog
  trigger={<Button variant="outline">Mostrar Info</Button>}
  title="Informação"
  description="Operação realizada com sucesso!"
  open={showInfo}
  onOpenChange={setShowInfo}
/>;
```

## Exemplos Avançados

### Com Estado de Loading

```tsx
const [isLoading, setIsLoading] = useState(false);

<AlertDialogWrapper
  trigger={<Button>Processar</Button>}
  title="Processando"
  description="Aguarde enquanto processamos sua solicitação..."
  isLoading={isLoading}
  open={isOpen}
  onOpenChange={setIsOpen}
  onAction={async () => {
    setIsLoading(true);
    await performAction();
    setIsLoading(false);
    setIsOpen(false);
  }}
/>;
```

### Com Footer Customizado

```tsx
<AlertDialogWrapper
  trigger={<Button>Escolher Opção</Button>}
  title="Escolha uma Opção"
  description="Selecione como deseja proceder:"
  open={isOpen}
  onOpenChange={setIsOpen}
  customFooter={
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleOption1}>
        Opção 1
      </Button>
      <Button variant="outline" onClick={handleOption2}>
        Opção 2
      </Button>
      <Button onClick={handleOption3}>Opção 3</Button>
    </div>
  }
/>
```

## Acessibilidade

- Suporte completo a navegação por teclado
- Foco automático nos elementos interativos
- ARIA labels e roles apropriados
- Escape para fechar
- Bloqueio de foco no dialog

## Boas Práticas

1. **Títulos Claros**: Use títulos descritivos que expliquem a ação
2. **Descrições Concisas**: Forneça contexto suficiente sem ser verboso
3. **Botões Apropriados**: Use variantes destrutivas para ações irreversíveis
4. **Estados de Loading**: Implemente feedback visual durante operações assíncronas
5. **Confirmações**: Sempre ofereça opções de cancelamento para ações importantes
