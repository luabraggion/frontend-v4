// Configuração de temas
export const themes = {
  light: {
    name: 'light',
    colors: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.13 0.028 261.692)',
      primary: 'oklch(0.21 0.034 264.665)',
      primaryForeground: 'oklch(0.985 0.002 247.839)',
      secondary: 'oklch(0.967 0.003 264.542)',
      secondaryForeground: 'oklch(0.21 0.034 264.665)',
      muted: 'oklch(0.967 0.003 264.542)',
      mutedForeground: 'oklch(0.551 0.027 264.364)',
      accent: 'oklch(0.967 0.003 264.542)',
      accentForeground: 'oklch(0.21 0.034 264.665)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.985 0.002 247.839)',
      border: 'oklch(0.928 0.006 264.531)',
      input: 'oklch(0.928 0.006 264.531)',
      ring: 'oklch(0.707 0.022 261.325)',
      warning: 'oklch(0.704 0.191 82.216)',
      warningForeground: 'oklch(0.13 0.028 261.692)',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: 'oklch(0.13 0.028 261.692)',
      foreground: 'oklch(0.985 0.002 247.839)',
      primary: 'oklch(0.928 0.006 264.531)',
      primaryForeground: 'oklch(0.21 0.034 264.665)',
      secondary: 'oklch(0.278 0.033 256.848)',
      secondaryForeground: 'oklch(0.985 0.002 247.839)',
      muted: 'oklch(0.278 0.033 256.848)',
      mutedForeground: 'oklch(0.707 0.022 261.325)',
      accent: 'oklch(0.278 0.033 256.848)',
      accentForeground: 'oklch(0.985 0.002 247.839)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.985 0.002 247.839)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.551 0.027 264.364)',
      warning: 'oklch(0.704 0.191 82.216)',
      warningForeground: 'oklch(0.985 0.002 247.839)',
    },
  },
} as const;

export type Theme = keyof typeof themes;
export type ThemeColors = typeof themes.light.colors;

// Função para aplicar tema dinamicamente
export function applyTheme(themeName: Theme) {
  if (typeof document === 'undefined') return;

  const theme = themes[themeName];
  const root = document.documentElement;

  // Remover classes de tema existentes
  root.classList.remove('light', 'dark');

  // Adicionar nova classe de tema
  root.classList.add(theme.name);

  // Aplicar variáveis CSS customizadas (opcional)
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
}

// Hook para tema (seria usado em um componente React)
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Salvar preferência do usuário
export function saveThemePreference(theme: Theme) {
  if (typeof localStorage === 'undefined') return;

  localStorage.setItem('theme-preference', theme);
}

// Carregar preferência do usuário
export function loadThemePreference(): Theme | null {
  if (typeof localStorage === 'undefined') return null;

  const saved = localStorage.getItem('theme-preference');
  return saved as Theme | null;
}

// Configuração de breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Configuração de espaçamentos
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
} as const;

// Configuração de tipografia
export const typography = {
  fontFamily: {
    sans: ['Manrope', 'Arial', 'Helvetica', 'sans-serif'],
    display: ['Fira Sans', 'Arial', 'Helvetica', 'sans-serif'],
    gorditas: ['Gordita', 'Arial', 'Helvetica', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '0.95rem', // 15.2px (customizado)
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
} as const;
