'use client';

import { Input as UIInput } from '@/components/ui/input';
import { Label as UILabel } from '@/components/ui/label';
import { cn } from '@/lib/ui';
import { memo, useId, useMemo, type ComponentProps, type ReactNode } from 'react';

/**
 * Interface das propriedades aceitas pelo componente Input
 */
interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  /**
   * ID do input (opcional, será gerado automaticamente se não fornecido)
   */
  id?: string;
  /**
   * Texto do label
   * @default "Título"
   */
  label?: string;
  /**
   * Se true, esconde o label
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Texto de ajuda exibido abaixo do input
   */
  helpText?: string;
  /**
   * Mensagem de erro
   */
  error?: string;
  /**
   * Se true, marca o campo como obrigatório
   * @default false
   */
  required?: boolean;
  /**
   * Ícone prefix (esquerda)
   */
  prefixIcon?: ReactNode;
  /**
   * Ícone suffix (direita)
   */
  suffixIcon?: ReactNode;
  /**
   * Classes CSS customizadas para o container
   */
  containerClassName?: string;
  /**
   * Classes CSS customizadas para o label
   */
  labelClassName?: string;
  /**
   * Tamanho do campo
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
}

// Configurações de tamanho
const sizeConfig = {
  sm: {
    input: 'h-8 text-sm',
    label: 'text-sm',
    help: 'text-xs',
  },
  md: {
    input: 'h-10 text-sm',
    label: 'text-sm',
    help: 'text-sm',
  },
  lg: {
    input: 'h-12 text-base',
    label: 'text-base',
    help: 'text-sm',
  },
} as const;

/**
 * Componente de input de formulário com label acessível e recursos avançados
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="seu@email.com"
 *   required
 *   helpText="Utilizaremos este email para comunicações importantes"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Pesquisar"
 *   prefixIcon={<SearchIcon />}
 *   suffixIcon={<Button size="sm">Buscar</Button>}
 *   error="Campo obrigatório"
 * />
 * ```
 */
export const Input = memo<InputProps>(
  ({
    id,
    type = 'text',
    label = 'Título',
    hideLabel = false,
    placeholder = '',
    className,
    containerClassName,
    labelClassName,
    helpText,
    error,
    required = false,
    prefixIcon,
    suffixIcon,
    size = 'md',
    ...props
  }) => {
    // Gera um id único se não for passado
    const autoId = useId();
    const inputId = id || autoId;

    // Se não passar name, usa inputId como valor padrão
    const name = props.name || inputId;

    // Memoiza as configurações de tamanho
    const styleConfig = useMemo(() => sizeConfig[size], [size]);

    // Memoiza se tem erro
    const hasError = useMemo(() => Boolean(error), [error]);

    // Classes do input
    const inputClasses = useMemo(
      () =>
        cn(
          styleConfig.input,
          hasError && 'border-destructive focus-visible:ring-destructive',
          prefixIcon && 'pl-10',
          suffixIcon && 'pr-10',
          className,
        ),
      [styleConfig.input, hasError, prefixIcon, suffixIcon, className],
    );

    // Classes do label
    const labelClasses = useMemo(
      () => cn(styleConfig.label, 'font-medium', hasError && 'text-destructive', labelClassName),
      [styleConfig.label, hasError, labelClassName],
    );

    return (
      <div className={cn('flex flex-col gap-3 flex-grow w-full', containerClassName)}>
        {/* Label */}
        {!hideLabel && (
          <UILabel htmlFor={inputId} className={labelClasses}>
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-label="obrigatório">
                *
              </span>
            )}
          </UILabel>
        )}

        {/* Container do Input */}
        {/* Ícone Prefix */}
        {prefixIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {prefixIcon}
          </div>
        )}

        {/* Input */}
        <UIInput
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            cn(helpText && `${inputId}-help`, error && `${inputId}-error`) || undefined
          }
          required={required}
          {...props}
        />

        {/* Ícone Suffix */}
        {suffixIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {suffixIcon}
          </div>
        )}

        {/* Texto de ajuda */}
        {helpText && !error && (
          <p id={`${inputId}-help`} className={cn('text-muted-foreground', styleConfig.help)}>
            {helpText}
          </p>
        )}

        {/* Mensagem de erro */}
        {error && (
          <p
            id={`${inputId}-error`}
            className={cn('text-destructive', styleConfig.help)}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

// Variações especializadas
export const SearchInput = memo<Omit<InputProps, 'type' | 'prefixIcon'>>((props) => (
  <Input type="search" prefixIcon={<SearchIcon className="h-4 w-4" />} {...props} />
));

SearchInput.displayName = 'SearchInput';

export const PasswordInput = memo<Omit<InputProps, 'type'>>((props) => (
  <Input type="password" {...props} />
));

PasswordInput.displayName = 'PasswordInput';

export const EmailInput = memo<Omit<InputProps, 'type'>>((props) => (
  <Input type="email" {...props} />
));

EmailInput.displayName = 'EmailInput';

// Ícone de busca para o SearchInput
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}
