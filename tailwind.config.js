// tailwind.config.js
export const theme = {
  extend: {
    fontFamily: {
      sans: ['var(--font-sans)', 'Manrope', 'sans-serif'],
      display: ['var(--font-display)', 'sans-serif'],
      gordita: ['Gordita', 'var(--font-sans)', 'sans-serif'],
    },
    colors: {
      success: {
        DEFAULT: 'oklch(var(--success))',
        foreground: 'oklch(var(--success-foreground))',
      },
      info: {
        DEFAULT: 'oklch(var(--info))',
        foreground: 'oklch(var(--info-foreground))',
      },
    },
  },
};
