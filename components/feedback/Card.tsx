// Componente Card
import {
  Card as UICard,
  CardContent as UICardContent,
  CardDescription as UICardDescription,
  CardFooter as UICardFooter,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/ui/utils';
import React from 'react';

// Remover a propriedade 'title' de HTMLAttributes para evitar conflito
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode; // Redefinir como ReactNode
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  hoverable?: boolean;
  bordered?: boolean;
  as?: React.ElementType; // Garantir que seja um elemento React válido
}

const CardComponent = ({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  hoverable = false,
  bordered = true,
  as: Component = UICard,
  ...props
}: CardProps) => {
  // Garantir que o componente passado para "as" seja válido
  const ValidComponent = Component || 'div';

  return (
    <ValidComponent
      className={cn(
        bordered ? 'border' : 'border-0',
        hoverable && 'transition-shadow hover:shadow-md',
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <UICardHeader className={headerClassName}>
          {title && typeof title === 'string' ? <UICardTitle>{title}</UICardTitle> : title}
          {description && typeof description === 'string' ? (
            <UICardDescription>{description}</UICardDescription>
          ) : (
            description
          )}
        </UICardHeader>
      )}

      {children && <UICardContent className={contentClassName}>{children}</UICardContent>}

      {footer && <UICardFooter className={footerClassName}>{footer}</UICardFooter>}
    </ValidComponent>
  );
};

// Usar React.memo para evitar renderizações desnecessárias
export const Card = React.memo(CardComponent);

// Exportando os componentes individuais para uso mais flexível
export const CardHeader = UICardHeader;
export const CardTitle = UICardTitle;
export const CardDescription = UICardDescription;
export const CardContent = UICardContent;
export const CardFooter = UICardFooter;

// Re-exportando o componente base do UI como UICard para possibilitar composição avançada
export { UICard };

export default Card;
