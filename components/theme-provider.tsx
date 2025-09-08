'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import * as React from 'react';
import { memo } from 'react';

interface CustomThemeProviderProps extends Omit<ThemeProviderProps, 'children'> {
  children: React.ReactNode;
}

/**
 * Componente ThemeProvider customizado para gerenciamento de temas
 *
 * @example
 * ```tsx
 * <ThemeProvider
 *   attribute="class"
 *   defaultTheme="system"
 *   enableSystem
 *   disableTransitionOnChange
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = memo<CustomThemeProviderProps>(
  ({
    children,
    attribute = 'class',
    defaultTheme = 'system',
    enableSystem = true,
    disableTransitionOnChange = true,
    ...props
  }) => {
    return (
      <NextThemesProvider
        attribute={attribute}
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        disableTransitionOnChange={disableTransitionOnChange}
        {...props}
      >
        {children}
      </NextThemesProvider>
    );
  },
);

ThemeProvider.displayName = 'ThemeProvider';
