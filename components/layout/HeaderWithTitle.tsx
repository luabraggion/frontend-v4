'use client';
import { usePageTitle } from '../PageTitleContext';
import { useBreadcrumb } from './BreadcrumbContext';
import { Header } from './Header';

/**
 * Componente que combina o Header com informações de contexto
 * Obtém automaticamente o título da página e os itens de breadcrumb dos contextos
 * correspondentes, simplificando a implementação do Header nos layouts.
 */
export default function HeaderWithTitle({
  className,
  titleSize,
  logoSrc,
}: {
  className?: string;
  titleSize?: 'lg' | 'xl' | '2xl' | '3xl';
  logoSrc?: string;
}) {
  const { title } = usePageTitle();
  const { items } = useBreadcrumb();

  return (
    <Header
      title={title || ''}
      breadcrumbItems={items}
      className={className}
      titleSize={titleSize}
      logoSrc={logoSrc}
    />
  );
}
