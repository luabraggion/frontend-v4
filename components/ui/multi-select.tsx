'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // Importa o Checkbox do ShadCN
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/ui/index';
import { ChevronsUpDownIcon, XIcon } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

type MultiSelectContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedValues: Set<string>;
  toggleValue: (value: string) => void;
  items: Map<string, ReactNode>;
  onItemAdded: (value: string, label: ReactNode) => void;
};
const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
}: {
  children: ReactNode;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState(new Set<string>(values ?? defaultValues));
  const selectedValues = values ? new Set(values) : internalValues;
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

  const toggleValue = useCallback(
    (value: string) => {
      setInternalValues((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        onValuesChange?.([...newSet]);
        return newSet;
      });
    },
    [onValuesChange],
  );

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.has(value)) return prev; // Evita atualizações desnecessárias
      const newMap = new Map(prev);
      newMap.set(value, label);
      return newMap;
    });
  }, []);

  useEffect(() => {
    // Garante que o estado inicial seja configurado apenas uma vez
    if (defaultValues) {
      const initialItems = new Map<string, ReactNode>();
      defaultValues.forEach((value) => {
        initialItems.set(value, value); // Substitua por lógica adequada se necessário
      });
      setItems(initialItems);
    }
  }, [defaultValues]);

  return (
    <MultiSelectContext.Provider
      value={{
        open,
        setOpen,
        selectedValues,
        toggleValue,
        items,
        onItemAdded,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  );
}

export function MultiSelectTrigger({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open } = useMultiSelectContext();

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        variant={props.variant ?? 'outline'}
        role={props.role ?? 'combobox'}
        aria-expanded={props['aria-expanded'] ?? open}
        className={cn(
          "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-transparent px-3 py-1.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className,
        )}
      >
        {children}
        <ChevronsUpDownIcon className="size-4 shrink-0" />
      </Button>
    </PopoverTrigger>
  );
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = 'wrap-when-open',
  ...props
}: {
  placeholder?: string;
  clickToRemove?: boolean;
  overflowBehavior?: 'wrap' | 'wrap-when-open' | 'cutoff';
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext();
  const [overflowAmount, setOverflowAmount] = useState(0);
  const valueRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const shouldWrap = overflowBehavior === 'wrap' || (overflowBehavior === 'wrap-when-open' && open);

  const checkOverflow = useCallback(() => {
    if (valueRef.current == null) return;

    const containerElement = valueRef.current;
    const overflowElement = overflowRef.current;
    const items = containerElement.querySelectorAll<HTMLElement>('[data-selected-item]');

    if (overflowElement != null) overflowElement.style.display = 'none';
    items.forEach((child) => child.style.removeProperty('display'));
    let amount = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const child = items[i];
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break;
      }
      amount = items.length - i;
      child.style.display = 'none';
      overflowElement?.style.removeProperty('display');
    }
    setOverflowAmount(amount);
  }, []);

  useLayoutEffect(() => {
    checkOverflow();
  }, [selectedValues, checkOverflow, shouldWrap]);

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node;

      const observer = new ResizeObserver(checkOverflow);
      observer.observe(node);

      return () => {
        observer.disconnect();
        valueRef.current = null;
      };
    },
    [checkOverflow],
  );

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="min-w-0 overflow-hidden font-normal text-muted-foreground">
        {placeholder}
      </span>
    );
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn(
        'flex w-full gap-1.5 overflow-hidden',
        shouldWrap && 'h-full flex-nowrap',
        className,
      )}
    >
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            variant="outline"
            data-selected-item
            className="group flex items-center gap-1"
            key={value}
            onClick={
              clickToRemove
                ? (e) => {
                    e.stopPropagation();
                    toggleValue(value);
                  }
                : undefined
            }
          >
            {items.get(value)}
            {clickToRemove && (
              <XIcon className="size-2 text-muted-foreground group-hover:text-destructive" />
            )}
          </Badge>
        ))}
      <Badge
        style={{
          display: overflowAmount > 0 && !shouldWrap ? 'block' : 'none',
        }}
        variant="outline"
        ref={overflowRef}
      >
        +{overflowAmount}
      </Badge>
    </div>
  );
}

export function MultiSelectContent({
  search = true,
  children,
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string };
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Command>, 'children'>) {
  const canSearch = typeof search === 'object' ? true : search;

  return (
    <>
      <div style={{ display: 'none' }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={typeof search === 'object' ? search.placeholder : undefined}
            />
          ) : (
            <button autoFocus className="sr-only" />
          )}
          <CommandList>
            {canSearch && (
              <CommandEmpty>
                {typeof search === 'object' ? search.emptyMessage : undefined}
              </CommandEmpty>
            )}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: {
  badgeLabel?: ReactNode;
  value: string;
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, 'value'>) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children);
  }, [value, children, onItemAdded, badgeLabel]);

  const handleSelect = () => {
    toggleValue(value);
    onSelect?.(value);
  };

  return (
    <CommandItem
      {...props}
      onSelect={() => {
        handleSelect(); // Garante que o evento de seleção seja chamado
      }}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => toggleValue(value)}
        className="mr-2 bg-white"
      />
      {children}
    </CommandItem>
  );
}

export function MultiSelectGroup(props: ComponentPropsWithoutRef<typeof CommandGroup>) {
  return <CommandGroup {...props} />;
}

export function MultiSelectSeparator(props: ComponentPropsWithoutRef<typeof CommandSeparator>) {
  return <CommandSeparator {...props} />;
}

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error('useMultiSelectContext must be used within a MultiSelectContext');
  }
  return context; // Certifique-se de que o contexto retorna todas as propriedades necessárias
}
