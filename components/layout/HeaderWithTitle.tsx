'use client';
import { usePageTitle } from '../PageTitleContext';
import { useBreadcrumb } from './BreadcrumbContext';
import { Header } from './Header';

export default function HeaderWithTitle() {
  const { title } = usePageTitle();
  const { items } = useBreadcrumb();

  return <Header title={title || ''} breadcrumbItems={items} />;
}
