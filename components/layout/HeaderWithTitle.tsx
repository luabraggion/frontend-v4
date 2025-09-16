'use client';
import { usePageTitle } from '../PageTitleContext';
import { Header } from './Header';

export default function HeaderWithTitle() {
  const { title } = usePageTitle();
  return <Header title={title || ''} />;
}
