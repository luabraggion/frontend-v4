// Este arquivo centraliza e reexporta todos os componentes de feedback do sistema,
// como tooltips, badges, alerts, dialogs e tabelas dinâmicas, facilitando o import
// único e organizado em outras partes da aplicação.
export {
  TooltipError,
  TooltipInfo,
  TooltipSuccess,
  TooltipWarning,
  TooltipWrapper,
} from './TooltipWrapper';

export { Avatar, AvatarGroup } from './Avatar';

export { Badge, CounterBadge, NotificationBadge, StatusBadge } from './Badge';

export {
  Alert,
  BannerAlert,
  ErrorAlert,
  InfoAlert,
  InlineAlert,
  SuccessAlert,
  WarningAlert,
} from './Alert';

export { DynamicTable } from './DynamicTable';
export type { DynamicTableProps, TableColumn, TableFooterColumn } from './DynamicTable';

export {
  AlertDialogWrapper,
  ConfirmDialog,
  DestructiveDialog,
  InfoDialog,
} from './AlertDialogWrapper';
export type { AlertDialogWrapperProps } from './AlertDialogWrapper';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

// Roleta performática
export { Wheel } from './Wheel';
export type { WheelOption, WheelProps } from './Wheel';
