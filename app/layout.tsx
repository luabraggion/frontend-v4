import { BreadcrumbProvider, Footer } from '@/components/layout';
import HeaderWithTitle from '@/components/layout/HeaderWithTitle';
import { PageTitleProvider } from '@/components/PageTitleContext';
import { ThemeProvider } from '@/components/theme-provider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Fira_Sans, Manrope } from 'next/font/google';
import '../styles/globals.css';

/**
 * Configuração da fonte principal Manrope
 * - Otimizada para texto de interface e conteúdo geral
 * - Pesos: regular(400), medium(500), semibold(600), bold(700)
 * - Carregada com otimizações do Next.js para evitar FOUT
 * - Exportada como CSS variable: `--font-sans`
 */
const manrope = Manrope({
  subsets: ['latin'], // Apenas caracteres latinos para menor tamanho
  display: 'swap', // Usa fallback até que a fonte principal seja carregada
  weight: ['400', '500', '600', '700'], // Apenas os pesos necessários
  variable: '--font-sans', // Nome da variável CSS
  fallback: ['system-ui', 'arial'], // Fontes de fallback
  preload: true, // Precarregar para melhor performance
  adjustFontFallback: true, // Ajustar automaticamente as métricas de fallback
});

/**
 * Configuração da fonte de títulos Fira Sans
 * - Usada principalmente para cabeçalhos e elementos de destaque
 * - Pesos: medium(500), semibold(600), bold(700)
 * - Exportada como CSS variable: `--font-display`
 */
const firaSans = Fira_Sans({
  subsets: ['latin'], // Apenas caracteres latinos para menor tamanho
  display: 'swap', // Usa fallback até que a fonte seja carregada
  weight: ['500', '600', '700'], // Apenas pesos para títulos
  variable: '--font-display', // Nome da variável CSS
  fallback: ['Georgia', 'serif'], // Fontes de fallback apropriadas para títulos
  preload: true, // Precarregar para melhor performance
});

export const metadata: Metadata = {
  title: 'Portal de Benefícios',
  description:
    'Sistema completo para gestão de benefícios, premiações e sorteios com roleta para clientes. Permite resgate de prêmios, acompanhamento de pontos, campanhas de engajamento e experiências gamificadas.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={`${manrope.variable} ${firaSans.variable}`}
    >
      <body className="font-sans antialiased text-foreground bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PageTitleProvider>
            <BreadcrumbProvider>
              <div className="flex min-h-screen flex-col bg-secondary w-full px-10 pt-10 space-y-10">
                {/* Header com sombra suave e espaçamento melhorado */}
                <HeaderWithTitle className="pb-4 md:pb-6" titleSize="xl" />

                {/* Conteúdo principal com espaçamento apropriado */}
                <main className="flex-1 pb-10">{children}</main>

                {/* Footer com informações da empresa e versão */}
                <Footer
                  companyName="Big2be."
                  version="4.0.0"
                  className="bg-transparent mt-auto py-6"
                />
              </div>
            </BreadcrumbProvider>
          </PageTitleProvider>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
