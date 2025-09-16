'use client';

import React, { createContext, useContext, useState } from 'react';

const PageTitleContext = createContext<{
  title: string;
  setTitle: (t: string) => void;
}>({ title: '', setTitle: () => {} });

export function usePageTitle() {
  return useContext(PageTitleContext);
}

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>{children}</PageTitleContext.Provider>
  );
}
