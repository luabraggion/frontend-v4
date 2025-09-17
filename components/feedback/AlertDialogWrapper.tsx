import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/ui';
import { ReactNode } from 'react';

export interface AlertDialogWrapperProps {
  /** Elemento que vai disparar o dialog (botão, link, etc.) */
  trigger: ReactNode;
  /** Título do dialog */
  title: ReactNode;
  /** Ícone opcional para exibir acima do título */
  icon?: ReactNode;
  /** Descrição/conteúdo do dialog */
  description?: ReactNode;
  /** Texto do botão de cancelar */
  cancelText?: string;
  /** Texto do botão de ação */
  actionText?: string;
  /** Variante do botão de ação */
  actionVariant?:
    | 'default'
    | 'destructive'
    | 'warning'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** Callback executado ao clicar no botão de ação */
  onAction?: () => void | Promise<void>;
  /** Callback executado ao cancelar */
  onCancel?: () => void;
  /** Se o dialog está aberto (para controle externo) */
  open?: boolean;
  /** Callback para mudança de estado do dialog */
  onOpenChange?: (open: boolean) => void;
  /** Se deve mostrar o botão de cancelar */
  showCancel?: boolean;
  /** Se deve mostrar o botão de ação */
  showAction?: boolean;
  /** Classes CSS para o conteúdo */
  className?: string;
  /** Conteúdo customizado do footer (sobrescreve botões padrão) */
  customFooter?: ReactNode;
  /** Se o botão de ação está carregando */
  isLoading?: boolean;
}

export const AlertDialogWrapper = ({
  trigger,
  title,
  icon,
  description,
  cancelText = 'Cancelar',
  actionText = 'Confirmar',
  actionVariant = 'default',
  onAction,
  onCancel,
  open,
  onOpenChange,
  showCancel = true,
  showAction = true,
  className,
  customFooter,
  isLoading = false,
}: AlertDialogWrapperProps) => {
  const handleAction = async () => {
    if (onAction) {
      await onAction();
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={cn('text-center', className)}>
        <AlertDialogHeader className="flex flex-col items-center justify-center">
          {icon && <div className="mb-2 flex justify-center w-full text-4xl">{icon}</div>}
          <AlertDialogTitle className="w-full flex justify-center items-center text-center">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="w-full flex justify-center items-center text-center mt-1">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          {customFooter ? (
            customFooter
          ) : (
            <>
              {showCancel && (
                <AlertDialogCancel
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="focus-within:outline-none"
                >
                  {cancelText}
                </AlertDialogCancel>
              )}
              {showAction && (
                <AlertDialogAction
                  onClick={handleAction}
                  className={cn(
                    actionVariant === 'warning'
                      ? 'bg-warning text-white shadow-xs hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40'
                      : buttonVariants({
                          variant: actionVariant as
                            | 'default'
                            | 'destructive'
                            | 'outline'
                            | 'secondary'
                            | 'ghost'
                            | 'link',
                        }),
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? 'Carregando...' : actionText}
                </AlertDialogAction>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Componentes predefinidos para casos comuns
export const ConfirmDialog = (props: Omit<AlertDialogWrapperProps, 'actionVariant'>) => (
  <AlertDialogWrapper {...props} actionVariant="default" />
);

export const DestructiveDialog = (props: Omit<AlertDialogWrapperProps, 'actionVariant'>) => (
  <AlertDialogWrapper
    {...props}
    actionVariant="destructive"
    actionText={props.actionText || 'Excluir'}
  />
);

export const InfoDialog = (props: Omit<AlertDialogWrapperProps, 'showCancel' | 'actionText'>) => (
  <AlertDialogWrapper {...props} showCancel={false} actionText="OK" />
);

export default AlertDialogWrapper;
