/**
 * Variantes de cor globais para uso em componentes
 *
 * Este arquivo centraliza as definições de variantes de cor
 * para garantir consistência visual em toda a aplicação.
 */

// Variantes de cor base disponíveis globalmente
export const colorVariants = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'destructive',
  warning: 'warning',
  success: 'success',
  info: 'info',
  outline: 'outline',
  ghost: 'ghost',
  link: 'link',
} as const;

export type ColorVariant = keyof typeof colorVariants;

// Classes CSS para fundos baseados nas variantes
export const backgroundVariants = {
  default: 'bg-background',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  warning: 'bg-warning',
  success: 'bg-green-500',
  info: 'bg-blue-500',
  outline: 'bg-background border',
  ghost: 'bg-transparent',
  link: 'bg-transparent',
} as const;

// Classes CSS para textos baseados nas variantes
export const textVariants = {
  default: 'text-foreground',
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-white',
  warning: 'text-warning-foreground',
  success: 'text-white',
  info: 'text-white',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  link: 'text-primary',
} as const;

// Classes CSS para bordas baseadas nas variantes
export const borderVariants = {
  default: 'border-border',
  primary: 'border-primary',
  secondary: 'border-secondary',
  destructive: 'border-destructive',
  warning: 'border-warning',
  success: 'border-green-500',
  info: 'border-blue-500',
  outline: 'border-input',
  ghost: 'border-transparent',
  link: 'border-transparent',
} as const;

// Classes CSS para hover baseados nas variantes
export const hoverVariants = {
  default: 'hover:bg-accent hover:text-accent-foreground',
  primary: 'hover:bg-primary/90',
  secondary: 'hover:bg-secondary/80',
  destructive: 'hover:bg-destructive/90',
  warning: 'hover:bg-warning/90',
  success: 'hover:bg-green-500/80',
  info: 'hover:bg-blue-500/80',
  outline: 'hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'hover:underline',
} as const;

// Classes CSS para focus baseados nas variantes
export const focusVariants = {
  default: 'focus-visible:ring-ring',
  primary: 'focus-visible:ring-primary/20',
  secondary: 'focus-visible:ring-secondary/20',
  destructive: 'focus-visible:ring-destructive/20',
  warning: 'focus-visible:ring-warning/20',
  success: 'focus-visible:ring-green-500/20',
  info: 'focus-visible:ring-blue-500/20',
  outline: 'focus-visible:ring-ring',
  ghost: 'focus-visible:ring-ring',
  link: 'focus-visible:ring-primary/20',
} as const;

/**
 * Função utilitária para combinar classes de variante
 *
 * @param variant - A variante de cor a ser aplicada
 * @param includeHover - Se deve incluir estados de hover (padrão: true)
 * @param includeFocus - Se deve incluir estados de focus (padrão: true)
 * @returns String com classes CSS combinadas
 *
 * @example
 * ```tsx
 * const classes = getVariantClasses('warning');
 * // Retorna: "bg-warning text-warning-foreground border-warning hover:bg-warning/90 focus-visible:ring-warning/20"
 * ```
 */
export function getVariantClasses(
  variant: ColorVariant = 'default',
  options: {
    includeHover?: boolean;
    includeFocus?: boolean;
    includeBorder?: boolean;
  } = {},
): string {
  const { includeHover = true, includeFocus = true, includeBorder = false } = options;

  const classes: string[] = [backgroundVariants[variant], textVariants[variant]];

  if (includeBorder) {
    classes.push(borderVariants[variant]);
  }

  if (includeHover) {
    classes.push(hoverVariants[variant]);
  }

  if (includeFocus) {
    classes.push(focusVariants[variant]);
  }

  return classes.join(' ');
}

/**
 * Função utilitária para obter apenas a cor de background da variante
 *
 * @param variant - A variante de cor
 * @returns Classe CSS de background
 *
 * @example
 * ```tsx
 * const bgClass = getVariantBackground('warning');
 * // Retorna: "bg-warning"
 * ```
 */
export function getVariantBackground(variant: ColorVariant = 'default'): string {
  return backgroundVariants[variant];
}

/**
 * Função utilitária para obter apenas a cor de texto da variante
 *
 * @param variant - A variante de cor
 * @returns Classe CSS de texto
 *
 * @example
 * ```tsx
 * const textClass = getVariantText('warning');
 * // Retorna: "text-warning-foreground"
 * ```
 */
export function getVariantText(variant: ColorVariant = 'default'): string {
  return textVariants[variant];
}

/**
 * Função utilitária para obter apenas a cor de borda da variante
 *
 * @param variant - A variante de cor
 * @returns Classe CSS de borda
 *
 * @example
 * ```tsx
 * const borderClass = getVariantBorder('warning');
 * // Retorna: "border-warning"
 * ```
 */
export function getVariantBorder(variant: ColorVariant = 'default'): string {
  return borderVariants[variant];
}

/**
 * Type helper para componentes que usam variantes de cor
 */
export type VariantPropsWithColor<T = Record<string, unknown>> = T & {
  variant?: ColorVariant;
};

// Re-exporta o tipo VariantProps do CVA para conveniência
export type { VariantProps } from 'class-variance-authority';
