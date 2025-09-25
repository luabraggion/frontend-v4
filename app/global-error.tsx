'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Fira_Sans, Manrope } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
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

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  // Logged for debugging purposes
  console.error('Erro global da aplicação:', error);

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${manrope.variable} ${firaSans.variable} font-sans antialiased bg-gray-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="flex items-center justify-center text-6xl font-bold text-gray-500 mb-4 font-display">
                <Image
                  src="/images/logo.png"
                  alt="Big2be"
                  width={50}
                  height={50}
                  className="object-contain"
                  priority
                />
                <span className="align-middle bg-gradient-to-r from-red-500 to-red-700 bg-clip-text font-extrabold text-transparent">
                  Erro
                </span>
              </h1>
              <h2 className="text-2xl font-bold mb-4 text-gray-600">Erro crítico no sistema</h2>
              <p className="text-muted-foreground mb-6">
                Ocorreu um erro grave na aplicação. Nossa equipe foi notificada.
              </p>
              <div className="space-x-4">
                <button
                  onClick={reset}
                  className="inline-block font-semibold bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-500"
                >
                  Tentar novamente
                </button>
                <Link
                  href="/"
                  className="inline-block font-semibold border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100"
                >
                  Página inicial
                </Link>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
