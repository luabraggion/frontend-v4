# Componentes de Feedback

Esta pasta contém componentes reutilizáveis para fornecer feedback visual ao usuário.

## Componentes Disponíveis

### TooltipWrapper

Componente de tooltip altamente otimizado e reutilizável.

**Características:**

- ✅ Memoizado para performance máxima
- ✅ Props tipadas com TypeScript
- ✅ Suporte a múltiplas posições e alinhamentos
- ✅ Delay configurável
- ✅ Desabilitação condicional
- ✅ Variações pré-configuradas (Info, Warning, Error, Success)

**Exemplo de uso:**

```tsx
import { TooltipWrapper, TooltipInfo } from "@/components/feedback"

// Uso básico
<TooltipWrapper content="Adicionar item">
  <Button>+</Button>
</TooltipWrapper>

// Com configurações avançadas
<TooltipWrapper
  content="Informação detalhada"
  side="right"
  delayDuration={500}
  sideOffset={8}
>
  <InfoIcon />
</TooltipWrapper>

// Variações pré-configuradas
<TooltipInfo content="Informação importante">
  <InfoIcon />
</TooltipInfo>
```

### Avatar

Componente de avatar altamente performático e customizável.

**Características:**

- ✅ Fallback inteligente com iniciais baseadas no nome
- ✅ Suporte a imagens com Next.js Image otimizado
- ✅ Indicadores de status (online, offline, away, busy)
- ✅ Múltiplos tamanhos e formatos (circle, square, rounded)
- ✅ Cores de fundo geradas automaticamente por nome
- ✅ Bordas e customizações avançadas
- ✅ Componente AvatarGroup para grupos de usuários

**Exemplo de uso:**

```tsx
import { Avatar, AvatarGroup } from "@/components/feedback"

// Avatar básico
<Avatar name="João Silva" size="md" />

// Avatar com imagem e status
<Avatar
  src="/user.jpg"
  name="Maria Santos"
  size="lg"
  status="online"
  showStatus
  bordered
/>

// Avatar com formato personalizado
<Avatar
  name="Admin User"
  shape="rounded"
  size="xl"
  borderColor="border-blue-500"
/>

// Grupo de avatars
<AvatarGroup
  avatars={[
    { name: "João", src: "/user1.jpg" },
    { name: "Maria", src: "/user2.jpg" },
    { name: "Pedro" }
  ]}
  max={3}
  size="sm"
/>
```

### Badge

Componente de badge versátil para feedback visual de status, contadores e categorização.

**Características:**

- ✅ Múltiplas variantes (success, warning, error, info, outline)
- ✅ Tamanhos configuráveis (sm, md, lg)
- ✅ Suporte a overlay para notificações
- ✅ Formatação automática de números (99+)
- ✅ Variações pré-configuradas (NotificationBadge, StatusBadge, CounterBadge)
- ✅ Animações e interatividade opcionais

**Exemplo de uso:**

```tsx
import { Badge, NotificationBadge, StatusBadge } from "@/components/feedback"

// Badge básico
<Badge variant="success">Ativo</Badge>

// Badge de notificação com overlay
<div className="relative">
  <Button>Mensagens</Button>
  <NotificationBadge>5</NotificationBadge>
</div>

// Badge de status com variante automática
<StatusBadge>online</StatusBadge>

// Badge clicável com contador
<Badge
  variant="destructive"
  clickable
  max={99}
  onClick={() => console.log('Clicked')}
>
  150
</Badge>
```

### Alert

Componente de alerta para feedback contextual e notificações importantes.

**Características:**

- ✅ Variantes semânticas (success, warning, error, info)
- ✅ Ícones automáticos baseados na variante
- ✅ Funcionalidade dismissible com callback
- ✅ Tamanhos flexíveis e responsivos
- ✅ Variações pré-configuradas (SuccessAlert, ErrorAlert, etc.)
- ✅ Suporte a conteúdo complexo e HTML

**Exemplo de uso:**

```tsx
import { Alert, SuccessAlert, ErrorAlert, BannerAlert } from "@/components/feedback"

// Alert básico com título
<Alert variant="info" title="Informação" dismissible>
  Esta é uma mensagem informativa importante.
</Alert>

// Alert de sucesso simplificado
<SuccessAlert title="Concluído!">
  Operação realizada com sucesso.
</SuccessAlert>

// Alert de erro sem ícone
<ErrorAlert showIcon={false} icon={<CustomIcon />}>
  <strong>Erro crítico:</strong> Falha na conexão.
</ErrorAlert>

// Alert tipo banner para topo da página
<BannerAlert variant="warning">
  Manutenção programada para hoje às 22h.
</BannerAlert>
```

## Estrutura

```
feedback/
├── TooltipWrapper.tsx     # Componente principal de tooltip
├── Avatar.tsx            # Componente de avatar performático
├── Badge.tsx             # Componente de badge versátil
├── Alert.tsx             # Componente de alerta contextual
├── DynamicTable.tsx      # Componente de tabela dinâmica
├── PaginatedTable.tsx    # Tabela com paginação integrada
├── AlertDialogWrapper.tsx # Componente de dialog de alerta
├── index.ts              # Barrel exports
├── AlertDialog.md        # Documentação detalhada do AlertDialog
└── README.md            # Esta documentação
```

### DynamicTable

Componente de tabela altamente reutilizável com TypeScript generics.

**Características:**

- ✅ TypeScript generics para type safety
- ✅ Configuração flexível de colunas
- ✅ Renderização personalizada de células
- ✅ Alinhamento configurável
- ✅ Estado de carregamento e vazio
- ✅ Footer customizável
- ✅ Performance otimizada

### PaginatedTable

Wrapper para DynamicTable com paginação integrada.

**Características:**

- ✅ Paginação automática client-side
- ✅ Configuração de itens por página
- ✅ Informações de paginação opcionais
- ✅ Posicionamento flexível dos controles

### AlertDialogWrapper

Componente de dialog de alerta reutilizável com múltiplas variantes.

**Características:**

- ✅ Interface TypeScript completa
- ✅ Estados de loading
- ✅ Callbacks configuráveis
- ✅ Variantes predefinidas (Confirm, Destructive, Info)
- ✅ Totalmente acessível
- ✅ Design consistente com shadcn/ui

Consulte `AlertDialog.md` para documentação detalhada.
