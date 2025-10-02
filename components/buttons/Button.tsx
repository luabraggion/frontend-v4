import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/ui';

/**
 * Extended button variants que adiciona as variantes warning e info
 * sem modificar o componente base do shadcn/ui
 */
const extendedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        warning:
          'bg-warning text-white shadow-xs hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40',
        success:
          'bg-success text-success-foreground shadow-xs hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40',
        info: 'bg-info text-info-foreground shadow-xs hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ExtendedVariant =
  | 'default'
  | 'destructive'
  | 'warning'
  | 'success'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type BaseVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

interface ExtendedButtonProps extends Omit<React.ComponentProps<'button'>, 'variant'> {
  variant?: ExtendedVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
}

/**
 * Button component que estende o shadcn/ui Button com suporte às variantes warning, success e info
 *
 * @example
 * ```tsx
 * // Variantes padrão (usa shadcn/ui diretamente)
 * <Button variant="default">Botão Padrão</Button>
 * <Button variant="destructive">Botão Destrutivo</Button>
 *
 * // Variantes customizadas
 * <Button variant="warning">Botão Warning</Button>
 * <Button variant="success">Botão Sucesso</Button>
 * <Button variant="info">Botão Info</Button>
 * ```
 */
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: ExtendedButtonProps) {
  // Se não for warning, success ou info, usar o componente shadcn/ui original
  if (variant !== 'warning' && variant !== 'success' && variant !== 'info') {
    return (
      <ShadcnButton
        variant={variant as BaseVariant}
        size={size}
        asChild={asChild}
        className={className}
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }

  // Para warning, success ou info, usar nosso componente customizado
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(extendedButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, extendedButtonVariants as buttonVariants };
export type { ExtendedButtonProps as ButtonProps };
