import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/ui';

import { ReactNode } from 'react';

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface CustomDropdownMenuProps {
  trigger?: ReactNode;
  label?: string;
  icon?: ReactNode;
  items?: DropdownItem[];
  showSeparator?: boolean;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  children?: ReactNode;
}

export function CustomDropdownMenu({
  trigger,
  label,
  icon,
  items,
  showSeparator = true,
  className = '',
  open,
  defaultOpen,
  onOpenChange,
  modal,
  side,
  align,
  sideOffset,
  alignOffset,
  children,
}: CustomDropdownMenuProps) {
  const triggerNode = trigger ? (
    trigger
  ) : (
    <button
      type="button"
      className={cn(`inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-muted ${className}`)}
    >
      {icon}
      {!icon && label}
    </button>
  );
  return (
    <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <DropdownMenuTrigger asChild>{triggerNode}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        {children ? (
          children
        ) : (
          <>
            {label && <DropdownMenuLabel className="text-yellow-500">{label}</DropdownMenuLabel>}
            {label && showSeparator && <DropdownMenuSeparator />}
            {items?.map((item, idx) => (
              <DropdownMenuItem
                key={item.label + idx}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.icon && <span className="mr-0.5">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
