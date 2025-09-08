import { Footer } from '@/components/layout';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Fira_Sans, Manrope } from 'next/font/google';
import '../styles/globals.css';

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const firaSans = Fira_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
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
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${manrope.variable} ${firaSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer companyName="Big2be." version="4.0.0" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
